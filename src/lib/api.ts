import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Authentication interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  client_id: string;
  client_secret: string;
}

export interface RefreshTokenResponse {
  access: string;
}

// File upload interfaces
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

// Authentication functions
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/simple-login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Login failed: ${response.status}`);
    }

    const loginData = await response.json();

    // Store all authentication data from the login response
    localStorage.setItem("access_token", loginData.access_token);
    localStorage.setItem("refresh_token", loginData.refresh_token);
    localStorage.setItem("client_id", loginData.client_id);
    localStorage.setItem("client_secret", loginData.client_secret);

    toast({
      title: "Login Successful",
      description: "Welcome back! You have been successfully logged in.",
      variant: "success",
    });

    return loginData;
  } catch (error) {
    toast({
      title: "Login Failed",
      description:
        error instanceof Error
          ? error.message
          : "An error occurred during login",
      variant: "destructive",
    });
    throw error;
  }
}

export function saveToken(token: string): void {
  localStorage.setItem("access_token", token);
}

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export function getClientId(): string | null {
  return localStorage.getItem("client_id");
}

export function getClientSecret(): string | null {
  return localStorage.getItem("client_secret");
}

export function removeToken(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("client_id");
  localStorage.removeItem("client_secret");
}

// Utility function to check if token is likely expired (basic check)
export function isTokenLikelyExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    // If we can't parse the token, assume it's invalid
    return true;
  }
}

// Token refresh function
export async function refreshTokenAndRetry(): Promise<void> {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/auth/web/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      toast({
        title: "Session Refreshed",
        description: "Your session has been automatically renewed.",
        variant: "info",
      });
    } else {
      await response.json().catch(() => ({}));
      throw new Error(`Token refresh failed: ${response.status}`);
    }
  } catch (error) {
    // Clear all auth data and redirect to login
    localStorage.clear();
    window.location.href = "/";
    toast({
      title: "Session Expired",
      description: "Please log in again to continue.",
      variant: "destructive",
    });
    throw error;
  }
}

// Sequential processing functions
async function processInvoices(
  fileIds: number[],
  accessToken: string,
  clientId: string,
  clientSecret: string,
  onProgress?: (step: string) => void
): Promise<any> {
  const fileIdsParam = fileIds.join(",");

  onProgress?.("Processing invoices...");

  const response = await fetch(
    `${API_BASE_URL}/invoice_data_extraction/process_invoices/?file_ids=${fileIdsParam}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Client-ID": clientId,
        "X-Client-Secret": clientSecret,
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Process invoices failed" }));
    throw new Error(
      error.error || `Process invoices failed: ${response.status}`
    );
  }

  const result = await response.json();

  return result;
}

async function extractMetadata(
  fileIds: number[],
  accessToken: string,
  clientId: string,
  clientSecret: string,
  onProgress?: (step: string) => void
): Promise<any> {
  const fileIdsParam = fileIds.join(",");

  onProgress?.("Extracting metadata...");

  const response = await fetch(
    `${API_BASE_URL}/invoice_data_extraction/extract_metadata/?file_ids=${fileIdsParam}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Client-ID": clientId,
        "X-Client-Secret": clientSecret,
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Extract metadata failed" }));
    throw new Error(
      error.error || `Extract metadata failed: ${response.status}`
    );
  }

  const result = await response.json();
  return result;
}

async function generateLede(
  fileIds: number[],
  accessToken: string,
  clientId: string,
  clientSecret: string,
  onProgress?: (step: string) => void
): Promise<any> {
  const fileIdsParam = fileIds.join(",");
  onProgress?.("Generating LEDE report...");

  const response = await fetch(
    `${API_BASE_URL}/invoice_data_extraction/generate_lede/?file_ids=${fileIdsParam}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Client-ID": clientId,
        "X-Client-Secret": clientSecret,
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Generate LEDE failed" }));
    throw new Error(error.error || `Generate LEDE failed: ${response.status}`);
  }

  const result = await response.json();
  return result;
}

