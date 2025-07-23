import { AlertTriangleIcon, FileTextIcon, FilesIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Home = (): JSX.Element => {
  const options = [
    {
      id: "single",
      title: "One LEDES",
      description: "Convert a single PDF document to LEDES format",
      icon: FileTextIcon,
      href: "/convert/single",
      color: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "multiple",
      title: "Multiple LEDES", 
      description: "Convert multiple PDF documents to LEDES format in batch",
      icon: FilesIcon,
      href: "/convert/multiple",
      color: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white dark:bg-gray-900 w-full max-w-[1728px] relative">
        {/* Header */}
        <header className="flex w-full h-[95px] items-center justify-between px-[25px] py-[21px] bg-[#fefefe] dark:bg-gray-800 border-b-2 border-[#f9f9f9] dark:border-gray-700">
          <div className="inline-flex items-center gap-[19px] relative flex-[0_0_auto] mt-[-2.22px] mb-[-2.22px]">
            <img
              className="relative flex-[0_0_auto]"
              alt="Morae logo"
              src="/figmaAssets/morae-logo.svg"
            />

            <div className="relative w-[52px] h-[52px] bg-[#d3e4f3] dark:bg-blue-800 rounded-[26px]">
              <img
                className="absolute w-[49px] h-10 top-3 left-[3px]"
                alt="Subtract"
                src="/figmaAssets/subtract.svg"
              />
            </div>

            <div className="flex flex-col w-60 items-start gap-[3px] relative">
              <div className="relative self-stretch mt-[-1.00px] font-sans font-bold text-black dark:text-white text-xl tracking-[0] leading-normal">
                PDF → LEDES
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            className="inline-flex h-[37px] items-center gap-2.5 p-2.5 relative flex-[0_0_auto] rounded-[5px]"
          >
            <AlertTriangleIcon className="w-7 h-7" />
            <span className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm tracking-[0] leading-normal">
              Support
            </span>
          </Button>
        </header>

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center px-8 py-16 min-h-[calc(100vh-95px)]">
          <div className="max-w-4xl w-full space-y-8">
            {/* Welcome Section */}
            <div className="text-center space-y-4">
              <h1 className="font-sans font-bold text-black dark:text-white text-4xl tracking-[0] leading-normal">
                Welcome to PDF → LEDES Converter
              </h1>
              <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-lg tracking-[0] leading-relaxed max-w-2xl mx-auto">
                Choose how you'd like to convert your PDF documents to LEDES format. 
                You can process a single document or batch convert multiple files at once.
              </p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {options.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Link key={option.id} href={option.href}>
                    <Card className={`h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${option.color}`}>
                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-4">
                          <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-md">
                            <IconComponent className={`w-12 h-12 ${option.iconColor}`} />
                          </div>
                        </div>
                        <CardTitle className="font-sans font-bold text-black dark:text-white text-2xl tracking-[0] leading-normal">
                          {option.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-base tracking-[0] leading-relaxed">
                          {option.description}
                        </p>
                        <Button 
                          className="mt-6 w-full font-sans font-medium text-white text-base bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-700 dark:hover:bg-neutral-600"
                        >
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="text-center mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-sans font-medium text-[#53585a] dark:text-gray-400 text-sm tracking-[0] leading-normal">
                Need help? Our support team is here to assist you with any questions about the conversion process.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};