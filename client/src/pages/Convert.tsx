import { AlertTriangleIcon, ArrowLeftIcon } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export const Convert = (): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const isMultiple = selectedFiles.length > 1;
  const pageTitle = isMultiple ? "Multiple LEDES" : "One LEDES";
  const uploadTitle = isMultiple ? "Upload Multiple PDFs" : "Upload Single PDF";
  const buttonText = isMultiple ? "Convert All to LEDES" : "Convert to LEDES";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const pdfFiles = files.filter(file => file.type === "application/pdf");
    setSelectedFiles(pdfFiles);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleConvert = () => {
    if (selectedFiles.length === 0) return;
    setIsConverting(true);
    // Conversion logic would go here
    setTimeout(() => {
      setIsConverting(false);
      // Show success message or download
    }, 3000);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-full max-w-[1728px] h-[1117px] relative">
        <div className="absolute w-full h-[1022px] top-[95px] left-0 bg-[url(/figmaAssets/background-image.png)] bg-cover bg-[50%_50%]">
          <div className="absolute top-[21px] left-[305px] font-sans font-bold text-black text-[32px] tracking-[0] leading-normal">
            {pageTitle}
          </div>

          <img
            className="absolute w-[260px] h-2 top-[38px] left-5"
            alt="Ellipses container"
            src="/figmaAssets/ellipses-container.png"
          />

          {/* Back Button */}
          <Link href="/home">
            <div className="absolute top-[80px] left-[305px] inline-flex items-center gap-2 cursor-pointer">
              <ArrowLeftIcon className="w-4 h-4 text-black" />
              <span className="font-sans font-medium text-black text-sm tracking-[0] leading-normal">
                Back to Home
              </span>
            </div>
          </Link>

          {/* Main Upload Card */}
          <div className="flex flex-col w-[700px] items-center gap-[30px] absolute top-[160px] left-[514px]">
            <Card className="flex flex-col items-start gap-[25px] p-[30px] relative self-stretch w-full flex-[0_0_auto] bg-[#f9f9f9] rounded-[17px_23px_23px_23px] border-2 border-solid border-[#d7dbdd] shadow-[0px_2px_42px_#00000026]">
              <CardContent className="p-0 space-y-[25px] w-full">
                <div className="relative w-fit mt-[-2.00px] font-sans font-bold text-black text-xl tracking-[0] leading-normal whitespace-nowrap">
                  {uploadTitle}
                </div>

                {/* File Upload Area */}
                <div 
                  className="flex flex-col items-center justify-center w-full h-[280px] bg-white rounded-[12px] border-2 border-dashed border-[#d7dbdd] relative cursor-pointer hover:border-[#2563eb] transition-colors"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center gap-[15px]">
                    <div className="w-16 h-16 bg-[#d3e4f3] rounded-[8px] flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        {isMultiple && (
                          <>
                            <path d="M16 13H8"/>
                            <path d="M16 17H8"/>
                            <path d="M10 9H8"/>
                          </>
                        )}
                      </svg>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-sans font-semibold text-black text-lg tracking-[0] leading-normal mb-1">
                        {selectedFiles.length > 0 
                          ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                          : "Drop your PDF files here"
                        }
                      </div>
                      <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                        or click to browse
                      </div>
                    </div>

                    <Button 
                      type="button"
                      className="h-[43px] px-6 py-3 bg-neutral-800 rounded-[9px] shadow-[0px_2px_4px_#0000000d] font-sans font-medium text-white text-base"
                    >
                      Choose Files
                    </Button>

                    <div className="font-sans font-normal text-[#53585a] text-xs tracking-[0] leading-normal text-center">
                      Supported format: PDF (max 50MB each{isMultiple ? ', up to 20 files' : ''})
                    </div>
                  </div>
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="inline-flex flex-col items-start gap-[3px] relative flex-[0_0_auto]">
                    <label className="relative w-fit mt-[-1.00px] font-sans font-semibold text-black text-xs tracking-[0] leading-normal">
                      Selected Files ({selectedFiles.length})
                    </label>

                    <div className="flex flex-col w-full max-h-[200px] overflow-y-auto gap-2 p-4 relative bg-white rounded border border-solid border-[#d7dbdd]">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <div className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                              <polyline points="14,2 14,8 20,8"/>
                            </svg>
                            <span className="font-sans font-normal text-black text-sm truncate max-w-[400px]">
                              {file.name}
                            </span>
                            <span className="font-sans font-normal text-[#53585a] text-xs">
                              ({Math.round(file.size / 1024 / 1024 * 100) / 100} MB)
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Convert Button */}
                <div className="flex items-center justify-end self-stretch w-full gap-2.5 relative flex-[0_0_auto]">
                  <Button 
                    onClick={handleConvert}
                    disabled={selectedFiles.length === 0 || isConverting}
                    className="h-[43px] px-6 py-3 bg-neutral-800 rounded-[9px] shadow-[0px_2px_4px_#0000000d] font-sans font-medium text-white text-base disabled:opacity-50"
                  >
                    {isConverting ? "Converting..." : buttonText}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Info Cards */}
            {isMultiple ? (
              <div className="flex flex-row w-full gap-[20px]">
                {/* Processing Benefits Card */}
                <Card className="flex flex-col items-start gap-[15px] p-[20px] relative flex-1 bg-[#e8f5e8] rounded-[12px] border border-solid border-[#b3d9b3]">
                  <CardContent className="p-0 space-y-[10px] w-full">
                    <div className="relative w-fit font-sans font-semibold text-black text-base tracking-[0] leading-normal">
                      Batch Processing
                    </div>
                    
                    <div className="space-y-[8px]">
                      <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                        • Process up to 20 files simultaneously
                      </div>
                      <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                        • Automated file organization
                      </div>
                      <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                        • Progress tracking for each file
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Processing Timeline Card */}
                <Card className="flex flex-col items-start gap-[15px] p-[20px] relative flex-1 bg-[#e8f4fd] rounded-[12px] border border-solid border-[#b3d9f2]">
                  <CardContent className="p-0 space-y-[10px] w-full">
                    <div className="relative w-fit font-sans font-semibold text-black text-base tracking-[0] leading-normal">
                      Processing Time
                    </div>
                    
                    <div className="space-y-[8px]">
                      <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                        • 1-5 files: 2-5 minutes
                      </div>
                      <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                        • 6-10 files: 5-10 minutes
                      </div>
                      <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                        • 11-20 files: 10-20 minutes
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="flex flex-col items-start gap-[15px] p-[20px] relative self-stretch w-full flex-[0_0_auto] bg-[#e8f4fd] rounded-[12px] border border-solid border-[#b3d9f2]">
                <CardContent className="p-0 space-y-[10px] w-full">
                  <div className="relative w-fit font-sans font-semibold text-black text-base tracking-[0] leading-normal">
                    Conversion Instructions
                  </div>
                  
                  <div className="space-y-[8px]">
                    <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                      • Ensure your PDF contains structured legal billing data
                    </div>
                    <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                      • The conversion process typically takes 1-3 minutes
                    </div>
                    <div className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                      • You'll receive a downloadable LEDES file upon completion
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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