import { AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { uploadFiles, type UploadedFile } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

// Processed files data structure
interface ProcessedFile {
  id: string;
  uploadReference: string;
  dateUploaded: string;
  invoiceName: string;
  invoices: number;
  status: "Success" | "Error";
  fileIds: number[];
  ledeResults?: any[];
  // Additional metadata for grouped uploads
  uploadedFiles?: UploadedFile[];
  originalFileName?: string;
  isZipUpload?: boolean;
}

interface UploadCardProps {
  selectedFiles: File[];
  isConverting: boolean;
  uploadError: string | null;
  processingStep: string;
  buttonText: string;
  onFileSelect: (files: File[]) => void;
  onConvert: () => void;
  onProcessedFilesUpdate: (files: ProcessedFile[]) => void;
  onUploadStateChange: (state: {
    isConverting?: boolean;
    uploadError?: string | null;
    processingStep?: string;
    selectedFiles?: File[];
  }) => void;
}

export const UploadCard = ({
  selectedFiles,
  isConverting,
  uploadError,
  buttonText,
  onFileSelect,
  onProcessedFilesUpdate,
  onUploadStateChange,
}: UploadCardProps): JSX.Element => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    onFileSelect(files);
  };

  const handleFileInputClick = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    onFileSelect(pdfFiles);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return;

    onUploadStateChange({
      isConverting: true,
      uploadError: null,
      processingStep: "Uploading files...",
    });

    try {
      const result = await uploadFiles(
        selectedFiles,
        "iag",
        "ledes",
        0,
        (step: string) => onUploadStateChange({ processingStep: step })
      );

      const ledeResults =
        result.processing_results?.generate_lede?.results || [];

      // Determine if this was a zip upload or single file upload
      const isZipUpload =
        selectedFiles.length === 1 &&
        selectedFiles[0].name.toLowerCase().endsWith(".zip");
      const uploadedFileName = selectedFiles[0]?.name || "Unknown";

      const validUploadedFiles = result.files_uploaded.filter(
        (file: UploadedFile) => !file.filename.startsWith("._")
      );

      const allFileIds = validUploadedFiles.map(
        (file: UploadedFile) => file.file_id
      );
      const allLedeResults = ledeResults;

      // If no files were uploaded (all duplicates), don't add to processed files table
      if (allFileIds.length === 0) {
        onUploadStateChange({
          selectedFiles: [],
          uploadError: null,
          processingStep: "",
        });
        return;
      }

      // Calculate total invoices - count valid LEDES files that will be shown in modal
      const validLedesFiles = validUploadedFiles.filter(
        (uploadedFile: UploadedFile) => {
          // Find corresponding LEDE result for this uploaded file
          const fileLedeResult = allLedeResults.find(
            (lede: any) => lede.file_id === uploadedFile.file_id
          );
          // Only count files that have successful LEDE results
          return fileLedeResult && fileLedeResult.status === "success";
        }
      );

      const totalInvoices = validLedesFiles.length;

      let displayName: string;
      if (isZipUpload) {
        // For zip files, use the zip file name
        displayName = uploadedFileName.replace(".zip", "");
      } else if (selectedFiles.length === 1) {
        // For single PDF files, use the actual invoice name from LEDE results
        if (allLedeResults.length > 0 && allLedeResults[0].invoice_name) {
          displayName = allLedeResults[0].invoice_name.replace(/\.pdf$/i, "");
        } else {
          displayName = uploadedFileName.replace(".pdf", "");
        }
      } else {
        // For multiple files (shouldn't happen with current UI, but just in case)
        displayName = `${selectedFiles.length} files`;
      }

      // Create a single ProcessedFile entry that represents the entire upload session
      const newProcessedFiles: ProcessedFile[] = [
        {
          id: result.run_id,
          uploadReference: `#${result.run_id}`,
          dateUploaded: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          invoiceName: displayName,
          invoices: totalInvoices,
          status: "Success" as const,
          fileIds: allFileIds,
          ledeResults: allLedeResults,
          // Add metadata to help with View Details
          uploadedFiles: validUploadedFiles,
          originalFileName: uploadedFileName,
          isZipUpload: isZipUpload,
        },
      ];

      onProcessedFilesUpdate(newProcessedFiles);
      onUploadStateChange({
        selectedFiles: [],
        uploadError: null,
        processingStep: "",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Upload and processing failed. Please try again.";

      onUploadStateChange({
        uploadError: errorMessage,
        processingStep: "",
      });

      if (!errorMessage.includes("Authentication tokens missing")) {
        toast({
          title: "Upload Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      onUploadStateChange({ isConverting: false });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    // Clear the file input value if no files remain
    if (newFiles.length === 0) {
      const fileInput = document.getElementById(
        "file-input"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
    onFileSelect(newFiles);
  };

  return (
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
            className="flex flex-col items-center justify-center w-full h-20 bg-white rounded-[12px] cursor-pointer transition-all duration-200 group"
            style={{
              border: "2px dashed #e5e7eb",
              borderSpacing: "8px",
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("file-input")?.click()}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = "2px dashed #9ca3af";
            }}
            onMouseLeave={(e) => {
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

            <div className="flex items-center px-4">
              {/* Icon Column */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-[8px] flex items-center justify-center">
                  <img
                    src="/figmaAssets/upload-icon.svg"
                    alt="Upload icon"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  />
                </div>
              </div>

              {/* Text Column */}
              <div className="flex-1 text-center">
                <div className="font-sans font-normal text-gray-400 text-sm tracking-[0] leading-normal">
                  Drag & drop or click here to select a file
                </div>
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <div className="flex items-center justify-center w-full mt-6">
            <Button
              onClick={
                selectedFiles.length === 0
                  ? handleFileInputClick
                  : handleConvert
              }
              disabled={isConverting}
              className="h-10 sm:h-[43px] px-4 sm:px-6 py-2 sm:py-3 bg-neutral-800 rounded-[9px] shadow-[0px_2px_4px_#0000000d] font-sans font-medium text-white text-sm sm:text-base disabled:opacity-50"
            >
              {buttonText}
            </Button>
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
                        ({Math.round((file.size / 1024 / 1024) * 100) / 100} MB)
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
        </CardContent>
      </Card>
    </div>
  );
};
