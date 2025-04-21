import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { Order, CreateOrderRequest } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = `${environment.apiUrl}/api/orders`;
  
  // Mock data for testing until backend is integrated
  private mockOrders: Order[] = [
    {
      id: 1,
      userId: 1,
      totalAmount: 35.97,
      status: 'DELIVERED' as any,
      discountAmount: 0,
      deliveryAddress: '123 Main St, Anytown, USA',
      deliveryPhone: '555-123-4567',
      createdAt: new Date('2023-04-15T10:30:00'),
      items: [
        {
          id: 1,
          productId: 1,
          product: {
            id: 1,
            name: 'Margherita',
            description: 'Classic pizza with tomato sauce, mozzarella cheese, and fresh basil',
            price: 11.99,
            category: 'PIZZA',
            isAvailable: true
          },
          quantity: 2,
          unitPrice: 11.99,
          totalPrice: 23.98
        },
        {
          id: 2,
          productId: 3,
          product: {
            id: 3,
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with Caesar dressing, croutons, and parmesan cheese',
            price: 5.99,
            category: 'SIDE',
            isAvailable: true
          },
          quantity: 2,
          unitPrice: 5.99,
          totalPrice: 11.98
        }
      ]
    },
    {
      id: 2,
      userId: 1,
      totalAmount: 29.97,
      status: 'CONFIRMED' as any,
      discountAmount: 5,
      deliveryAddress: '123 Main St, Anytown, USA',
      deliveryPhone: '555-123-4567',
      createdAt: new Date('2023-04-20T18:45:00'),
      items: [
        {
          id: 3,
          productId: 2,
          product: {
            id: 2,
            name: 'Pepperoni',
            description: 'Classic pizza with tomato sauce, mozzarella cheese, and pepperoni',
            price: 13.99,
            category: 'PIZZA',
            isAvailable: true
          },
          quantity: 1,
          unitPrice: 13.99,
          totalPrice: 13.99
        },
        {
          id: 4,
          productId: 4,
          product: {
            id: 4,
            name: 'Garlic Bread',
            description: 'Freshly baked bread with garlic butter and herbs',
            price: 4.99,
            category: 'SIDE',
            isAvailable: true
          },
          quantity: 2,
          unitPrice: 4.99,
          totalPrice: 9.98
        },
        {
          id: 5,
          productId: 5,
          product: {
            id: 5,
            name: 'Soda',
            description: 'Choice of cola, lemon-lime, or orange soda (600ml)',
            price: 1.99,
            category: 'BEVERAGE',
            isAvailable: true
          },
          quantity: 3,
          unitPrice: 1.99,
          totalPrice: 5.97
        }
      ]
    },
    {
      id: 3,
      userId: 1,
      totalAmount: 45.96,
      status: 'PENDING' as any,
      discountAmount: 0,
      deliveryAddress: '123 Main St, Anytown, USA',
      deliveryPhone: '555-123-4567',
      createdAt: new Date('2023-04-25T20:15:00'),
      items: [
        {
          id: 6,
          productId: 6,
          product: {
            id: 6,
            name: 'Supreme',
            description: 'Loaded pizza with pepperoni, sausage, bell peppers, onions, and olives',
            price: 15.99,
            category: 'PIZZA',
            isAvailable: true
          },
          quantity: 2,
          unitPrice: 15.99,
          totalPrice: 31.98
        },
        {
          id: 7,
          productId: 7,
          product: {
            id: 7,
            name: 'Buffalo Wings',
            description: '8 pieces of spicy buffalo wings served with blue cheese dip',
            price: 9.99,
            category: 'SIDE',
            isAvailable: true
          },
          quantity: 1,
          unitPrice: 9.99,
          totalPrice: 9.99
        },
        {
          id: 8,
          productId: 5,
          product: {
            id: 5,
            name: 'Soda',
            description: 'Choice of cola, lemon-lime, or orange soda (600ml)',
            price: 1.99,
            category: 'BEVERAGE',
            isAvailable: true
          },
          quantity: 2,
          unitPrice: 1.99,
          totalPrice: 3.98
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {}
  
  getOrders(): Observable<Order[]> {
    // When backend is ready, uncomment this
    // return this.http.get<Order[]>(this.API_URL);
    
    // For now, return mock data
    return of(this.mockOrders);
  }
  
  getOrderById(id: number): Observable<Order> {
    // When backend is ready, uncomment this
    // return this.http.get<Order>(`${this.API_URL}/${id}`);
    
    // For now, return mock data
    const order = this.mockOrders.find(o => o.id === id);
    return of(order as Order);
  }
  
  createOrder(orderRequest: CreateOrderRequest): Observable<Order> {
    // When backend is ready, uncomment this
    // return this.http.post<Order>(this.API_URL, orderRequest);
    
    // For now, return mock response
    const newOrderId = this.mockOrders.length + 1;
    const now = new Date();
    
    // This would normally come from the backend after processing
    const newOrder: Order = {
      id: newOrderId,
      userId: 1,
      totalAmount: 0, // Calculated on server
      status: 'PENDING' as any,
      discountAmount: 0,
      deliveryAddress: orderRequest.deliveryAddress,
      deliveryPhone: orderRequest.deliveryPhone,
      createdAt: now,
      updatedAt: now,
      items: []
    };
    
    return of(newOrder);
  }
  
  calculateOrderTotal(items: { productId: number; quantity: number; unitPrice: number }[]): number {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }
} 