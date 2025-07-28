import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilesTable } from "@/components/FilesTable";

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

interface ConditionalContentProps {
  showProcessedFiles: boolean;
  isMultiple: boolean;
  filteredProcessedFiles: ProcessedFile[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onViewDetails: (file: ProcessedFile) => void;
  onDownload: (fileIds: number[]) => void;
}

export const ConditionalContent = ({
  showProcessedFiles,
  isMultiple,
  filteredProcessedFiles,
  searchTerm,
  onSearchChange,
  onViewDetails,
  onDownload,
}: ConditionalContentProps): JSX.Element => {
  if (!showProcessedFiles) {
    // Show conversion instructions or batch processing info
    if (isMultiple) {
      return (
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
      );
    } else {
      return (
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
                • You'll receive a downloadable LEDES file upon completion
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }
  }

  // Show processed files section
  return (
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
            placeholder="Search by ID or file name..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 border border-gray-300 rounded-sm font-sans text-sm w-full"
          />
        </div>
        <Button
          variant="link"
          size="sm"
          className="h-10 px-3 rounded-lg w-full sm:w-auto"
        >
          <img
            className="w-4 h-4"
            alt="Profile"
            src="/figmaAssets/filter.svg"
          />
          <span className="ml-2 sm:hidden">Filter</span>
        </Button>
      </div>

      {/* Files Table */}
      <FilesTable
        files={filteredProcessedFiles}
        searchTerm={searchTerm}
        onViewDetails={onViewDetails}
        onDownload={onDownload}
      />
    </div>
  );
};
