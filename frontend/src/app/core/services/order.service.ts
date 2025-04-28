import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, of, throwError, catchError } from 'rxjs';
import { Order, UpdateOrderRequest } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = `${environment.apiUrl}/api/orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // In OrderService
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API_URL, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      map(orders => orders.map(order => this.mapOrderResponse(order)))
    );
  }
  
  getOrdersForUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/user/${userId}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      map(orders => orders.map(order => this.mapOrderResponse(order)))
    );
  }
  
  getOrderById(id: number): Observable<Order> {
    return this.http.get<any>(`${this.API_URL}/${id}`, { 
      headers: this.getAuthHeaders() 
    }).pipe(
      map(order => this.mapOrderResponse(order))
    );
  }

  createOrder(updateOrderRequest: UpdateOrderRequest): Observable<Order> {
    const formattedRequest = this.formatOrderRequest(updateOrderRequest);
    console.log('Formatted order request for CREATE:', formattedRequest);
    
    // Get token from auth service
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token available');
      return throwError(() => 'Authentication required. Please log in and try again.');
    }
    
    console.log('Sending request with auth token:', !!token);
    console.log('Creating order for user:', JSON.stringify(updateOrderRequest)); 

    
    return this.http.post<any>(this.API_URL, formattedRequest, { 
      headers: this.getAuthHeaders() 
    })
      .pipe(
        map(response => this.mapOrderResponse(response)),
        catchError(this.handleError)
      );
  }
  
  updateOrder(id: number, order: Partial<Order>): Observable<Order> {
    const formattedOrder = this.formatOrderRequest(order);
    console.log('Formatted order request for UPDATE:', formattedOrder);
    
    // Get token from auth service
    const token = this.authService.getToken();
    if (!token) {
      console.error('No authentication token available');
      return throwError(() => 'Authentication required. Please log in and try again.');
    }
    
    console.log('Sending update request with auth token:', !!token);
    
    return this.http.put<any>(`${this.API_URL}/${id}`, formattedOrder, { 
      headers: this.getAuthHeaders() 
    })
      .pipe(
        map(response => this.mapOrderResponse(response)),
        catchError(this.handleError)
      );
  }
  
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { 
      headers: this.getAuthHeaders() 
    });
  }
  
  calculateOrderTotal(orderItems: { productId: number; quantity: number; unitPrice: number }[]): number {
    return orderItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  }
  
  private formatOrderRequest(order: any): any {
    const formattedOrder = { ...order };
    
    // If we have orderItems, convert to items for the backend
    if (formattedOrder.orderItems && !formattedOrder.items) {
      formattedOrder.items = formattedOrder.orderItems;
      delete formattedOrder.orderItems;
    }
    
    if (formattedOrder.deliveryAddress && typeof formattedOrder.deliveryAddress === 'object') {
      const addr = formattedOrder.deliveryAddress;
      formattedOrder.deliveryAddress = `${addr.address}, ${addr.city}, ${addr.postalCode}, ${addr.country}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '');
    }
    
    return formattedOrder;
  }
  
  private mapOrderResponse(order: any): Order {
    if (!order) return order;
    
    // Map backend 'items' to frontend 'orderItems'
    if (order.items && !order.orderItems) {
      order.orderItems = order.items;
    }
    
    return order as Order;
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    
    if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action. Please check your login status or contact an administrator.';
      errorMessage+= JSON.stringify(error)
      console.error('Authentication error (403):', error);
    } else if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      errorMessage = error.error && typeof error.error === 'string' 
        ? error.error 
        : `Error Code: ${error.status}, Message: ${error.message}`;
      
      console.error(
        `Server error - Status: ${error.status}, ` +
        `Body:`, error.error
      );
    }
    
    return throwError(() => errorMessage);
  }
} 