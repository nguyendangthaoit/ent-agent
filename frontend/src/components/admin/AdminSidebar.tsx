"use client";

import React from "react";
import { cn } from "@/src/lib/utils";
import {
    Users,
    Building2,
    Shield,
    Settings,
    BarChart3,
    type LucideIcon,
} from "lucide-react";

interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
    { id: "users", label: "Users", icon: Users },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "roles", label: "Roles & Permissions", icon: Shield },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
];

interface AdminSidebarProps {
    activeNav: string;
    onNavChange: (navId: string) => void;
}

export function AdminSidebar({ activeNav, onNavChange }: AdminSidebarProps) {
    return (
        <aside className="flex h-full w-64 flex-col border-r border-border bg-muted/30">
            {/* Header */}
            <div className="border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold text-foreground">Admin Panel</h2>
                <p className="text-xs text-muted-foreground">Manage your application</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-2">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavChange(item.id)}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                            "hover:bg-accent hover:text-accent-foreground",
                            activeNav === item.id
                                ? "bg-accent text-accent-foreground font-medium"
                                : "text-muted-foreground",
                        )}
                    >
                        <item.icon className="size-4 shrink-0" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div className="border-t border-border p-3">
                <p className="text-xs text-muted-foreground">Admin v0.1.0</p>
            </div>
        </aside>
    );
}