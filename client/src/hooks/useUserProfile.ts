import { useState, useEffect } from "react";
import { getUserProfile, getStoredUserProfile, type UserProfile } from "@/lib/api";
import { useAuth } from "./useAuth";

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchProfile = async () => {
    if (!isAuthenticated) {
      setProfile(null);
      return;
    }

    // First try to get stored profile (fast, no API call needed)
    const storedProfile = getStoredUserProfile();
    if (storedProfile) {
      setProfile(storedProfile);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch user profile";
      setError(errorMessage);
      console.error("Failed to fetch user profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}
