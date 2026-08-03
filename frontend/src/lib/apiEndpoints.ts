export const API_ENDPOINTS = {
    auth: {
        login: "/api/auth/login",
        logout: "/api/auth/logout",
    },
    users: {
        get_all: "/api/backend/v1/users",
        get_by_id: (id: string) => `/api/backend/v1/users/${id}`,
    },
    chat: {
        send: "/api/backend/v1/chat",
    },
} as const;