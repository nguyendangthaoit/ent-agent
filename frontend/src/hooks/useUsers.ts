"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/src/lib/apiClient";
import type { User } from "@/src/lib/types";
import { API_ENDPOINTS } from "@/src/lib/apiEndpoints";
type UseUsersResult = {
    users: User[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useUsers(): UseUsersResult {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fetchKey, setFetchKey] = useState(0);

    useEffect(() => {
        apiClient.get<User[]>(API_ENDPOINTS.users.get_all)
            .then(setUsers)
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to fetch users");
                setUsers([]);
            })
            .finally(() => setIsLoading(false));
    }, [fetchKey]);

    const refetch = () => {
        setIsLoading(true);
        setError(null);
        setFetchKey((prev) => prev + 1);
    };

    return { users, isLoading, error, refetch };
}