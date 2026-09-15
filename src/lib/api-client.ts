import { getCookie, setCookie, deleteCookie } from 'cookies-next';

const DEFAULT_REQUEST_TIMEOUT_MS = 10000;

const getApiBase = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    return `http://${host}:4000/api/v1`;
  }
  return 'http://localhost:4000/api/v1';
};

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string;
  data: T;
  errors?: any;
}

export class ApiClient {
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return (getCookie('mla_access_token') as string) || localStorage.getItem('mla_access_token') || null;
  }

  static getAccessToken(): string | null {
    return this.getToken();
  }

  static setAuthTokens(accessToken: string, refreshToken?: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mla_access_token', accessToken);
      setCookie('mla_access_token', accessToken, { maxAge: 60 * 60 * 24 * 7 });
      if (refreshToken) {
        localStorage.setItem('mla_refresh_token', refreshToken);
        setCookie('mla_refresh_token', refreshToken, { maxAge: 60 * 60 * 24 * 30 });
      }
    }
  }

  static clearAuthTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mla_access_token');
      localStorage.removeItem('mla_refresh_token');
      deleteCookie('mla_access_token');
      deleteCookie('mla_refresh_token');
    }
  }

  static async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const apiBase = getApiBase();
    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => {
      controller.abort();
    }, DEFAULT_REQUEST_TIMEOUT_MS);

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
        signal: options.signal || controller.signal,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`Request timed out after ${DEFAULT_REQUEST_TIMEOUT_MS / 1000}s: ${url}`);
      }
      throw error;
    } finally {
      globalThis.clearTimeout(timeoutId);
    }

    const json = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = json.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    // Unwrap TransformInterceptor data wrapper if present
    if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
      return json.data as T;
    }

    return json as T;
  }

  static get<T = any>(endpoint: string, query?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (query) {
      const params = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          params.append(k, String(v));
        }
      });
      const qs = params.toString();
      if (qs) {
        url += (url.includes('?') ? '&' : '?') + qs;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  static post<T = any>(endpoint: string, body?: any): Promise<T> {
    const isFormData = body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  static patch<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  static put<T = any>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  static delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}
