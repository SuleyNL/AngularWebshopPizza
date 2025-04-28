import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { Order, OrderStatus } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const orderId = +this.route.snapshot.paramMap.get('id')!;
    if (orderId) {
      this.loadOrder(orderId);
    } else {
      this.error = 'Invalid order ID';
      this.loading = false;
    }
  }

  loadOrder(id: number): void {
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        
        // Check if the current user is viewing their own order
        this.authService.currentUser$.subscribe(user => {
          if (user?.id !== order.user.id && !this.authService.isAdmin()) {
            this.snackBar.open('You do not have permission to view this order', 'Close', { duration: 3000 });
            this.router.navigate(['/orders']);
          }
        });
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching order:', err);
        this.error = 'Failed to load order details. Please try again later.';
        this.loading = false;
      }
    });
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
  
  goBack(): void {
    this.router.navigate(['/orders']);
  }
  
  getItemsTotal(): number {
    if (!this.order?.orderItems) return 0;
    return this.order.orderItems.reduce((total, item) => total + item.quantity, 0);
  }
}
