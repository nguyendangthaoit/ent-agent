import { env } from "@/src/lib/env";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = env.API_BASE_URL;

async function proxy(request: NextRequest) {
    // Extract the path after /api/backend
    // example: /api/backend/v1/chat → /api/v1/chat
    const path = request.nextUrl.pathname.replace("/api/backend", "/api") + request.nextUrl.search;

    const headers: Record<string, string> = {
        "Content-Type": request.headers.get("content-type") || "application/json",
    };

    // Extract httpOnly cookie → Authorization header (backend expects Bearer token)
    const accessToken = request.cookies.get("access_token")?.value;
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const backendRes = await fetch(`${BACKEND_URL}${path}`, {
        method: request.method,
        headers,
        body: request.method !== "GET" && request.method !== "HEAD"
            ? await request.text()
            : undefined,
        // SSE/Streaming is required to avoid automatic fetch buffers on the Node.js server.
        cache: "no-store",
    });

    const contentType = backendRes.headers.get("content-type") || "";

    // SSE / streaming – pipe directly
    if (contentType.includes("text/event-stream")) {
        return new Response(backendRes.body, {
            status: backendRes.status,
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        });
    }

    // Regular JSON – forward status + body
    const data = await backendRes.text();
    return new NextResponse(data, {
        status: backendRes.status,
        headers: { "Content-Type": contentType || "application/json" },
    });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;