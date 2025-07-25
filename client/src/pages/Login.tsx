import { AlertTriangleIcon, EyeOffIcon } from "lucide-react";
import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api";

export const Login = (): JSX.Element => {
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState(
    import.meta.env.VITE_USER_EMAIL || ""
  );
  const [password, setPassword] = useState(
    import.meta.env.VITE_USER_PASSWORD || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const loginResponse = await login({ email, password });

      console.log("Login successful:");
      console.log("Access token:", loginResponse.access_token.substring(0, 20) + "...");
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
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1728px] h-[1117px] relative">
        <div className="absolute w-full h-[1022px] top-[95px] left-0 bg-[url(/figmaAssets/background-image.png)] bg-cover bg-[50%_50%]">
          <div className="absolute top-[21px] left-[305px] font-sans font-bold text-black text-[32px] tracking-[0] leading-normal">
            Welcome
          </div>

          <img
            className="absolute w-[260px] h-2 top-[38px] left-5"
            alt="Ellipses container"
            src="/figmaAssets/ellipses-container.png"
          />

          <div className="flex flex-col w-[280px] items-center gap-[30px] absolute top-[326px] left-[724px]">
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

                    <div className="flex w-[250px] h-[42px] items-center gap-2.5 px-2.5 py-[7px] relative bg-white rounded border border-solid border-[#d7dbdd]">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-0 p-0 h-auto shadow-none font-sans font-normal text-black text-sm tracking-[0] leading-normal"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="inline-flex flex-col items-start gap-[3px] relative flex-[0_0_auto]">
                    <label className="relative w-fit mt-[-1.00px] font-sans font-semibold text-black text-xs tracking-[0] leading-normal">
                      Password
                    </label>

                    <div className="flex w-[250px] h-[42px] items-center gap-2.5 px-2.5 py-[7px] relative bg-white rounded border border-solid border-[#d7dbdd]">
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-0 p-0 h-auto shadow-none font-sans font-normal text-black text-sm tracking-[0] leading-normal"
                        placeholder="Enter your password"
                        required
                      />

                      <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
                        <EyeOffIcon className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                </form>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                    <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-700">{error}</span>
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
                  className="relative w-7 h-7"
                  alt="Microsoft windows"
                  src="/figmaAssets/microsoft-windows.svg"
                />
              </div>

              <span className="font-sans font-medium text-neutral-800 text-base tracking-[0] leading-normal whitespace-nowrap">
                Sign in with Microsoft
              </span>
            </Button>
          </div>
        </div>

        <header className="flex w-full h-[95px] items-center justify-between px-[25px] py-[21px] absolute top-0 left-0 bg-[#fefefe] border-b-2 border-[#f9f9f9]">
          <div className="inline-flex items-center gap-[19px] relative flex-[0_0_auto] mt-[-2.22px] mb-[-2.22px]">
            <img
              className="relative flex-[0_0_auto]"
              alt="Morae logo"
              src="/figmaAssets/morae-logo.svg"
            />

            <div className="relative w-[52px] h-[52px] bg-[#d3e4f3] rounded-[26px]">
              <img
                className="absolute w-[49px] h-10 top-3 left-[3px]"
                alt="Subtract"
                src="/figmaAssets/subtract.svg"
              />
            </div>

            <div className="flex flex-col w-60 items-start gap-[3px] relative">
              <div className="relative self-stretch mt-[-1.00px] font-sans font-bold text-black text-xl tracking-[0] leading-normal">
                PDF → LEDES
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            className="inline-flex h-[37px] items-center gap-2.5 p-2.5 relative flex-[0_0_auto] rounded-[5px]"
          >
            <AlertTriangleIcon className="w-7 h-7" />
            <span className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
              Support
            </span>
          </Button>
        </header>
      </div>
    </div>
  );
};
