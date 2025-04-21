import { Product } from './product.model';

export interface OrderItem {
  id?: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id?: number;
  userId?: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  promocodeId?: number;
  discountAmount: number;
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
  items: {
    productId: number;
    quantity: number;
  }[];
  promocodeId?: number;
  deliveryAddress: string;
  deliveryPhone: string;
} 