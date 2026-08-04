export const dynamic = 'force-dynamic';
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
        const sseResponse = new NextResponse(backendRes.body, {
            status: backendRes.status,
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        });

        if (backendRes.status === 401 && accessToken) {
            sseResponse.cookies.delete("access_token");
        }

        return sseResponse;
    }

    // Regular JSON – forward status + body
    const data = await backendRes.text();
    const response = new NextResponse(data, {
        status: backendRes.status,
        headers: { "Content-Type": contentType || "application/json" },
    });
    if (backendRes.status === 401 && accessToken)
        response.cookies.delete("access_token");

    return response;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;