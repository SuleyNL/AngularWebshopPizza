export interface User {
    id?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    address?: string;
    phone?: string;
    role: string;
}

export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    id: number;
    token: string;
    username: string;
    role: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address?: string;
    phone?: string;
} 