export async function downloadProcessedFilesZip(
  fileIds: number[],
  isZipUpload: boolean = false
): Promise<void> {
  const accessToken = getToken();
  const clientId = getClientId();
  const clientSecret = getClientSecret();

  if (!accessToken || !clientId || !clientSecret) {
    throw new Error("Authentication tokens missing. Please login again.");
  }

  if (fileIds.length === 1 && !isZipUpload) {
    // Single PDF upload  download individual LEDES file (not zipped)
    const fileId = fileIds[0];

    const response = await fetch(
      `${API_BASE_URL}/core/download-zip-only-ledes/?file_id=${fileId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Client-ID": clientId,
          "X-Client-Secret": clientSecret,
        },
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "LEDES file download failed" }));
      throw new Error(
        error.error || `LEDES file download failed: ${response.status}`
      );
    }

    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `ledes_file_${fileId}.xlsx`; // Change extension to xlsx for individual file
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch) {
        // If server provides filename, use it but ensure it's not a zip
        const serverFilename = filenameMatch[1];
        filename = serverFilename.replace(/\.zip$/, ".xlsx");
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } else {
    // ZIP folder upload or multiple files - download as ZIP
    const fileIdsParam = fileIds.join(",");

    const response = await fetch(
      `${API_BASE_URL}/core/download-zip-list-only-ledes/?file_ids=${fileIdsParam}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Client-ID": clientId,
          "X-Client-Secret": clientSecret,
        },
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "LEDES ZIP download failed" }));
      throw new Error(
        error.error || `LEDES ZIP download failed: ${response.status}`
      );
    }

    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get("Content-Disposition");
    let filename = `ledes_files_${
      fileIds.length > 1 ? "multi" : fileIds[0]
    }.zip`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export async function uploadFiles(
  files: File[],
  projectId: string = "iag",
  serviceId: string = "ledes",
  retryCount: number = 0,
  onProgress?: (step: string) => void
): Promise<any> {
  const MAX_RETRIES = 1; // Only allow one retry to prevent infinite loops

  if (!files || files.length === 0) {
    throw new Error("Please select files to upload");
  }

  try {
    // Get tokens from localStorage
    const accessToken = getToken();
    const clientId = getClientId();
    const clientSecret = getClientSecret();

    if (!accessToken || !clientId || !clientSecret) {
      throw new Error("Authentication tokens missing. Please login again.");
    }

    // Create FormData for multipart upload
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("project_id", projectId);
    formData.append("service_id", serviceId);

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "X-Client-ID": clientId,
      "X-Client-Secret": clientSecret,
    };

    const response = await fetch(`${API_BASE_URL}/core/upload/`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (response.ok) {
      const uploadResult = await response.json();

      // Extract file IDs from the upload result
      const fileIds =
        uploadResult.files_uploaded?.map((file: any) => file.file_id) || [];

      if (fileIds.length === 0) {
        toast({
          title: "Duplicate Detected",
          description: "This file has already been uploaded and processed.",
          variant: "info",
        });
        return uploadResult;
      }

      try {
        // Step 2: Process invoices
        const processResult = await processInvoices(
          fileIds,
          accessToken,
          clientId,
          clientSecret,
          onProgress
        );

        // Step 3: Extract metadata
        const metadataResult = await extractMetadata(
          fileIds,
          accessToken,
          clientId,
          clientSecret,
          onProgress
        );

        // Step 4: Generate LEDE report
        const ledeResult = await generateLede(
          fileIds,
          accessToken,
          clientId,
          clientSecret,
          onProgress
        );

        // Return combined results
        return {
          ...uploadResult,
          processing_results: {
            process_invoices: processResult,
            extract_metadata: metadataResult,
            generate_lede: ledeResult,
          },
        };
      } catch (processingError) {
        // Return upload result even if processing fails
        return {
          ...uploadResult,
          processing_error:
            processingError instanceof Error
              ? processingError.message
              : "Processing failed",
        };
      }
    } else if (response.status === 401 && retryCount < MAX_RETRIES) {
      // Token might be expired, try to refresh and retry (only once)

      try {
        await refreshTokenAndRetry();
        // Retry the upload with new token (increment retry count)
        return await uploadFiles(
          files,
          projectId,
          serviceId,
          retryCount + 1,
          onProgress
        );
      } catch (refreshError) {
        throw new Error("Session expired. Please login again.");
      }
    } else if (response.status === 401) {
      // Max retries exceeded
      throw new Error("Authentication failed after retry. Please login again.");
    } else {
      const error = await response
        .json()
        .catch(() => ({ error: "Upload failed" }));
      throw new Error(error.error || `Upload failed: ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
}
