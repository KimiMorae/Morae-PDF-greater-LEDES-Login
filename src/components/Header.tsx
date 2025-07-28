import { AlertTriangleIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface HeaderProps {
  showAuthButtons?: boolean;
}

export const Header = ({
  showAuthButtons = true,
}: HeaderProps): JSX.Element => {
  const { logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="flex w-full h-[95px] items-center justify-between px-4 sm:px-[25px] py-[21px] bg-[#fefefe] border-b-2 border-[#f9f9f9] flex-shrink-0">
      <div className="inline-flex items-center gap-3 sm:gap-[19px] relative flex-[0_0_auto]">
        <img
          className="relative flex-[0_0_auto] h-8 sm:h-auto"
          alt="Morae logo"
          src="/figmaAssets/morae-logo.svg"
        />

        <div className="relative w-10 h-10 sm:w-[52px] sm:h-[52px] bg-gray-200 rounded-full">
          <img
            className="absolute w-8 h-6 sm:w-[49px] sm:h-10 top-2 left-1 sm:top-3 sm:left-[3px]"
            alt="Subtract"
            src="/figmaAssets/subtract.svg"
          />
        </div>

        <div className="flex flex-col items-start gap-[3px] relative">
          <div className="relative font-sans font-bold text-black text-lg sm:text-xl tracking-[0] leading-normal">
            PDF → LEDES
          </div>
        </div>
      </div>

      {showAuthButtons && (
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            className="inline-flex h-[37px] items-center gap-2.5 p-2.5 relative flex-[0_0_auto] rounded-[5px]"
          >
            <AlertTriangleIcon className="w-5 h-5 sm:w-7 sm:h-7 text-red-400" />
            <span className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal hidden sm:inline">
              Support
            </span>
          </Button>
        </div>
      )}
    </header>
  );
};
