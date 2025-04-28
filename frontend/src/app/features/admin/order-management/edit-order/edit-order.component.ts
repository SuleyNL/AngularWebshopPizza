import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateOrderRequest, Order, OrderStatus, UpdateOrderRequest } from '../../../../core/models/order.model';
import { OrderService } from '../../../../core/services/order.service';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { Observable, debounceTime, map, startWith, switchMap, catchError, of, forkJoin } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { UserService } from '../../../../core/services/user.service';
import { OrderItem } from '../../../../core/models/order-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss']
})
export class EditOrderComponent implements OnInit {
  orderForm: FormGroup;
  orderId: number;
  isNewOrder = false;
  loading = false;
  submitted = false;
  error = '';
  orderStatuses = Object.values(OrderStatus);
  products: Product[] = [];
  users: User[] = [];
  filteredProducts: Observable<Product[]>[] = [];
  filteredUsers: Observable<User[]> = of([]);
  selectedProducts: Product[] = [];
  orderStatusOptions = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  paymentStatusOptions = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.orderForm = this.createOrderForm();
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this.isNewOrder = this.orderId === 0;
  }

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getProducts().pipe(catchError(() => of([]))),
      users: this.userService.getAllUsers().pipe(catchError(() => of([]))),
      order: this.orderService.getOrderById(this.orderId).pipe(catchError(() => of(null)))
    }).subscribe(({ products, users, order }) => {
      this.products = products;
      this.users = users;
    
      if (order) {
        this.populateForm(order);
      } else {
        this.error = 'Failed to load order.';
      }
    
      this.loading = false;
    });

    // Setup user autocomplete
    this.setupUserAutocomplete();
  }

  createOrderForm(): FormGroup {
    return this.formBuilder.group({
      userId: ['', Validators.required],
      userName: ['', Validators.required],
      items: this.formBuilder.array([]),
      deliveryAddress: ['', Validators.required],
      deliveryPhone: ['', Validators.required],
      status: ['PENDING', Validators.required],
      totalAmount: [0, Validators.min(0)]
    });
  }

  get itemsFormArray(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  loadOrder(id: number): void {
    if (id!=0){
      this.loading = true;
      this.orderService.getOrderById(id).pipe(
        catchError(error => {
          this.error = 'Failed to load order. ' + error.message;
          this.loading = false;
          return of(null);
        })
      ).subscribe(order => {
        if (order) {
          
          this.populateForm(order);
          console.log('Products loaded?', this.products.length,  'Order Items:', order);
        }
        else{
          console.log('No Products loaded?');
        }
        this.loading = false;
      });
    }
  }

  loadProducts(): void {
    this.productService.getProducts().pipe(
      catchError(error => {
        this.error = 'Failed to load products. ' + error.message;
        return of([]);
      })
    ).subscribe(products => {
      this.products = products;
    });
  }

  loadUsers(): void {
    this.userService.getAllUsers().pipe(
      catchError(error => {
        this.error = 'Failed to load users. ' + error.message;
        return of([]);
      })
    ).subscribe(users => {
      this.users = users;
    });
  }

  setupUserAutocomplete(): void {
    const userNameControl = this.orderForm.get('userName');
    
    if (userNameControl) {
      this.filteredUsers = userNameControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => {
          const name = typeof value === 'string' ? value : '';
          return this.filterUsers(name);
        })
      );
    }
  }

  filterUsers(query: string): User[] {
    const filterValue = query.toLowerCase();
    return this.users.filter(user => 
      user.username.toLowerCase().includes(filterValue) || 
      (user.firstName && user.firstName.toLowerCase().includes(filterValue)) ||
      (user.lastName && user.lastName.toLowerCase().includes(filterValue))
    );
  }

  displayUserFn(user: User): string {
    return user ? `${user.firstName} ${user.lastName} (${user.username})` : '';
  }

  selectUser(event: MatAutocompleteSelectedEvent): void {
    const selectedUser = event.option.value as User;
    
    if (!selectedUser || !selectedUser.id) {
      console.error('Invalid user selected:', selectedUser);
      this.snackBar.open('Error selecting user. Please try again.', 'Close', {
        duration: 3000
      });
      return;
    }
    
    console.log('Selected user:', selectedUser);
    
    // Add fallbacks for null or undefined values
    this.orderForm.patchValue({
      userId: selectedUser.id,
      userName: selectedUser,
      deliveryAddress: selectedUser.address || '',
      deliveryPhone: selectedUser.phone || ''
    });
  }

  populateForm(order: Order): void {
    // Clear existing form arrays
    while (this.itemsFormArray.length !== 0) {
      this.itemsFormArray.removeAt(0);
    }
    
    // Find the user to get their name
    const user = this.users.find(u => u.id === order.user.id);
    
    // Populate order data
    this.orderForm.patchValue({
      id: order.id,
      userId: order.user.id,
      userName: user,
      deliveryAddress: order.deliveryAddress,
      deliveryPhone: order.deliveryPhone,
      status: order.status,
      totalAmount: order.totalAmount
    });
    
    // Populate order items - handle both 'items' and 'orderItems' for compatibility
    console.log('populate order with orderItems: ', order.orderItems);
    
    // Get the order items from orderItems property
    const orderItems = order.orderItems;
    
    if (orderItems && Array.isArray(orderItems)) {
      orderItems.forEach(item => {
        this.addEmptyItem(item);
      });
    }
    console.log('populated order with orderItems: ', this.orderForm);

  }

  addEmptyItem(item?: OrderItem): void {
    const itemForm = this.formBuilder.group({
      productId: [item ? (item.productId || item.product?.id) : '', Validators.required],
      productName: [item && item.product ? item.product.name : '', Validators.required],
      quantity: [item ? item.quantity : 1, [Validators.required, Validators.min(1)]],
      unitPrice: [item ? item.unitPrice : 0, [Validators.required, Validators.min(0.01)]],
      totalPrice: [item ? item.totalPrice : 0],
      imageUrl: [item && item.product ? item.product.imageUrl : ''],
      productDescription: [item && item.product ? item.product.description : '']
    });
    
    const index = this.itemsFormArray.length;
    this.itemsFormArray.push(itemForm);
    
    // Set up product filtering for this item
    this.setupProductFiltering(index);
    
    // If we have a product, find and select it
    if (item && item.productId) {
      const product = this.products.find(p => p.id === item.productId);
      if (product) {
        this.selectedProducts[index] = product;
      }
    }
  }

  setupProductFiltering(index: number): void {
    const productNameControl = this.itemsFormArray.at(index).get('productName');
    if (productNameControl) {
      this.filteredProducts[index] = productNameControl.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => {
          const name = typeof value === 'string' ? value : '';
          return this.filterProducts(name);
        })
      );
    }
  }

  filterProducts(query: string): Product[] {
    const filterValue = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(filterValue)
    );
  }

  selectProduct(event: MatAutocompleteSelectedEvent, index: number): void {
    const productName = event.option.value;
    const product = this.products.find(p => p.name === productName);
    
    if (product) {
      this.selectedProducts[index] = product;
      console.log('Selected product:', product);
      const itemGroup = this.itemsFormArray.at(index) as FormGroup;
      itemGroup.patchValue({
        productId: product.id,
        unitPrice: product.price,
        imageUrl: product.imageUrl,
        productDescription: product.description
      });
      
      this.updateQuantity();
    }
  }

  removeItem(index: number): void {
    this.itemsFormArray.removeAt(index);
    this.selectedProducts.splice(index, 1);
    this.filteredProducts.splice(index, 1);
    this.updateQuantity();
  }

  updateQuantity(): void {
    let total = 0;
    
    for (let i = 0; i < this.itemsFormArray.length; i++) {
      const item = this.itemsFormArray.at(i);
      const quantity = item.get('quantity')?.value || 0;
      const unitPrice = item.get('unitPrice')?.value || 0;
      const totalPrice = quantity * unitPrice;
      
      item.get('totalPrice')?.setValue(totalPrice);
      total += totalPrice;
    }
    
    this.orderForm.get('totalAmount')?.setValue(total);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched || this.submitted);
  }

  isItemFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.itemsFormArray.at(index).get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched || this.submitted);
  }

  onSubmit(): void {
    console.log('Order Form Validity:', this.orderForm.valid);
    console.log('Items FormArray Validity:', this.itemsFormArray.valid);
    console.log('Number of items in FormArray:', this.itemsFormArray.length);
    console.log('FormArray:', this.itemsFormArray);


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

    // Check if user is authenticated
    if (!this.authService.getToken()) {
      this.snackBar.open('You must be logged in to perform this action. Please log in and try again.', 'Close', {
        duration: 5000
      });
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // Check if user has admin role for admin operations
    if (!this.authService.isAdmin()) {
      this.snackBar.open('You do not have permission to perform this action. Administrator access is required.', 'Close', {
        duration: 5000
      });
      return;
    }

    this.submitted = true;
    this.loading = true;
    this.error = ''; // Clear previous errors
    
    // Log authentication info for debugging
    console.log('Auth token available:', !!this.authService.getToken());
    console.log('Current user role:', this.authService.isAdmin() ? 'ADMIN' : 'USER');
    
    const formValue = this.orderForm.value;    

    const updateOrderRequest: UpdateOrderRequest = {
      userId: formValue.userId,
      orderItems: formValue.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice
      })),
      totalAmount: formValue.totalAmount,
      status: formValue.status,
      deliveryAddress: formValue.deliveryAddress,
      deliveryPhone: formValue.deliveryPhone,
    };

    const saveObservable = this.isNewOrder 
      ? this.orderService.createOrder(updateOrderRequest)
      : this.orderService.updateOrder(this.orderId, updateOrderRequest);

    saveObservable.pipe(
      catchError(error => {
        console.error(`Failed to ${this.isNewOrder ? 'create' : 'update'} order:`, error);
        
        // Show more detailed error message
        this.error = typeof error === 'string' 
          ? error 
          : `Failed to ${this.isNewOrder ? 'create' : 'update'} order. ${error.message || ''}`;
        
        this.snackBar.open(this.error, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        
        this.loading = false;
        return of(null);
      })
    ).subscribe(result => {
      if (result) {
        this.snackBar.open(`Order ${this.isNewOrder ? 'created' : 'updated'} successfully`, 'Close', {
          duration: 3000
        });
        this.router.navigate(['/admin/orders']);
      }
      this.loading = false;
    });
  }

  parseAddressString(addressString: string): { address: string; city: string; postalCode: string; country: string; } {
    // Simple parsing of address string - in a real app, you'd want more robust parsing
    const parts = addressString.split(',').map(part => part.trim());
    
    return {
      address: parts[0] || '',
      city: parts[1] || '',
      postalCode: parts[2] || '',
      country: parts[3] || ''
    };
  }

  onCancel(): void {
    this.router.navigate(['/admin/orders']);
  }
}
