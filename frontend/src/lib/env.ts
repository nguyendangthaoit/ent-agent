function getEnvVar(key: string, fallback?: string): string {
    const value = process.env[key] ?? fallback;
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const env = {
    API_BASE_URL: getEnvVar("NEXT_PUBLIC_API_BASE_URL", "http://127.0.0.1:8000"),
} as const;