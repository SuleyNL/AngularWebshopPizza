import { Product } from './product.model';

export interface OrderItem {
  id?: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
} 