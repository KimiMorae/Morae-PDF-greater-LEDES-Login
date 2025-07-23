import { AlertTriangleIcon, ArrowLeftIcon, UploadIcon, FilesIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MultipleLedes = (): JSX.Element => {
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
            {/* Back Button */}
            <Link href="/home">
              <Button variant="ghost" className="mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            {/* Title */}
            <div className="text-center space-y-4">
              <h1 className="font-sans font-bold text-black dark:text-white text-3xl tracking-[0] leading-normal">
                Convert Multiple PDFs to LEDES
              </h1>
              <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-lg tracking-[0] leading-relaxed">
                Upload multiple PDF documents to batch convert them to LEDES format.
              </p>
            </div>

            {/* Upload Area */}
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6">
                <div className="flex items-center justify-center mb-4">
                  <FilesIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="font-sans font-semibold text-black dark:text-white text-xl mb-2">
                  Upload multiple PDF files
                </h3>
                <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-base text-center mb-6">
                  Drag and drop multiple PDF files here, or click to browse and select files
                </p>
                <Button className="font-sans font-medium text-white text-base bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-700 dark:hover:bg-neutral-600">
                  Choose Files
                </Button>
                <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm mt-4">
                  Supported format: PDF (max 50MB each, up to 20 files)
                </p>
              </CardContent>
            </Card>

            {/* Batch Processing Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="font-sans font-semibold text-black dark:text-white text-lg">
                    Batch Processing Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm">
                    • Process up to 20 files simultaneously
                  </p>
                  <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm">
                    • Automated file organization and naming
                  </p>
                  <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm">
                    • Progress tracking for each file
                  </p>
                  <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm">
                    • Consolidated download of all LEDES files
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="font-sans font-semibold text-black dark:text-white text-lg">
                    Processing Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm">
                    • 1-5 files: 2-5 minutes
                  </p>
                  <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm">
                    • 6-10 files: 5-10 minutes
                  </p>
                  <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm">
                    • 11-20 files: 10-20 minutes
                  </p>
                  <p className="font-sans font-normal text-[#53585a] dark:text-gray-400 text-sm">
                    • Files processed in parallel for efficiency
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};