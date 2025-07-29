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
  // Additional metadata for grouped uploads
  uploadedFiles?: any[];
  originalFileName?: string;
  isZipUpload?: boolean;
}

interface FileDetailsModalProps {
  file: ProcessedFile | null;
  onClose: () => void;
  onDownload: (fileIds: number[], isZipUpload?: boolean) => void;
}

export const FileDetailsModal = ({
  file,
  onClose,
  onDownload,
}: FileDetailsModalProps) => {
  if (!file) return null;

  // Show LEDES XLSX output files for each individual source file that was uploaded
  const validUploadedFiles =
    file.uploadedFiles?.filter(
      (uploadedFile: any) => !uploadedFile.filename.startsWith("._")
    ) || [];

  const ledesFiles = validUploadedFiles.map((uploadedFile: any) => {
    // Find the corresponding LEDE result for this specific uploaded file
    const fileLedeResult = file.ledeResults?.find(
      (lede: any) => lede.file_id === uploadedFile.file_id
    );

    let ledesFileName: string;
    if (fileLedeResult?.invoice_name) {
      const invoiceName = fileLedeResult.invoice_name.replace(/\.pdf$/i, "");
      ledesFileName = `${invoiceName}_LEDES.xlsx`;
    } else if (fileLedeResult?.lede_xlsx_file) {
      // Fallback to extracting from file path
      const xlsxPath = fileLedeResult.lede_xlsx_file;
      ledesFileName =
        xlsxPath.split("/").pop() ||
        `${uploadedFile.filename.replace(/\.pdf$/i, "")}_LEDES.xlsx`;
    } else {
      // Final fallback to uploaded filename
      ledesFileName = `${uploadedFile.filename.replace(
        /\.pdf$/i,
        ""
      )}_LEDES.xlsx`;
    }

    return {
      name: ledesFileName,
      dateCreated: file.dateUploaded,
      status: fileLedeResult?.status || file.status,
    };
  });

  // Fallback if no valid files found
  const finalLedesFiles =
    ledesFiles.length > 0
      ? ledesFiles
      : [
          {
            name: `LEDES_${file.invoiceName}.xlsx`,
            dateCreated: file.dateUploaded,
            status: file.status,
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
              {file.invoiceName} - LEDES
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
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
                Status
              </div>
            </div>

            {/* Table Rows */}
            {finalLedesFiles.map((ledesFile, index) => (
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
                  {ledesFile.status}
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
            onClick={() => {
              onDownload(file.fileIds, file.isZipUpload);
              onClose();
            }}
            className="px-4 py-2 bg-neutral-800 text-white hover:bg-neutral-700"
          >
            <img
              className="w-4 h-4"
              alt="Profile"
              src="/figmaAssets/zip-file.svg"
            />
            {file.isZipUpload ? "Download ZIP" : "Download LEDES"}
          </Button>
        </div>
      </div>
    </div>
  );
};
