import { env } from "@/src/lib/env";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = env.API_BASE_URL;

export async function POST(request: NextRequest) {
    const body = await request.json();

    const backendResponse = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const data = await backendResponse.json();

    if (!backendResponse.ok) {
        return NextResponse.json(data, { status: backendResponse.status });
    }

    // Create response and set access_token as httpOnly cookie
    const response = NextResponse.json({
        token_type: data.token_type,
        // Optionally include other non-sensitive fields
    });

    if (data.access_token) {
        response.cookies.set("access_token", data.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24,
        });
    }

    return response;
}