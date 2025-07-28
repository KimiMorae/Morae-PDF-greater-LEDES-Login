import { Home, LogOut, AlertTriangle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useState } from "react";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({
  isOpen = true,
  onToggle,
}: SidebarProps): JSX.Element => {
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
    <>
      {/* Desktop Sidebar - Always visible on lg+ screens */}
      <div className="hidden lg:flex fixed left-0 top-[95px] h-[calc(100vh-95px)] w-[15%] bg-white border-r-2 border-[#f9f9f9] flex-col z-20">
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

      {/* Mobile Sidebar - Overlay when open */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onToggle}
          />

          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white flex flex-col z-50">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-sans font-semibold text-lg text-gray-900">
                Menu
              </h2>
              <Button
                onClick={onToggle}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6">
              <Button
                onClick={() => {
                  handleHomeClick();
                  onToggle?.();
                }}
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
        </div>
      )}
    </>
  );
};

// Hamburger Menu Button Component
export const HamburgerButton = ({
  onClick,
}: {
  onClick: () => void;
}): JSX.Element => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className="lg:hidden h-8 w-8 p-0"
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
};
