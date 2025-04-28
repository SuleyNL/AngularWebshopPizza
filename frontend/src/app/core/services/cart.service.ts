import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = `${environment.apiUrl}/api/cart`;
  private readonly CART_STORAGE_KEY = 'pizza_cart';
  
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadCartFromStorage();
    
    // Subscribe to auth changes to handle cart synchronization
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.syncCartWithServer();
      }
    });
  }
  
  private loadCartFromStorage(): void {
    const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const cartItems = JSON.parse(storedCart);
        this.cartItemsSubject.next(cartItems);
      } catch (error) {
        console.error('Error parsing cart from storage:', error);
        this.cartItemsSubject.next([]);
      }
    }
  }
  
  private saveCartToStorage(): void {
    localStorage.setItem(
      this.CART_STORAGE_KEY, 
      JSON.stringify(this.cartItemsSubject.value)
    );
  }
  
  private syncCartWithServer(): void {
    // In a full implementation, this would sync local cart with server-side cart. for now its in localStorage
  }
  
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }
  
  setCartItems(cartItems: CartItem[]): void {
    // Filter out any invalid items (e.g., items with no product or quantity)
    const validItems = cartItems.filter(item => 
      item.product && item.product.id && item.quantity > 0
    );
    
    this.cartItemsSubject.next(validItems);
    this.saveCartToStorage();
  }
  
  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartItemsSubject.value;
    const existingItemIndex = currentCart.findIndex(item => item.product.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Item already exists, update quantity
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += quantity;
      this.cartItemsSubject.next(updatedCart);
    } else {
      // Item doesn't exist, add new item
      this.cartItemsSubject.next([...currentCart, { product, quantity }]);
    }
    
    this.saveCartToStorage();
  }
  
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    const currentCart = this.cartItemsSubject.value;
    const existingItemIndex = currentCart.findIndex(item => item.product.id === productId);
    
    if (existingItemIndex !== -1) {
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity = quantity;
      this.cartItemsSubject.next(updatedCart);
      this.saveCartToStorage();
    }
  }
  
  removeFromCart(productId: number): void {
    const currentCart = this.cartItemsSubject.value;
    const updatedCart = currentCart.filter(item => item.product.id !== productId);
    this.cartItemsSubject.next(updatedCart);
    this.saveCartToStorage();
  }
  
  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem(this.CART_STORAGE_KEY);
  }
  
  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + (item.product.price * item.quantity), 
      0
    );
  }
  
  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce(
      (count, item) => count + item.quantity, 
      0
    );
  }
} 