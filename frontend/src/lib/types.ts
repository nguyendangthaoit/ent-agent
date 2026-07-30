export interface User {
    org_id: string;
    org_name: string;
    department_id: string;
    department_name: string;
    email: string;
    name: string;
    role: string;
}

export interface ApiResponse<T> {
    data: T[];
    total?: number;
    page?: number;
    limit?: number;
}