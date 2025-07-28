import { useState } from "react";
import { MoreHorizontal, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  uploadedFiles?: any[];
  originalFileName?: string;
  isZipUpload?: boolean;
}

interface FilesTableProps {
  files: ProcessedFile[];
  searchTerm: string;
  onViewDetails: (file: ProcessedFile) => void;
  onDownload: (fileIds: number[]) => void;
}

export const FilesTable = ({
  files,
  searchTerm,
  onViewDetails,
  onDownload,
}: FilesTableProps): JSX.Element => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleDropdownClick = (fileId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.right - 160,
    });
    setActiveDropdown(activeDropdown === fileId ? null : fileId);
  };

  return (
    <>
      <div className="overflow-x-auto w-[85%]">
        <div className="bg-white rounded-lg p-0 min-w-[600px]">
          {/* Table Header */}
          <div className="flex p-4">
            <div className="flex-[2] font-sans font-bold text-gray-700 text-sm">
              File ID
            </div>
            <div className="flex-[3] font-sans font-bold text-gray-700 text-sm">
              File Name
            </div>
            <div className="flex-[2] font-sans font-bold text-gray-700 text-sm">
              Date Uploaded
            </div>
            <div className="flex-[1] font-sans font-bold text-gray-700 text-sm text-center">
              Invoices
            </div>
            <div className="flex-[2] font-sans font-bold text-gray-700 text-sm">
              Status
            </div>
            <div className="flex-shrink-0 w-12 font-sans font-bold text-gray-700 text-sm">
              {/* Actions column - no header */}
            </div>
          </div>

          {/* Table Rows */}
          <div
            className="max-h-64 sm:max-h-80 overflow-y-auto"
            style={{ overflow: "visible" }}
          >
            {files.map((file, index) => (
              <div
                key={file.id}
                className={`p-4 hover:bg-blue-50 ${
                  index % 2 === 1 ? "bg-gray-50" : ""
                }`}
              >
                {/* Table Layout */}
                <div className="flex items-center">
                  <div className="flex-[2] font-sans font-normal text-gray-700 text-sm">
                    {file.uploadReference}
                  </div>
                  <div className="flex-[3] font-sans font-normal text-gray-600 text-sm truncate">
                    {file.invoiceName}
                  </div>
                  <div className="flex-[2] font-sans font-normal text-gray-600 text-sm">
                    {file.dateUploaded}
                  </div>
                  <div className="flex-[1] font-sans font-normal text-gray-600 text-sm text-center">
                    {file.invoices}
                  </div>
                  <div
                    className={`flex-[2] font-sans font-normal text-sm ${
                      file.status === "Success"
                        ? "text-gray-700"
                        : "text-gray-600"
                    }`}
                  >
                    {file.status}
                  </div>
                  <div className="flex-shrink-0 w-12 flex justify-center">
                    {file.status === "Success" && file.fileIds && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        onClick={(e) => handleDropdownClick(file.id, e)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {files.length === 0 && searchTerm && (
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <div className="font-sans text-sm">
                  No files found matching "{searchTerm}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dropdown Menu - Positioned absolutely */}
      {activeDropdown && (
        <>
          <div
            className="fixed inset-0 z-[99998]"
            onClick={() => setActiveDropdown(null)}
          />
          <div
            className="fixed w-40 bg-white border border-gray-200 rounded-md shadow-lg z-[99999]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <button
              onClick={() => {
                const file = files.find((f) => f.id === activeDropdown);
                if (file) onViewDetails(file);
                setActiveDropdown(null);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-t-md"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button
              onClick={() => {
                const file = files.find((f) => f.id === activeDropdown);
                if (file) onDownload(file.fileIds);
                setActiveDropdown(null);
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-b-md"
            >
              <Download className="w-4 h-4" />
              Download ZIP
            </button>
          </div>
        </>
      )}
    </>
  );
};
