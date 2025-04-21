import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';

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
  
  constructor(private orderService: OrderService) {}
  
  ngOnInit(): void {
    this.fetchOrders();
  }
  
  fetchOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }
  
  getItemCount(order: Order): number {
    return order.items.reduce((count, item) => count + item.quantity, 0);
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