import { EyeOffIcon, AlertTriangleIcon } from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { login } from "@/lib/api";

export const Login = (): JSX.Element => {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginResponse = await login({ email, password });

      console.log("Login successful:");
      console.log(
        "Access token:",
        loginResponse.access_token.substring(0, 20) + "..."
      );
      console.log("Token type:", loginResponse.token_type);
      console.log("Expires in:", loginResponse.expires_in);
      console.log("Scope:", loginResponse.scope);
      console.log("Client ID:", loginResponse.client_id);
      console.log("Client Secret stored:", !!loginResponse.client_secret);

      setLocation("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = () => {
    // Microsoft OAuth integration would go here
    console.log("Microsoft OAuth not implemented yet");
  };
  // Data for links in the login form
  const loginLinks = [
    { text: "Request access...", href: "#" },
    { text: "Reset password...", href: "#" },
  ];

  return (
    <div className="bg-white flex flex-col min-h-screen w-full">
      <Header showAuthButtons={false} />

      {/* Main Content */}
      <div className="flex-1 w-full bg-[url(/figmaAssets/background-image.png)] bg-cover bg-center relative flex flex-col">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 p-4 sm:p-8">
          <img
            className="w-32 sm:w-[260px] h-1 sm:h-2 order-2 sm:order-1"
            alt="Ellipses container"
            src="/figmaAssets/ellipses-container.png"
          />
          <div className="font-sans font-bold text-black text-2xl sm:text-[32px] tracking-[0] leading-normal order-1 sm:order-2">
            Welcome
          </div>
        </div>

        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="flex flex-col w-full max-w-[280px] items-center gap-[30px]">
            <Card className="flex flex-col items-start gap-[25px] p-[15px] relative self-stretch w-full flex-[0_0_auto] bg-[#f9f9f9] rounded-[17px_23px_23px_23px] border-2 border-solid border-[#d7dbdd] shadow-[0px_2px_42px_#00000026]">
              <CardContent className="p-0 space-y-[25px] w-full">
                <div className="relative w-fit mt-[-2.00px] font-sans font-bold text-black text-xl tracking-[0] leading-normal whitespace-nowrap">
                  Login
                </div>

                <form
                  onSubmit={handleLogin}
                  className="inline-flex flex-col items-start gap-2.5 relative flex-[0_0_auto]"
                >
                  <div className="inline-flex flex-col items-start gap-[3px] relative flex-[0_0_auto]">
                    <label className="relative w-fit mt-[-1.00px] font-sans font-semibold text-black text-xs tracking-[0] leading-normal">
                      Username / email
                    </label>

                    <div className="flex w-full sm:w-[250px] h-[42px] items-center gap-2.5 px-2.5 py-[7px] relative bg-white rounded border border-solid border-[#d7dbdd]">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-0 p-0 h-auto shadow-none font-sans font-normal text-black text-sm tracking-[0] leading-normal flex-1"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="inline-flex flex-col items-start gap-[3px] relative flex-[0_0_auto]">
                    <label className="relative w-fit mt-[-1.00px] font-sans font-semibold text-black text-xs tracking-[0] leading-normal">
                      Password
                    </label>

                    <div className="flex w-full sm:w-[250px] h-[42px] items-center gap-2.5 px-2.5 py-[7px] relative bg-white rounded border border-solid border-[#d7dbdd]">
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-0 p-0 h-auto shadow-none font-sans font-normal text-black text-sm tracking-[0] leading-normal flex-1"
                        placeholder="Enter your password"
                        required
                      />

                      <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
                        <EyeOffIcon className="w-5 h-5 sm:w-7 sm:h-7" />
                      </div>
                    </div>
                  </div>
                </form>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-gray-100 border border-gray-300 rounded-md">
                    <AlertTriangleIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-between px-[5px] py-2.5 relative self-stretch w-full flex-[0_0_auto]">
                  {loginLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="relative w-fit mt-[-1.00px] font-sans font-medium text-[#00a3ff] text-xs tracking-[0] leading-normal underline"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>

                <div className="flex items-center justify-end self-stretch w-full gap-2.5 relative flex-[0_0_auto]">
                  <Button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="h-[43px] px-3.5 py-3 bg-neutral-800 rounded-[9px] shadow-[0px_2px_4px_#0000000d] font-sans font-medium text-white text-base disabled:opacity-50"
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="relative self-stretch font-sans font-medium text-black text-base text-center tracking-[0] leading-normal">
              or
            </div>

            <Button
              onClick={handleMicrosoftLogin}
              variant="outline"
              className="inline-flex h-[43px] w-full items-center justify-center gap-2.5 px-3.5 py-3 bg-[#f9f9f9] rounded-[21px] border-2 border-solid border-[#d7dbdd] shadow-[0px_2px_4px_#0000000d]"
            >
              <div className="inline-flex items-center justify-center relative flex-[0_0_auto] mt-[-4.50px] mb-[-4.50px]">
                <img
                  className="relative w-5 h-5 sm:w-7 sm:h-7"
                  alt="Microsoft windows"
                  src="/figmaAssets/microsoft-windows.svg"
                />
              </div>

              <span className="font-sans font-medium text-neutral-800 text-sm sm:text-base tracking-[0] leading-normal whitespace-nowrap">
                Sign in with Microsoft
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
