import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { FileDetailsModal } from "@/components/FileDetailsModal";
import { ConditionalContent } from "@/components/ConditionalContent";
import { UploadCard } from "@/components/UploadCard";
import { useState } from "react";
import { downloadProcessedFilesZip } from "@/lib/api";
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
}

export const Home = (): JSX.Element => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [selectedFileForDetails, setSelectedFileForDetails] =
    useState<ProcessedFile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isMultiple = selectedFiles.length > 1;
  const getButtonText = () => {
    if (selectedFiles.length === 0) {
      return "Import from Cloud Repository";
    }
    if (isConverting && processingStep) {
      return processingStep;
    }
    if (isConverting) {
      return isMultiple
        ? "Converting All to LEDES..."
        : "Converting to LEDES...";
    }
    return isMultiple ? "Convert All to LEDES" : "Convert to LEDES";
  };
  const buttonText = getButtonText();

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files);
    setUploadError(null); // Clear any previous errors
  };

  const handleConvert = () => {
    // This will be handled by the UploadCard component
  };

  const handleProcessedFilesUpdate = (newFiles: ProcessedFile[]) => {
    setProcessedFiles((prev) => [...newFiles, ...prev]);
  };

  const handleUploadStateChange = (state: {
    isConverting?: boolean;
    uploadError?: string | null;
    processingStep?: string;
    selectedFiles?: File[];
  }) => {
    if (state.isConverting !== undefined) setIsConverting(state.isConverting);
    if (state.uploadError !== undefined) setUploadError(state.uploadError);
    if (state.processingStep !== undefined)
      setProcessingStep(state.processingStep);
    if (state.selectedFiles !== undefined)
      setSelectedFiles(state.selectedFiles);
  };

  const handleDownloadProcessed = async (fileIds: number[]) => {
    try {
      await downloadProcessedFilesZip(fileIds);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download processed files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (file: ProcessedFile) => {
    setSelectedFileForDetails(file);
  };

  const handleCloseModal = () => {
    setSelectedFileForDetails(null);
  };

  // Filter processed files based on search term (search by ID reference OR file name)
  const filteredProcessedFiles = processedFiles.filter(
    (file) =>
      file.uploadReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.invoiceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine if we should show the conversion instructions or processed files
  const showProcessedFiles = processedFiles.length > 0;

  return (
    <div className="bg-white min-h-screen w-full flex flex-col">
      <Header
        showAuthButtons={true}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 lg:ml-[15%] bg-[url(/figmaAssets/background-image.png)] bg-cover bg-center overflow-auto">
          <div className="pt-8 px-8">
            <div className="font-sans font-bold text-black text-3xl tracking-[0] leading-normal">
              Let&apos;s get started
            </div>
            <div className="font-sans text-gray-600 text-md tracking-[0] leading-normal mb-6">
              Convert your PDF documents to compliant LEDES files
            </div>

            {/* Upload Card */}
            <UploadCard
              selectedFiles={selectedFiles}
              isConverting={isConverting}
              uploadError={uploadError}
              processingStep={processingStep}
              buttonText={buttonText}
              onFileSelect={handleFileSelect}
              onConvert={handleConvert}
              onProcessedFilesUpdate={handleProcessedFilesUpdate}
              onUploadStateChange={handleUploadStateChange}
            />

            {/* Conditional Content: Show either Conversion Instructions or Your Files */}
            <ConditionalContent
              showProcessedFiles={showProcessedFiles}
              isMultiple={isMultiple}
              filteredProcessedFiles={filteredProcessedFiles}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onViewDetails={handleViewDetails}
              onDownload={handleDownloadProcessed}
            />
          </div>
        </div>
      </div>

      {/* File Details Modal */}
      <FileDetailsModal
        file={selectedFileForDetails}
        onClose={handleCloseModal}
        onDownload={handleDownloadProcessed}
      />
    </div>
  );
};
