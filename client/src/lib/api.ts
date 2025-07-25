export interface UploadedFile {
  file_id: number;
  filename: string;
  file_size: number;
  mime_type: string;
  message: string;
}

export interface UploadResponse {
  message: string;
  run_id: string;
  user_id: string;
  files_uploaded: UploadedFile[];
  files_skipped: any[];
}

export async function uploadFiles(files: File[]) {
  const formData = new FormData();

  // Add the 4 required parameters
  formData.append("X-Client-ID", import.meta.env.VITE_CLIENT_ID);
  formData.append("project_id", "iag");
  formData.append("service_id", "ledes");
  files.forEach((file) => formData.append("file", file));

  const response = await fetch("http://localhost:8050/api/v1/core/upload/", {
    method: "POST",
    headers: {
      "X-Client-ID": import.meta.env.VITE_CLIENT_ID,
      "X-Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  return await response.json();
}
