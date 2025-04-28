import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  subtotal = 0;
  total = 0;
  private cartSubscription: Subscription | null = null;
  
  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
    });
  }
  
  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
  
  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce(
      (sum, item) => sum + (item.product.price * item.quantity), 
      0
    );
    this.total = this.subtotal;
  }
  
  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.product.id!, item.quantity + 1);
  }
  
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.product.id!, item.quantity - 1);
    } else {
      this.removeItem(item);
    }
  }
  
  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.product.id!);
    this.snackBar.open(`Removed ${item.product.name} from cart!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
  
  clearCart(): void {
    this.cartService.clearCart();
    this.snackBar.open('Cart has been cleared!', 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
} 