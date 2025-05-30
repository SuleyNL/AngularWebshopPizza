import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductManagementComponent } from './features/admin/product-management/product-management.component';
import { EditProductComponent } from './features/admin/product-management/edit-product/edit-product.component';
import { OrderManagementComponent } from './features/admin/order-management/order-management.component';
import { EditOrderComponent } from './features/admin/order-management/edit-order/edit-order.component';
import { UserManagementComponent } from './features/admin/user-management/user-management.component';
import { EditUserComponent } from './features/admin/user-management/edit-user/edit-user.component';
import { MessageManagementComponent } from './features/admin/message-management/message-management.component';
import { EditMessageComponent } from './features/admin/message-management/edit-message/edit-message.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
  { path: 'cart', loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [AuthGuard] },
  { path: 'orders', loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent), canActivate: [AuthGuard] },
  { path: 'orders/:id', loadComponent: () => import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent), canActivate: [AuthGuard] },
  { path: 'admin', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: 'admin/products', component: ProductManagementComponent },
  { path: 'admin/products/edit/:id', component: EditProductComponent },
  { path: 'admin/orders', component: OrderManagementComponent },
  { path: 'admin/orders/edit/:id', component: EditOrderComponent },
  { path: 'admin/users', component: UserManagementComponent },
  { path: 'admin/users/edit/:id', component: EditUserComponent },
  { path: 'admin/messages', component: MessageManagementComponent },
  { path: 'admin/messages/edit/:id', component: EditMessageComponent },
  
  // Error pages
  { path: 'error/:status', loadComponent: () => import('./shared/components/error-page/error-page.component').then(m => m.ErrorPageComponent) },
  { path: 'unauthorized', redirectTo: 'error/401', pathMatch: 'full' },
  { path: 'forbidden', redirectTo: 'error/403', pathMatch: 'full' },
  { path: 'server-error', redirectTo: 'error/500', pathMatch: 'full' },
  
  // 404 - Catch all route
  { path: '**', redirectTo: 'error/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 