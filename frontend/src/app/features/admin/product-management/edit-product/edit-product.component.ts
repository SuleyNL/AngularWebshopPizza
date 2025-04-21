import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId: number;
  isNewProduct = false;
  loading = false;
  submitted = false;
  error = '';
  categories = ['PIZZA', 'PASTA', 'BEVERAGE', 'DESSERT', 'SIDE'];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    this.productForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      imageUrl: [''],
      category: ['PIZZA', Validators.required],
      isAvailable: [true]
    });
    
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.isNewProduct = this.productId === 0;
  }

  ngOnInit(): void {
    if (!this.isNewProduct) {
      this.loadProduct();
    }
  }

  loadProduct(): void {
    this.loading = true;
    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details. Please try again.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.productForm.invalid) {
      return;
    }
    
    this.loading = true;
    const product: Product = this.productForm.value;
    
    if (this.isNewProduct) {
      this.productService.createProduct(product).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.error = 'Failed to create product. Please try again.';
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.productService.updateProduct(this.productId, product).subscribe({
        next: () => {
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.error = 'Failed to update product. Please try again.';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  // Helper method to check for form validation errors
  get f() { return this.productForm.controls; }
  
  // Helper method to determine if a field is invalid and touched/submitted
  isFieldInvalid(field: string): boolean {
    const formControl = this.productForm.get(field);
    return !!(formControl && formControl.invalid && (formControl.dirty || formControl.touched || this.submitted));
  }
  
  // Cancel editing and return to product list
  cancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
