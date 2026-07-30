const BASE_URL = "http://127.0.0.1:8000";

interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    body?: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", headers = {}, body } = options;

    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
    };

    if (body !== undefined) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`API Error ${response.status}: ${errorBody}`);
    }

    return response.json();
}

export const apiClient = {
    get: <T>(endpoint: string, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: "GET", headers }),

    post: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: "POST", body, headers }),

    put: <T>(endpoint: string, body: unknown, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: "PUT", body, headers }),

    delete: <T>(endpoint: string, headers?: Record<string, string>) =>
        request<T>(endpoint, { method: "DELETE", headers }),
};