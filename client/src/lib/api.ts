const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type RequestOptions = {
  method?: string;
  body?: Record<string, unknown> | FormData;
  token?: string | null;
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const isFormData = body instanceof FormData;
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: "include",
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data as T;
}

export function createApi(token: string | null) {
  return {
    get: <T>(endpoint: string) => request<T>(endpoint, { token }),
    post: <T>(endpoint: string, body: Record<string, unknown> | FormData) =>
      request<T>(endpoint, { method: "POST", body, token }),
    patch: <T>(endpoint: string, body: Record<string, unknown>) =>
      request<T>(endpoint, { method: "PATCH", body, token }),
    delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE", token }),
  };
}
