import { useState, useEffect } from "react";
import { getClientId } from "@/lib/api";
import { useAuth } from "./useAuth";

export function useClientInfo() {
  const [clientId, setClientId] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const storedClientId = getClientId();
      setClientId(storedClientId);
    } else {
      setClientId(null);
    }
  }, [isAuthenticated]);

  return {
    clientId,
  };
}
