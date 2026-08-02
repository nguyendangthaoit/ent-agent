// src/lib/apiEndpoints.ts
export const API_ENDPOINTS = {
    users: {
        get_all: "/api/v1/users",
        get_by_id: (id: string) => `/api/v1/users/${id}`,
    },
    chat: {
        send: "/api/v1/chat",
    }
} as const;