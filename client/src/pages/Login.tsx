import { AlertTriangleIcon, EyeOffIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Login = (): JSX.Element => {
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

                <div className="inline-flex flex-col items-start gap-2.5 relative flex-[0_0_auto]">
                  <div className="inline-flex flex-col items-start gap-[3px] relative flex-[0_0_auto]">
                    <label className="relative w-fit mt-[-1.00px] font-sans font-semibold text-black text-xs tracking-[0] leading-normal">
                      Username / email
                    </label>

                    <div className="flex w-[250px] h-[42px] items-center gap-2.5 px-2.5 py-[7px] relative bg-white rounded border border-solid border-[#d7dbdd]">
                      <Input
                        className="border-0 p-0 h-auto shadow-none font-sans font-normal text-[#d7dbdd] text-sm tracking-[0] leading-normal"
                        placeholder="Enter your email or username..."
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
                        className="border-0 p-0 h-auto shadow-none font-sans font-normal text-[#d7dbdd] text-sm tracking-[0] leading-normal"
                        placeholder="Enter your password..."
                      />

                      <div className="inline-flex items-center justify-center relative flex-[0_0_auto]">
                        <EyeOffIcon className="w-7 h-7" />
                      </div>
                    </div>
                  </div>
                </div>

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
                  <Button className="h-[43px] px-3.5 py-3 bg-neutral-800 rounded-[9px] shadow-[0px_2px_4px_#0000000d] font-sans font-medium text-white text-base">
                    Login
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="relative self-stretch font-sans font-medium text-black text-base text-center tracking-[0] leading-normal">
              or
            </div>

            <Button
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
