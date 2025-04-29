import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, MatSnackBarModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  pizzaMenu: Product[] = [];
  loading = true;
  error = false;
  isAdmin = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchPizzaMenu();
    
    // Subscribe to check if user is admin
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.isAdmin = user?.role === 'ADMIN';
      })
    );
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  fetchPizzaMenu(): void {
    console.log(`Fetching pizza menu from ${environment.apiUrl}/api/products`);
    this.http.get<Product[]>(`${environment.apiUrl}/api/products`)
      .subscribe({
        next: (products) => {
          this.pizzaMenu = products.filter(p => p.category === 'PIZZA');
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching pizza menu:', err);
          this.error = true;
          this.loading = false;
        }
      });
  }
  
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackBar.open(`Added ${product.name} to cart!`, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
} 