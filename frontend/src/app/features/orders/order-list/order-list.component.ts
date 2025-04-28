import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule,
    MatChipsModule,
    DatePipe
  ],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = false;
  currentUser: User | null = null;
  
  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.fetchUserOrders(user.id);
      } else {
        this.loading = false;
        this.error = true;
      }
    });
  }
  
  fetchUserOrders(userId: number | undefined): void {
    if (!userId) {
      this.loading = false;
      this.error = true;
      return;
    }
    
    this.orderService.getOrdersForUser(userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching user orders:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
  
  getItemCount(order: Order): number {
    if (!order.orderItems) return 0;
    return order.orderItems.reduce((count: number, item) => count + item.quantity, 0);
  }
  
  getStatusClass(status: OrderStatus): string {
    switch(status) {
      case OrderStatus.PENDING:
        return 'status-pending';
      case OrderStatus.CONFIRMED:
        return 'status-confirmed';
      case OrderStatus.DELIVERED:
        return 'status-delivered';
      case OrderStatus.CANCELLED:
        return 'status-cancelled';
      default:
        return '';
    }
  }
} 