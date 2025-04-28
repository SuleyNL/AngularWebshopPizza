import { OrderItem } from './order-item.model';
import { User } from './user.model';

export interface Order {
  id?: number;
  user: User;
  orderItems: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryPhone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CreateOrderRequest {
  userId: number;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  deliveryPhone: string;
  orderItems: {
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface UpdateOrderRequest {
  userId?: number;
  status?: OrderStatus;
  totalAmount?: number;
  deliveryAddress?: string;
  deliveryPhone?: string;
  orderItems?: {
    productId: number;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
} 