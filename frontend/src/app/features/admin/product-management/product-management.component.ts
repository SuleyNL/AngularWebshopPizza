import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products. Please try again.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  editProduct(id: number | undefined): void {
    if (typeof id === 'number') {
      this.router.navigate(['/admin/products/edit', id]);
    } else {
      this.error = 'Cannot edit product without a valid ID.';
    }
  }

  createProduct(): void {
    // For a new product, navigate to edit page with id 0
    this.router.navigate(['/admin/products/edit', 0]);
  }

  deleteProduct(id: number | undefined): void {
    if (typeof id !== 'number') {
      this.error = 'Cannot delete product without a valid ID.';
      return;
    }
    
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete product. Please try again.';
          console.error(err);
        }
      });
    }
  }
}
