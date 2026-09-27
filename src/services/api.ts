import type { ApiResponse } from '@/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, (error as Error).message || 'Network request failed');
  }
}
