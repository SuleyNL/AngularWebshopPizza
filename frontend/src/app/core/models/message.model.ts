export interface Message {
    id?: number;
    name: string;
    email: string;
    subject: string;
    content: string;
    createdAt?: Date;
    isRead?: boolean;
    userId?: number; // Optional reference to a user if the message is from a registered user
}

export interface CreateMessageRequest {
    name: string;
    email: string;
    subject: string;
    content: string;
} 