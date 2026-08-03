"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/src/components/auth/LoginForm";
import { apiClient, ApiError } from "@/src/lib/apiClient";
import { API_ENDPOINTS } from "@/src/lib/apiEndpoints";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        setError(undefined);

        try {
            // Backend sets httpOnly cookie via Set-Cookie header
            await apiClient.post(API_ENDPOINTS.auth.login, { email, password });
            router.push("/");
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                const body = err.body;
                if (typeof body === "object" && body !== null && "detail" in body) {
                    setError(String((body as Record<string, unknown>).detail));
                } else {
                    setError(`Login failed (${err.status}). Please try again.`);
                }
            } else {
                setError("Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-sm rounded-lg border border-border bg-background p-6 shadow-sm">
                <LoginForm onLogin={handleLogin} isLoading={isLoading} error={error} />
            </div>
        </div>
    );
}