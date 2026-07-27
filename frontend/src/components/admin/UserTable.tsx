"use client";

import { SquarePen, Trash2 } from "lucide-react";

interface User {
    id: string;
    name: string;
    department: string;
    role: string;
}

const MOCK_USERS: User[] = [
    { id: "U001", name: "Alice Johnson", department: "Engineering", role: "Developer" },
    { id: "U002", name: "Bob Smith", department: "Design", role: "Designer" },
    { id: "U003", name: "Charlie Lee", department: "Engineering", role: "Senior Developer" },
    { id: "U004", name: "Diana Chen", department: "Marketing", role: "Marketing Lead" },
    { id: "U005", name: "Eve Torres", department: "HR", role: "HR Manager" },
];

export function UserTable() {
    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Users</h3>
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
                                ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                Name
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
                        {MOCK_USERS.map((user) => (
                            <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                    {user.id}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">
                                    {user.name}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                    {user.department}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                                    {user.role}
                                </td>
                                <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                                    <div className="inline-flex items-center justify-end">
                                        <button className="text-primary hover:underline"><SquarePen className="size-4 shrink-0" /></button>
                                        <span className="mx-2 text-muted-foreground">|</span>
                                        <button className="text-destructive hover:underline"><Trash2 className="size-4 shrink-0" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}