const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// Debug environment variables
console.log("Environment variables debug:", {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  all_env: import.meta.env
});

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
    // Use the new simple login endpoint
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

    console.log("Login successful:", {
      token_type: loginData.token_type,
      expires_in: loginData.expires_in,
      scope: loginData.scope,
      client_id: loginData.client_id
    });

    return loginData;
  } catch (error) {
    console.error("Login error:", error);
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
    const payload = JSON.parse(atob(token.split('.')[1]));
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
    console.log('Attempting token refresh:', {
      hasRefreshToken: !!refreshToken,
      refreshTokenLength: refreshToken?.length
    });

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/web/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    console.log('Token refresh response:', {
      status: response.status,
      ok: response.ok
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Token refresh successful, new token length:', data.access?.length);
      localStorage.setItem('access_token', data.access);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error('Token refresh failed:', errorData);
      throw new Error(`Token refresh failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    // Clear all auth data and redirect to login
    localStorage.clear();
    window.location.href = '/';
    throw error;
  }
}

// File upload function with retry limit to prevent infinite loops
export async function uploadFiles( files: File[], projectId: string = "iag", serviceId: string = "ledes", retryCount: number = 0): Promise<any> {
  const MAX_RETRIES = 1; // Only allow one retry to prevent infinite loops

  if (!files || files.length === 0) {
    throw new Error('Please select files to upload');
  }

  try {
    // Get tokens from localStorage
    const accessToken = getToken();
    const clientId = getClientId();
    const clientSecret = getClientSecret();

    console.log('Upload attempt:', {
      retryCount,
      hasAccessToken: !!accessToken,
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      accessTokenLength: accessToken?.length,
      clientId: clientId
    });

    if (!accessToken || !clientId || !clientSecret) {
      throw new Error('Authentication tokens missing. Please login again.');
    }

    // Create FormData for multipart upload
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));
    formData.append('project_id', projectId);
    formData.append('service_id', serviceId);

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'X-Client-ID': clientId,
      'X-Client-Secret': clientSecret,
    };

    console.log('Making upload request with headers:', {
      'Authorization': `Bearer ${accessToken.substring(0, 20)}...`,
      'X-Client-ID': clientId,
      'X-Client-Secret': clientSecret ? 'present' : 'missing'
    });

    const response = await fetch(`${API_BASE_URL}/core/upload/`, {
      method: 'POST',
      headers,
      body: formData,
    });

    console.log('Upload response:', {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Upload successful:', result);
      return result;
    } else if (response.status === 401 && retryCount < MAX_RETRIES) {
      // Get the error details for debugging
      const errorData = await response.json().catch(() => ({}));
      console.log('401 error details:', errorData);

      // Token might be expired, try to refresh and retry (only once)
      console.log(`Token expired, attempting refresh... (retry ${retryCount + 1}/${MAX_RETRIES})`);

      try {
        await refreshTokenAndRetry();
        // Retry the upload with new token (increment retry count)
        return await uploadFiles(files, projectId, serviceId, retryCount + 1);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw new Error('Session expired. Please login again.');
      }
    } else if (response.status === 401) {
      // Max retries exceeded
      const errorData = await response.json().catch(() => ({}));
      console.log('401 error after retry:', errorData);
      throw new Error('Authentication failed after retry. Please login again.');
    } else {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `Upload failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}
