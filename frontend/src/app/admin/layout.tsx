"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeNav, setActiveNav] = useState("users");

    return (
        <div className="flex h-full">
            <AdminSidebar activeNav={activeNav} onNavChange={setActiveNav} />
            <main className="flex-1 overflow-y-auto p-6">
                {children}
            </main>
        </div>
    );
}