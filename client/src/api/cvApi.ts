// API Configuration
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// HTTP client with timeout and error handling
class HTTPClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof APIError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new APIError('Request timeout', 408);
        }
        throw new APIError(error.message);
      }
      
      throw new APIError('Unknown error occurred');
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, isFormData = false): Promise<T> {
    const options: RequestInit = {
      method: 'POST',
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    };

    if (!isFormData) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    return this.request<T>(endpoint, options);
  }

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Singleton HTTP client instance
const httpClient = new HTTPClient(API_BASE, API_TIMEOUT);

export interface CV {
  id: number;
  file: string;
  file_url: string;
  uploaded_at: string;
  status: 'Pending' | 'Processed' | 'Failed';
  processing_time: number;
  processed_at: string | null;
  top_skills: string[] | null;
}

export interface CVDetail extends CV {
  extracted_text: string;
  entities: {
    name?: string[];
    organizations?: string[];
    dates?: string[];
    experience?: string[];
    skills?: string[];
    education?: string[];
  };
}

export interface CVListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CV[];
}

export interface UploadResult {
  name: string;
  success: boolean;
  cv?: CV;
  error?: string;
}

export interface UploadResponse {
  processed: number;
  total: number;
  results: UploadResult[];
}

export interface FilterPayload {
  education?: string;
  skills?: string[] | string;
  experience?: number | string;
  keywords?: string[] | string;
}

export interface FilterMatch {
  education: boolean;
  skills: number;
  experience: boolean;
  keywords: number;
}

export interface FilterResult {
  cv: CV;
  score: number;
  matches: FilterMatch;
}

export interface FilterResponse {
  count: number;
  results: FilterResult[];
}

export interface Stats {
  total_cvs: number;
  processed_cvs: number;
  pending_cvs: number;
  failed_cvs: number;
  processing_progress: number;
  avg_processing_time: number;
  top_skills?: Array<{ skill: string; count: number }>;
}

export async function fetchCVs(page = 1): Promise<CVListResponse> {
  return httpClient.get<CVListResponse>(`/cvs/?page=${page}`);
}

export async function fetchCVDetail(id: number): Promise<CVDetail> {
  return httpClient.get<CVDetail>(`/cvs/${id}/`);
}

export async function uploadCVs(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return httpClient.post<UploadResponse>('/cvs/upload/', formData, true);
}

export async function filterCVs(payload: FilterPayload): Promise<FilterResponse> {
  return httpClient.post<FilterResponse>('/cvs/filter/', payload);
}

export async function fetchStats(): Promise<Stats> {
  return httpClient.get<Stats>('/cvs/stats/');
}

// Helper function to download CV file
export function getDownloadURL(fileUrl: string): string {
  return fileUrl;
}

// Validate file before upload
export function validateFile(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['.pdf', '.docx', '.txt', '.jpg', '.jpeg', '.png'];
  
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  
  if (!ALLOWED_TYPES.includes(ext)) {
    return { valid: false, error: `Invalid file type: ${ext}. Allowed: ${ALLOWED_TYPES.join(', ')}` };
  }
  
  if (file.size > MAX_SIZE) {
    return { valid: false, error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 5MB` };
  }
  
  return { valid: true };
}
