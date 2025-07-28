import { Home, LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export const Sidebar = (): JSX.Element => {
  const { logout } = useAuth();
  const [location, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  const handleHomeClick = () => {
    setLocation("/home");
  };

  return (
    <div className="fixed left-0 top-[95px] h-[calc(100vh-95px)] w-[15%] bg-white border-r-2 border-[#f9f9f9] flex flex-col z-20">
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <Button
          onClick={handleHomeClick}
          variant="ghost"
          className={`w-full justify-start gap-3 h-12 px-4 mb-2 ${
            location === "/home"
              ? "bg-white text-gray-700 hover:bg-gray-200"
              : "text-gray-600 hover:bg-white hover:text-gray-700"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-sans font-medium text-sm">Home</span>
        </Button>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-3 h-10 px-4 text-gray-700">
          <img
            className="w-6 h-6"
            alt="Profile"
            src="/figmaAssets/profile-icon.svg"
          />
          <span className="font-sans font-normal text-sm">John Doe</span>
        </div>
      </div>
    </div>
  );
};
