import {
  AlertTriangleIcon,
  SearchIcon,
  FilterIcon,
  MoreHorizontal,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import {
  uploadFiles,
  downloadOriginalFile,
  downloadProcessedFilesZip,
  type UploadedFile,
} from "@/lib/api";
import { useClientInfo } from "@/hooks/useUserProfile";

// Processed files data structure
interface ProcessedFile {
  id: string;
  uploadReference: string;
  dateUploaded: string;
  invoiceName: string;
  invoices: number;
  dateUploaded: string;
  status: "Success" | "Error";
  fileIds: number[];
  ledeResults?: any[];
}

export const Home = (): JSX.Element => {
  const { clientId } = useClientInfo();
  console.log("========================");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");

  const isMultiple = selectedFiles.length > 1;
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
            invoices: fileLedeResults.length || 1,
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
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header showAuthButtons={true} />

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 ml-[15%] bg-[url(/figmaAssets/background-image.png)] bg-cover bg-center overflow-auto">
          <div className="pt-8 px-8">
            <div className="font-sans font-bold text-black text-3xl tracking-[0] leading-normal mb-2">
              Let&apos;s get started
            </div>
            <div className="font-sans text-gray-600 text-md tracking-[0] leading-normal mb-8">
              Convert your PDF documents to compliant LEDES files
            </div>

            {/* Upload Card - 20% width */}
            <div className="w-80 mb-8">
              <Card className="flex flex-col items-start gap-6 p-6 w-full bg-gray-50 rounded-[17px_23px_23px_23px] border-2 border-solid border-gray-300 shadow-[0px_2px_42px_#00000026]">
                <CardContent className="p-0 w-full">
                  <div className="font-sans font-bold text-black text-xl tracking-[0] leading-normal mb-6">
                    Start here
                  </div>
                  <div className="font-sans font-bold text-sm tracking-[0] leading-normal mb-3">
                    Upload from device
                  </div>
                  {/* File Upload Area */}
                  <div
                    className="flex flex-col items-center justify-center w-full h-48 bg-white rounded-[12px] cursor-pointer transition-all duration-200 group"
                    style={{
                      border: "2px dashed #e5e7eb",
                      borderSpacing: "8px",
                    }}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                    onMouseEnter={(e) => {
                      e.currentTarget.style.border = "2px dashed #9ca3af";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.border = "2px dashed #e5e7eb";
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.border = "2px dashed #6b7280";
                      e.currentTarget.style.outline = "none";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = "2px dashed #e5e7eb";
                    }}
                    tabIndex={0}
                  >
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      accept=".pdf,.zip"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[8px] flex items-center justify-center">
                        <img
                          src="/figmaAssets/upload-icon.svg"
                          alt="Upload icon"
                          className="w-6 h-6 sm:w-8 sm:h-8"
                        />
                      </div>

                      <div className="text-center px-4">
                        <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                          Drag & drop or click here to select a file
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="h-10 sm:h-[43px] text-sm px-4 sm:px-6 py-2 sm:py-3 bg-neutral-800 rounded-[9px] shadow-[0px_2px_4px_#0000000d] font-sans font-medium text-white sm:text-base"
                      >
                        Import from cloud repository
                      </Button>
                    </div>
                  </div>

                  {/* Selected Files List */}
                  {selectedFiles.length > 0 && (
                    <div className="flex flex-col items-start gap-1 w-full mt-6">
                      <label className="font-sans font-semibold text-black text-xs tracking-[0] leading-normal">
                        Selected Files ({selectedFiles.length})
                      </label>

                      <div className="flex flex-col w-full max-h-48 sm:max-h-52 overflow-y-auto gap-2 p-3 sm:p-4 bg-white rounded border border-solid border-gray-300">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#2563eb"
                                strokeWidth="2"
                                className="flex-shrink-0"
                              >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14,2 14,8 20,8" />
                              </svg>
                              <span className="font-sans font-normal text-black text-sm truncate flex-1">
                                {file.name}
                              </span>
                              <span className="font-sans font-normal text-gray-600 text-xs flex-shrink-0 hidden sm:inline">
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
                              className="text-gray-500 hover:text-gray-700 text-sm ml-2 flex-shrink-0"
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
                    <div className="flex items-center gap-2 p-3 bg-gray-100 border border-gray-300 rounded-lg mt-6">
                      <AlertTriangleIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span className="font-sans font-normal text-gray-700 text-sm">
                        {uploadError}
                      </span>
                    </div>
                  )}

                  {/* Convert Button */}
                  <div className="flex items-center justify-end w-full mt-6">
                    <Button
                      onClick={handleConvert}
                      disabled={selectedFiles.length === 0 || isConverting}
                      className="h-10 sm:h-[43px] px-4 sm:px-6 py-2 sm:py-3 bg-neutral-800 rounded-[9px] shadow-[0px_2px_4px_#0000000d] font-sans font-medium text-white text-sm sm:text-base disabled:opacity-50"
                    >
                      {isConverting
                        ? processingStep || "Processing..."
                        : buttonText}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Conditional Content: Show either Conversion Instructions or Your Files - Full Width */}
            {!showProcessedFiles ? (
              /* Conversion Instructions - Only show when no files have been processed */
              isMultiple ? (
                <div className="flex flex-col sm:flex-row w-full gap-4 sm:gap-5">
                  {/* Processing Benefits Card */}
                  <Card className="flex flex-col items-start gap-4 p-4 sm:p-5 flex-1 bg-gray-100 rounded-[12px] border border-solid border-gray-300">
                    <CardContent className="p-0 space-y-3 w-full">
                      <div className="font-sans font-semibold text-black text-base tracking-[0] leading-normal">
                        Batch Processing
                      </div>

                      <div className="space-y-2">
                        <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                          • Process up to 20 files simultaneously
                        </div>
                        <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                          • Automated file organization
                        </div>
                        <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                          • Progress tracking for each file
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Processing Timeline Card */}
                  <Card className="flex flex-col items-start gap-4 p-4 sm:p-5 flex-1 bg-gray-100 rounded-[12px] border border-solid border-gray-300">
                    <CardContent className="p-0 space-y-3 w-full">
                      <div className="font-sans font-semibold text-black text-base tracking-[0] leading-normal">
                        Processing Time
                      </div>

                      <div className="space-y-2">
                        <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                          • 1-5 files: 2-5 minutes
                        </div>
                        <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                          • 6-10 files: 5-10 minutes
                        </div>
                        <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                          • 11-20 files: 10-20 minutes
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="flex flex-col items-start gap-4 p-4 sm:p-5 w-full bg-gray-100 rounded-[12px] border border-solid border-gray-300">
                  <CardContent className="p-0 space-y-3 w-full">
                    <div className="font-sans font-semibold text-black text-base tracking-[0] leading-normal">
                      Conversion Instructions
                    </div>

                    <div className="space-y-2">
                      <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                        • Ensure your PDF contains structured legal billing data
                      </div>
                      <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                        • The conversion process typically takes 1-3 minutes
                      </div>
                      <div className="font-sans font-normal text-gray-600 text-sm tracking-[0] leading-normal">
                        • You'll receive a downloadable LEDES file upon
                        completion
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              /* Your Files Section - Show when files have been processed */
              <div className="w-full space-y-4 sm:space-y-6">
                {/* Your Files Header */}
                <div className="font-sans font-bold text-black text-xl sm:text-2xl tracking-[0] leading-normal">
                  Your files
                </div>

                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <div className="relative flex-1 max-w-full sm:max-w-md">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 border border-gray-300 rounded-lg font-sans text-sm w-full"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 px-3 border border-gray-300 rounded-lg w-full sm:w-auto"
                  >
                    <FilterIcon className="w-4 h-4" />
                    <span className="ml-2 sm:hidden">Filter</span>
                  </Button>
                </div>

                {/* Files Table */}
                <Card className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Table Header - Hidden on mobile, shown on larger screens */}
                    <div className="hidden sm:flex p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex-shrink-0 w-20 lg:w-24 font-sans font-semibold text-gray-700 text-sm">
                        File ID
                      </div>
                      <div className="flex-1 px-4 font-sans font-semibold text-gray-700 text-sm">
                        Invoice Name
                      </div>
                      <div className="flex-shrink-0 w-20 font-sans font-semibold text-gray-700 text-sm">
                        Invoices
                      </div>
                      <div className="flex-shrink-0 w-32 font-sans font-semibold text-gray-700 text-sm">
                        Date Uploaded
                      </div>
                      <div className="flex-shrink-0 w-16 lg:w-20 font-sans font-semibold text-gray-700 text-sm">
                        Status
                      </div>
                      <div className="flex-shrink-0 w-12 font-sans font-semibold text-gray-700 text-sm">
                        {/* Actions column - no header */}
                      </div>
                    </div>

                    {/* Table Rows */}
                    <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                      {filteredProcessedFiles.map((file, index) => (
                        <div
                          key={file.id}
                          className={`p-4 border-b border-gray-100 hover:bg-blue-50 ${
                            index === 0 ? "bg-gray-50" : ""
                          }`}
                        >
                          {/* Desktop Layout */}
                          <div className="hidden sm:flex items-center">
                            <div className="flex-shrink-0 w-20 lg:w-24 font-sans font-medium text-gray-700 text-sm">
                              {file.uploadReference}
                            </div>
                            <div className="flex-1 px-4 font-sans text-gray-600 text-sm truncate">
                              {file.invoiceName}
                            </div>
                            <div className="flex-shrink-0 w-20 font-sans text-gray-600 text-sm text-center">
                              {file.invoices}
                            </div>
                            <div className="flex-shrink-0 w-32 font-sans text-gray-600 text-sm">
                              {file.dateUploaded}
                            </div>
                            <div
                              className={`flex-shrink-0 w-16 lg:w-20 font-sans text-sm ${
                                file.status === "Success"
                                  ? "text-gray-700"
                                  : "text-gray-600"
                              }`}
                            >
                              {file.status}
                            </div>
                            <div className="flex-shrink-0 w-12 flex justify-center">
                              {file.status === "Success" && file.fileIds && (
                                <div className="relative group">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                  <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                    <button
                                      onClick={() => {
                                        /* View Details handler */
                                      }}
                                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDownloadProcessed(file.fileIds)
                                      }
                                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                      <Download className="w-4 h-4" />
                                      Download ZIP
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Mobile Layout */}
                          <div className="sm:hidden space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-sans font-medium text-gray-700 text-sm">
                                  {file.uploadReference}
                                </div>
                                <div className="font-sans text-gray-600 text-sm mt-1">
                                  {file.invoiceName}
                                </div>
                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                  <span>{file.invoices} invoices</span>
                                  <span>{file.dateUploaded}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`font-sans text-sm ${
                                    file.status === "Success"
                                      ? "text-gray-700"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {file.status}
                                </div>
                                {file.status === "Success" && file.fileIds && (
                                  <div className="relative group">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-gray-100"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                    <div className="absolute right-0 top-8 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                      <button
                                        onClick={() => {
                                          /* View Details handler */
                                        }}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDownloadProcessed(file.fileIds)
                                        }
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                      >
                                        <Download className="w-4 h-4" />
                                        Download ZIP
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {filteredProcessedFiles.length === 0 && searchTerm && (
                        <div className="p-6 sm:p-8 text-center text-gray-500">
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
      </div>
    </div>
  );
};
