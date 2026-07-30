"use client";

import React from "react";
import { useUsers } from "@/src/hooks/useUsers";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export function UserTable() {
    const { users, isLoading, error, refetch } = useUsers();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading users…</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 py-20">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="size-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
                <button
                    onClick={refetch}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                    <RefreshCw className="size-3" />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Users</h3>
                    <p className="text-sm text-muted-foreground">
                        {users.length} user{users.length !== 1 ? "s" : ""} found
                    </p>
                </div>
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                    + Add User
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-border">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Organization
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Department
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Role
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                        {users.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                                >
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.email} className="hover:bg-muted/30 transition-colors">
                                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">
                                        {user.name}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                        {user.email}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                        {user.org_name}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                        {user.department_name}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                        {user.role}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                                        <button className="text-primary hover:underline">Edit</button>
                                        <span className="mx-2 text-muted-foreground">|</span>
                                        <button className="text-destructive hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}