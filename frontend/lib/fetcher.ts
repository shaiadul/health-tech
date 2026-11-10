/**
 * Core Server-side API Fetcher
 * Never exposes backend URL or tokens to the browser.
 */

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8080/api/v1";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
}

/**
 * Standard fetcher for public/unauthenticated endpoints
 */
export async function fetcher<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...restOptions } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...restOptions,
    });

    const data: ApiResponse<T> = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      data: null as any,
      error: error?.message || "Network request failed",
    };
  }
}

/**
 * Authenticated fetcher with Bearer token header
 */
export async function fetcherWithAuth<T = any>(
  endpoint: string,
  token: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  return fetcher<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

