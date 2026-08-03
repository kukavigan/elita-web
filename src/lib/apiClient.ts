const configuredApiBase = import.meta.env.VITE_API_URL?.trim();
const API_BASE = (configuredApiBase || 'http://localhost:3001/api').replace(/\/+$/, '');

export const TOKEN_STORAGE_KEY = 'e5_token';
export const AUTH_INVALIDATED_EVENT = 'e5:auth-invalidated';

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public messages?: { field: string; message: string }[],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_INVALIDATED_EVENT));
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

  if (!res.ok) {
    let body: { error?: string; code?: string; messages?: { field: string; message: string }[] } = {};
    try { body = await res.json(); } catch { /* empty */ }
    if (
      res.status === 401 &&
      ['UNAUTHORIZED', 'INVALID_TOKEN', 'TOKEN_EXPIRED', 'SESSION_EXPIRED'].includes(body.code ?? '')
    ) {
      clearToken();
    }

    throw new ApiError(
      res.status,
      body.code ?? 'ERROR',
      body.error ?? `Gabim i serverit (${res.status})`,
      body.messages,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

function get<T>(path: string) {
  return request<T>(path);
}

function post<T>(path: string, body?: unknown) {
  return request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined });
}

function put<T>(path: string, body?: unknown) {
  return request<T>(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined });
}

function del<T>(path: string) {
  return request<T>(path, { method: 'DELETE' });
}

export { get, post, put, del, ApiError };
