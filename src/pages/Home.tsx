import {
  AlertTriangleIcon,
  SearchIcon,
  FilterIcon,
  LogOutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  uploadFiles,
  downloadOriginalFile,
  downloadProcessedFilesZip,
  type UploadedFile,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useClientInfo } from "@/hooks/useUserProfile";
import { useLocation } from "wouter";

// Processed files data structure
interface ProcessedFile {
  id: string;
  uploadReference: string;
  dateUploaded: string;
  invoiceName: string;
  status: "Success" | "Error";
  fileIds: number[];
  ledeResults?: any[];
}

export const Home = (): JSX.Element => {
  const { logout } = useAuth();
  const { clientId } = useClientInfo();
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };
  console.log("========================");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");

  const isMultiple = selectedFiles.length > 1;
  const pageTitle = isMultiple ? "Multiple LEDES" : "One LEDES";
  const uploadTitle = isMultiple ? "Upload Multiple PDFs" : "Upload Single PDF";
  const buttonText = isMultiple ? "Convert All to LEDES" : "Convert to LEDES";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    setUploadError(null); // Clear any previous errors
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    setSelectedFiles(pdfFiles);
    setUploadError(null); // Clear any previous errors
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return;

    setIsConverting(true);
    setUploadError(null);
    setProcessingStep("Uploading files...");

    try {
      console.log("Starting file upload and processing...");
      console.log("Client ID available:", !!clientId);
      console.log("Using client_id:", clientId);
      console.log("Files to upload:", selectedFiles.length);

      const result = await uploadFiles(
        selectedFiles,
        "iag",
        "ledes",
        0,
        setProcessingStep
      );
      console.log("Complete processing response:", result);

      // Extract file IDs and LEDE results from the complete processing response
      const fileIds =
        result.files_uploaded?.map((file: UploadedFile) => file.file_id) || [];
      const ledeResults =
        result.processing_results?.generate_lede?.results || [];

      // Convert API response to ProcessedFile format
      const newProcessedFiles: ProcessedFile[] = result.files_uploaded.map(
        (file: UploadedFile) => {
          // Find the corresponding LEDE result for this file
          const fileLedeResults = ledeResults.filter(
            (lede: any) => lede.file_id === file.file_id
          );

          // Extract invoice name from the first LEDE result's file path
          let invoiceName = `File ${file.file_id}`;
          if (fileLedeResults.length > 0 && fileLedeResults[0].lede_xlsx_file) {
            invoiceName = extractInvoiceName(fileLedeResults[0].lede_xlsx_file);
          }

          return {
            id: result.run_id,
            uploadReference: `#${file.file_id}`,
            dateUploaded: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            invoiceName: invoiceName,
            status: "Success" as const,
            fileIds: [file.file_id],
            ledeResults: fileLedeResults,
          };
        }
      );

      setProcessedFiles((prev) => [...newProcessedFiles, ...prev]);
      setSelectedFiles([]);
      setUploadError(null);
      setProcessingStep("");
    } catch (error) {
      console.error("Upload and processing failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Upload and processing failed. Please try again.";
      setUploadError(errorMessage);
      setProcessingStep("");

      // If it's an authentication error, the refresh logic should have handled redirect
      // Otherwise, show the error to the user
      if (!errorMessage.includes("Authentication tokens missing")) {
        alert(errorMessage);
      }
    } finally {
      setIsConverting(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== index));
  };

  // Extract invoice name from LEDE file path
  const extractInvoiceName = (ledeFilePath: string): string => {
    // Extract filename from path: "/media/output/.../lede_Invoice_AU01-0041174R.xlsx"
    const filename = ledeFilePath.split("/").pop() || "";
    // Remove "lede_" prefix and file extension
    const invoiceName = filename
      .replace(/^lede_/, "")
      .replace(/\.(xlsx|json)$/, "");
    return invoiceName || "Unknown Invoice";
  };

  const handleDownloadOriginal = async (fileIds: number[]) => {
    try {
      if (fileIds.length === 1) {
        await downloadOriginalFile(fileIds[0]);
      } else {
        // Download multiple original files one by one
        for (const fileId of fileIds) {
          await downloadOriginalFile(fileId);
          // Add small delay between downloads
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const handleDownloadProcessed = async (fileIds: number[]) => {
    try {
      await downloadProcessedFilesZip(fileIds);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  // Filter processed files based on search term
  const filteredProcessedFiles = processedFiles.filter((file) =>
    file.uploadReference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine if we should show the conversion instructions or processed files
  const showProcessedFiles = processedFiles.length > 0;

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
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.zip"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center gap-[15px]">
                    <div className="w-16 h-16 bg-[#d3e4f3] rounded-[8px] flex items-center justify-center">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14,2 14,8 20,8" />
                        {isMultiple && (
                          <>
                            <path d="M16 13H8" />
                            <path d="M16 17H8" />
                            <path d="M10 9H8" />
                          </>
                        )}
                      </svg>
                    </div>

                    <div className="text-center">
                      <div className="font-sans font-semibold text-black text-lg tracking-[0] leading-normal mb-1">
                        {selectedFiles.length > 0
                          ? `${selectedFiles.length} file${
                              selectedFiles.length > 1 ? "s" : ""
                            } selected`
                          : "Drop your PDF or ZIP files here"}
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
                      Supported format: PDF (max 50MB each
                      {isMultiple ? ", up to 20 files" : ""})
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
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#2563eb"
                              strokeWidth="2"
                            >
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14,2 14,8 20,8" />
                            </svg>
                            <span className="font-sans font-normal text-black text-sm truncate max-w-[400px]">
                              {file.name}
                            </span>
                            <span className="font-sans font-normal text-[#53585a] text-xs">
                              (
                              {Math.round((file.size / 1024 / 1024) * 100) /
                                100}{" "}
                              MB)
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

                {/* Error Display */}
                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                    <span className="font-sans font-normal text-red-700 text-sm">
                      {uploadError}
                    </span>
                  </div>
                )}

                {/* Convert Button */}
                <div className="flex items-center justify-end self-stretch w-full gap-2.5 relative flex-[0_0_auto]">
                  <Button
                    onClick={handleConvert}
                    disabled={selectedFiles.length === 0 || isConverting}
                    className="h-[43px] px-6 py-3 bg-neutral-800 rounded-[9px] shadow-[0px_2px_4px_#0000000d] font-sans font-medium text-white text-base disabled:opacity-50"
                  >
                    {isConverting
                      ? processingStep || "Processing..."
                      : buttonText}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Conditional Content: Show either Conversion Instructions or Your Files */}
            {!showProcessedFiles ? (
              /* Conversion Instructions - Only show when no files have been processed */
              isMultiple ? (
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
                        • You'll receive a downloadable LEDES file upon
                        completion
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              /* Your Files Section - Show when files have been processed */
              <div className="w-full space-y-6">
                {/* Your Files Header */}
                <div className="font-sans font-bold text-black text-2xl tracking-[0] leading-normal">
                  Your files
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 border border-gray-300 rounded-lg font-sans text-sm"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-3 border border-gray-300 rounded-lg"
                  >
                    <FilterIcon className="w-4 h-4" />
                  </Button>
                </div>

                {/* Files Table */}
                <Card className="bg-white rounded-lg border border-gray-200">
                  <CardContent className="p-0">
                    {/* Table Header */}
                    <div className="flex p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex-shrink-0 w-24 font-sans font-semibold text-gray-700 text-sm">
                        Upload ID
                      </div>
                      <div className="flex-1 px-4 font-sans font-semibold text-gray-700 text-sm">
                        Invoice Name
                      </div>
                      <div className="flex-shrink-0 w-20 font-sans font-semibold text-gray-700 text-sm">
                        Status
                      </div>
                      <div className="flex-shrink-0 w-48 font-sans font-semibold text-gray-700 text-sm">
                        Downloads
                      </div>
                    </div>

                    {/* Table Rows */}
                    <div className="max-h-80 overflow-y-auto">
                      {filteredProcessedFiles.map((file, index) => (
                        <div
                          key={file.id}
                          className={`flex p-4 border-b border-gray-100 hover:bg-gray-50 ${
                            index === 0 ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex-shrink-0 w-24 font-sans font-medium text-blue-600 text-sm">
                            {file.uploadReference}
                          </div>
                          <div className="flex-1 px-4 font-sans text-gray-600 text-sm truncate">
                            {file.invoiceName}
                          </div>
                          <div
                            className={`flex-shrink-0 w-20 font-sans text-sm ${
                              file.status === "Success"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {file.status}
                          </div>
                          <div className="flex-shrink-0 w-48 flex gap-2">
                            {file.status === "Success" && file.fileIds && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownloadOriginal(file.fileIds)
                                  }
                                  className="h-8 px-3 text-xs"
                                >
                                  Original File
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDownloadProcessed(file.fileIds)
                                  }
                                  className="h-8 px-3 text-xs"
                                >
                                  {file.fileIds.length === 1
                                    ? "LEDEs ZIP"
                                    : "All ZIP"}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}

                      {filteredProcessedFiles.length === 0 && searchTerm && (
                        <div className="p-8 text-center text-gray-500">
                          <div className="font-sans text-sm">
                            No files found matching "{searchTerm}"
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
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

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="inline-flex h-[37px] items-center gap-2.5 p-2.5 relative flex-[0_0_auto] rounded-[5px]"
            >
              <AlertTriangleIcon className="w-7 h-7" />
              <span className="font-sans font-normal text-[#53585a] text-sm tracking-[0] leading-normal">
                Support
              </span>
            </Button>

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="inline-flex h-[37px] items-center gap-2.5 p-2.5 relative flex-[0_0_auto] rounded-[5px] hover:bg-red-50"
            >
              <LogOutIcon className="w-5 h-5 text-red-600" />
              <span className="font-sans font-normal text-red-600 text-sm tracking-[0] leading-normal">
                Logout
              </span>
            </Button>
          </div>
        </header>
      </div>
    </div>
  );
};
