"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/lib/apiClient";
import { API_ENDPOINTS } from "@/src/lib/apiEndpoints";

export interface CurrentUser {
    id: string;
    email: string;
    name: string;
    role: string;
    org_id: string;
    department_id: string | null;
    org_name: string;
    department_name: string;
}

interface AuthContextValue {
    user: CurrentUser | null;
    isLoading: boolean;
    refetchUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ["currentUserKey"],
        queryFn: () => apiClient.get<CurrentUser>(API_ENDPOINTS.auth.me),
        retry: false,
    });

    return (
        <AuthContext.Provider value={{ user: data ?? null, isLoading, refetchUser: refetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useCurrentUser(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useCurrentUser must be used within AuthProvider");
    return context;
}