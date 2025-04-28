import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss']
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  createOrder(): void {
    // For a new order, navigate to edit page with id 0
    this.router.navigate(['/admin/orders/edit', 0]);
  }

  editOrder(id: number | undefined): void {
    if (typeof id === 'number') {
      this.router.navigate(['/admin/orders/edit', id]);
    } else {
      this.error = 'Cannot edit order without a valid ID.';
    }
  }

  deleteOrder(id: number | undefined): void {
    if (typeof id !== 'number') {
      this.error = 'Cannot delete order without a valid ID.';
      return;
    }
    
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete order. Please try again.';
          console.error(err);
        }
      });
    }
  }
}
