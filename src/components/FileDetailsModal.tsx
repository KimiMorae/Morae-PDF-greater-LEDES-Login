import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProcessedFile {
  id: string;
  uploadReference: string;
  invoiceName: string;
  invoices: number;
  dateUploaded: string;
  status: "Success" | "Error";
  fileIds: number[];
  ledeResults?: any[];
}

interface FileDetailsModalProps {
  file: ProcessedFile | null;
  onClose: () => void;
  onDownload: (fileIds: number[]) => void;
}

export const FileDetailsModal = ({
  file,
  onClose,
  onDownload,
}: FileDetailsModalProps) => {
  if (!file) return null;

  // Mock LEDES file data - in real implementation, this would come from the API
  const ledesFiles = file.ledeResults?.map((result: any, index: number) => ({
    name: `LEDES_${file.invoiceName}_${index + 1}.xlsx`,
    dateCreated: file.dateUploaded,
    pages: Math.floor(Math.random() * 10) + 1, // Mock page count
  })) || [
    {
      name: `LEDES_${file.invoiceName}.xlsx`,
      dateCreated: file.dateUploaded,
      pages: Math.floor(Math.random() * 10) + 1,
    },
  ];

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {file.uploadReference} - LEDES
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4 overflow-y-auto">
          <div className="mb-4 overflow-x-auto">
            {/* Table Header */}
            <div className="px-4 py-3 flex min-w-[600px]">
              <div className="w-80 font-bold text-gray-700 text-sm">
                LEDES File Name
              </div>
              <div className="w-32 font-bold text-gray-700 text-sm">
                Date Created
              </div>
              <div className="w-20 font-bold text-gray-700 text-sm text-center">
                Pages
              </div>
            </div>

            {/* Table Rows */}
            {ledesFiles.map((ledesFile, index) => (
              <div
                key={index}
                className={`px-4 py-3 flex items-center hover:bg-blue-50 min-w-[600px] ${
                  index % 2 === 1 ? "bg-gray-50" : ""
                }`}
              >
                <div className="w-80 font-normal text-sm text-gray-900">
                  {ledesFile.name}
                </div>
                <div className="w-32 font-normal text-sm text-gray-600">
                  {ledesFile.dateCreated}
                </div>
                <div className="w-20 font-normal text-sm text-gray-600 text-center">
                  {ledesFile.pages}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 flex justify-end gap-3">
          <Button onClick={onClose} variant="outline" className="px-4 py-2">
            Close
          </Button>
          <Button
            onClick={() => onDownload(file.fileIds)}
            className="px-4 py-2 bg-neutral-800 text-white hover:bg-neutral-700"
          >
            <img
              className="w-4 h-4"
              alt="Profile"
              src="/figmaAssets/zip-file.svg"
            />
            Download ZIP
          </Button>
        </div>
      </div>
    </div>
  );
};
