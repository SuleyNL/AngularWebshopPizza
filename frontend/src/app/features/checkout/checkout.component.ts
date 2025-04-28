import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { Observable, debounceTime, map, startWith, of } from 'rxjs';

import { CartService, CartItem } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { OrderStatus } from '../../core/models/order.model';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  orderForm: FormGroup;
  cartItems: CartItem[] = [];
  products: Product[] = [];
  filteredProducts: Observable<Product[]>[] = [];
  selectedProducts: Product[] = [];
  loading = false;
  submitted = false;
  error = '';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private productService: ProductService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.orderForm = this.createOrderForm();
  }
  
  ngOnInit(): void {
    // Load all products for autocomplete
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        
        // Initialize form with cart items after products are loaded
        this.initializeCartItems();
      },
      error: (error) => {
        this.error = 'Failed to load products.';
        console.error('Error loading products:', error);
      }
    });

    // Get current user for delivery info
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.orderForm.patchValue({
          userId: user.id,
          deliveryAddress: user.address || '',
          deliveryPhone: user.phone || ''
        });
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      }
    });
    console.log('Current user:', this.authService.currentUserSubject.value);
    console.log('Current form user:', this.orderForm.get('userId')?.value);
  }

  initializeCartItems(): void {
    // Load cart items
    this.cartItems = this.cartService.getCartItems();
    
    // Initialize form with cart items
    if (this.cartItems.length > 0) {
      this.cartItems.forEach(item => {
        this.addItem(item.product, item.quantity);
      });
    } else {
      // Add an empty item if cart is empty
      this.addEmptyItem();
    }

    this.calculateTotal();
  }

  createOrderForm(): FormGroup {
    
    return this.fb.group({
      userId: [''],
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      status: [OrderStatus.PENDING],
      deliveryAddress: ['', [Validators.required]],
      deliveryPhone: ['', [Validators.required]],
      orderItems: this.fb.array([])
    });
  }

  get itemsFormArray(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  createItemFormGroup(product?: Product, quantity: number = 1): FormGroup {
    const formGroup = this.fb.group({
      productId: [product?.id || '', [Validators.required]],
      productName: [product?.name || '', [Validators.required]],
      quantity: [quantity, [Validators.required, Validators.min(1)]],
      unitPrice: [product?.price || 0, [Validators.required, Validators.min(0)]],
      imageUrl: [product?.imageUrl || ''],
      productDescription: [product?.description || ''],
      isProductSelected: [!!product]
    });

    // If a product is already selected, disable the product name field
    if (product) {
      formGroup.get('productName')?.disable();
    }

    return formGroup;
  }

  addItem(product?: Product, quantity: number = 1): void {
    const itemForm = this.createItemFormGroup(product, quantity);
    this.itemsFormArray.push(itemForm);
    
    const index = this.itemsFormArray.length - 1;
    this.setupProductAutocomplete(index);
    
    // If product is provided, add it to selectedProducts
    if (product) {
      this.selectedProducts[index] = product;
    }
    
    this.calculateTotal();
  }

  addEmptyItem(): void {
    const itemForm = this.createItemFormGroup();
    this.itemsFormArray.push(itemForm);
    
    const index = this.itemsFormArray.length - 1;
    this.setupProductAutocomplete(index);
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
    this.filteredProducts.splice(index, 1);
    this.selectedProducts.splice(index, 1);
    this.calculateTotal();
    
    // Update cart after removal
    this.updateCart();
  }

  setupProductAutocomplete(index: number): void {
    const itemForm = this.itemsFormArray.at(index) as FormGroup;
    const productNameControl = itemForm.get('productName');
    
    if (productNameControl) {
      this.filteredProducts[index] = productNameControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this.filterProducts(value || ''))
      );
    }
  }

  filterProducts(value: string): Product[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.products.filter(product => 
      product.name.toLowerCase().includes(filterValue) && product.isAvailable
    );
  }

  selectProduct(event: MatAutocompleteSelectedEvent, index: number): void {
    const selectedProductName = event.option.viewValue;
    const selectedProduct = this.products.find(p => p.name === selectedProductName);
    
    if (selectedProduct) {
      this.selectedProducts[index] = selectedProduct;
      
      const itemForm = this.itemsFormArray.at(index) as FormGroup;
      itemForm.patchValue({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        unitPrice: selectedProduct.price,
        imageUrl: selectedProduct.imageUrl,
        productDescription: selectedProduct.description,
        isProductSelected: true
      });
      
      // Disable the productName field after selection
      itemForm.get('productName')?.disable();
      
      this.calculateTotal();
      
      // Update cart after selection
      this.updateCart();
    }
  }

  calculateTotal(): void {
    let total = 0;
    
    for (let i = 0; i < this.itemsFormArray.length; i++) {
      const itemForm = this.itemsFormArray.at(i) as FormGroup;
      const quantity = itemForm.get('quantity')?.value || 0;
      const unitPrice = itemForm.get('unitPrice')?.value || 0;
      total += quantity * unitPrice;
    }
    
    this.orderForm.patchValue({ totalAmount: total });
  }

  updateQuantity(index: number): void {
    this.calculateTotal();
    this.updateCart();
  }
  
  updateCart(): void {
    // Create new cart items from the form
    const updatedCartItems: CartItem[] = [];
    
    for (let i = 0; i < this.itemsFormArray.length; i++) {
      const itemForm = this.itemsFormArray.at(i) as FormGroup;
      const productId = itemForm.get('productId')?.value;
      
      if (productId && this.selectedProducts[i]) {
        updatedCartItems.push({
          product: this.selectedProducts[i],
          quantity: itemForm.get('quantity')?.value || 1
        });
      }
    }
    
    // Update the cart service
    this.cartService.setCartItems(updatedCartItems);
  }

  onSubmit(): void {
    if (this.itemsFormArray.invalid) {
      console.log('Items FormArray Errors:', this.itemsFormArray.errors); // Log errors specific to the FormArray
    }

    if (this.orderForm.invalid) {
      const invalidControls: string[] = [];
      for (const name in this.orderForm.controls) {
        if (this.orderForm.controls[name].invalid) {
          const errors = this.orderForm.controls[name].errors;
          let errorDetails = '';
          if (errors) {
            errorDetails = `(${Object.keys(errors).join(', ')})`;
          }
          invalidControls.push(`${name} ${errorDetails}`);
        }
      }

      if (this.itemsFormArray.invalid) {
        for (let i = 0; i < this.itemsFormArray.controls.length; i++) {
          const itemGroup = this.itemsFormArray.controls[i] as FormGroup;
          for (const name in itemGroup.controls) {
            if (itemGroup.controls[name].invalid) {
              const errors = itemGroup.controls[name].errors;
              let errorDetails = '';
              if (errors) {
                errorDetails = `(${Object.keys(errors).join(', ')})`;
              }
              invalidControls.push(`Item ${i + 1}: ${name} ${errorDetails}`);
            }
          }
        }
      }

      const errorMessage = 'Please fix the following errors in the form: ' + invalidControls.join(', ');
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000
      });
      return;
    }
    
    this.submitted = true;
    this.loading = true;
    
    // Get form values including disabled controls
    const formValue = this.orderForm.getRawValue();

    const currentUser = this.authService.currentUserSubject.value;
    if (!currentUser?.id) {
      this.snackBar.open('User not authenticated', 'Close', { duration: 5000 });
      return;
    }
    // Prepare order data
    const updateOrderRequest = {
      userId: currentUser.id,
      status: OrderStatus.PENDING,
      totalAmount: formValue.totalAmount,
      deliveryAddress: formValue.deliveryAddress,
      deliveryPhone: formValue.deliveryPhone,
      orderItems: formValue.orderItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }))
    };
    
    console.log('Submitting order:', updateOrderRequest);
    
    // Create order
    this.orderService.createOrder(updateOrderRequest).subscribe({
      next: (order) => {
        this.loading = false;
        // Clear cart after successful order
        this.cartService.clearCart();
        
        // Show success message
        this.snackBar.open('Your order has been placed successfully!', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        
        // Navigate to orders page
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to place order. Please try again.';
        console.error('Order submission error:', err);
        
        this.snackBar.open('Failed to place order. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Helper method to check for form validation errors
  isFieldInvalid(field: string): boolean {
    const formControl = this.orderForm.get(field);
    return !!(formControl && formControl.invalid && (formControl.dirty || formControl.touched || this.submitted));
  }

  // Helper method to check for form array item validation errors
  isItemFieldInvalid(index: number, field: string): boolean {
    const formGroup = this.itemsFormArray.at(index) as FormGroup;
    const formControl = formGroup.get(field);
    return !!(formControl && formControl.invalid && (formControl.dirty || formControl.touched || this.submitted));
  }

  // Check if a product is selected for an item
  isProductSelected(index: number): boolean {
    const formGroup = this.itemsFormArray.at(index) as FormGroup;
    return formGroup.get('isProductSelected')?.value === true;
  }
} 