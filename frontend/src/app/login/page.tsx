"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/src/components/auth/LoginForm";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();

    const handleLogin = async (email: string, password: string) => {
        setIsLoading(true);
        setError(undefined);

        // Simulate a login request (placeholder for real API)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // For demo: accept any non-empty credentials
            if (email && password) {
                // Redirect to chat page after "login"
                router.push("/");
            } else {
                setError("Please enter your email and password.");
            }
        } catch {
            setError("Login failed. Please try again.");
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