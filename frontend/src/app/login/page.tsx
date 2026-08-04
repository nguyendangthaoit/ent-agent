"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/src/components/auth/LoginForm";
import { apiClient, ApiError } from "@/src/lib/apiClient";
import { API_ENDPOINTS } from "@/src/lib/apiEndpoints";
import { getSafeRedirect } from "@/src/lib/utils";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        setError(undefined);

        try {
            // Route handler sets httpOnly cookie + returns { token_type }
            await apiClient.post(API_ENDPOINTS.auth.login, { email, password });
            const redirectTo = getSafeRedirect(searchParams.get("redirect"));
            router.push(redirectTo);
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