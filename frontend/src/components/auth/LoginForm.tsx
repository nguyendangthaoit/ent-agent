"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

interface LoginFormProps {
    onLogin?: (email: string, password: string) => Promise<void>;
    isLoading?: boolean;
    error?: string;
}

export function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;
        await onLogin?.(email.trim(), password.trim());
    };

    return (
        <div className="mx-auto w-full max-w-sm space-y-6">
            {/* Header */}
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                    Sign in to your account to continue
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email field */}
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={isLoading}
                        className={cn(
                            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                            "placeholder:text-muted-foreground",
                            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                    />
                </div>

                {/* Password field */}
                <div className="space-y-2">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            className={cn(
                                "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm transition-colors",
                                "placeholder:text-muted-foreground",
                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                "disabled:cursor-not-allowed disabled:opacity-50",
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                {/* Submit button */}
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            Signing in…
                        </>
                    ) : (
                        <>
                            <LogIn className="size-4" />
                            Sign In
                        </>
                    )}
                </Button>
            </form>

            {/* Footer hint */}
            <p className="text-center text-xs text-muted-foreground">
                Demo: use any email and password (no real auth yet)
            </p>
        </div>
    );
}