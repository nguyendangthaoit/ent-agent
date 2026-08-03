import { env } from "./env";

const BASE_URL = env.API_BASE_URL;

interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    headers?: Record<string, string>;
    body?: unknown;
}

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public body?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

function handleUnauthorized() {
    // httpOnly cookies can't be cleared from client side;
    // the backend invalidates the session. Just redirect.
    if (window.location.pathname === "/login") return;
    window.location.href = "/login";
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", headers = {}, body } = options;

    const config: RequestInit = {
        method,
        credentials: "include", // sends httpOnly cookie automatically
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
        let errorBody: unknown;
        try {
            errorBody = await response.json();
        } catch {
            errorBody = await response.text();
        }

        if (response.status === 401) {
            handleUnauthorized();
        }

        throw new ApiError(response.status, `API Error ${response.status}`, errorBody);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

async function streamRequest(endpoint: string, body: unknown, signal?: AbortSignal): Promise<Response> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        credentials: "include", // sends httpOnly cookie automatically
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal,
    });

    if (!response.ok) {
        if (response.status === 401) {
            handleUnauthorized();
        }
        const errorText = await response.text();
        throw new ApiError(response.status, `Stream Error ${response.status}`, errorText);
    }

    return response;
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

    stream: streamRequest,
};