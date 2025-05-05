# Pizza Deliziosa Frontend

This is the frontend application for Pizza Deliziosa, built with Angular. This document provides a detailed technical explanation of the frontend architecture, components, services, and functionality with specific code references.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Core Module](#core-module)
  - [Models](#models)
  - [Services](#services)
  - [Interceptors](#interceptors)
  - [Guards](#guards)
- [Feature Modules](#feature-modules)
- [Shared Module](#shared-module)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Routing Configuration](#routing-configuration)
- [NGINX Configuration](#nginx-configuration)
- [Development and Deployment](#development-and-deployment)

## Architecture Overview

The Pizza Deliziosa frontend is built using [Angular](https://angular.io/) (version 14+), following a modular architecture pattern. It communicates with the Spring Boot backend via RESTful API calls using Angular's [`HttpClient`](https://angular.io/guide/http). The architecture is organized into the following modules:

1. **Core Module** (`src/app/core/`): Contains application-wide singleton services, models, and utilities
2. **Feature Modules** (`src/app/features/`): Contains specific functionality areas like products, cart, checkout, etc.
3. **Shared Module** (`src/app/shared/`): Contains reusable components, directives, and pipes

This architecture follows the [Angular Style Guide](https://angular.io/guide/styleguide) recommendations for scalable applications, promoting code reusability and maintainability. The application follows the principle of "separation of concerns," with each component and service having a single responsibility.

### Key Technologies

- **Angular**: Framework for building client applications
- **TypeScript**: Typed superset of JavaScript
- **RxJS**: Library for reactive programming with observables
- **Angular Material**: UI component library
- **SCSS**: Preprocessor for CSS styling
- **Angular Router**: Client-side navigation

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/            # Core functionality
│   │   │   ├── guards/      # Route guards
│   │   │   ├── interceptors/ # HTTP interceptors
│   │   │   ├── models/      # Data models
│   │   │   └── services/    # Application services
│   │   ├── features/        # Feature modules
│   │   │   ├── about/       # About page
│   │   │   ├── admin/       # Admin dashboard
│   │   │   ├── auth/        # Authentication
│   │   │   ├── cart/        # Shopping cart
│   │   │   ├── checkout/    # Checkout process
│   │   │   ├── contact/     # Contact page
│   │   │   ├── home/        # Home page
│   │   │   └── orders/      # Order management
│   │   ├── shared/          # Shared components
│   │   ├── app.component.*  # Root component
│   │   ├── app.module.ts    # Root module
│   │   └── app-routing.module.ts # Main routing
│   ├── assets/              # Static assets
│   ├── environments/        # Environment configuration
│   ├── styles/              # Global styles
│   ├── index.html           # Main HTML file
│   ├── main.ts              # Application entry point
│   └── styles.scss          # Global styles
├── angular.json             # Angular configuration
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
└── nginx.conf               # NGINX configuration
```

The application entry point is [`main.ts`](src/main.ts), which bootstraps the Angular application:

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

The root module [`app.module.ts`](src/app/app.module.ts) imports all the necessary modules and configures the application.

## Core Module

The Core module ([`core.module.ts`](src/app/core/core.module.ts)) contains application-wide singleton services and components that are loaded once when the application starts. It follows the [module pattern recommended by Angular](https://angular.io/guide/ngmodules).

### Models

The data models define the structure of the objects used throughout the application. These TypeScript interfaces or classes ensure type safety. Key models in `src/app/core/models/` include:

- **[`user.model.ts`](src/app/core/models/user.model.ts)**: Represents user information
  ```typescript
  export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
  
  export interface AuthRequest {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    id: number;
    username: string;
    role: string;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
  }
  ```

- **[`product.model.ts`](src/app/core/models/product.model.ts)**: Represents pizza and other products
  ```typescript
  export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    isAvailable: boolean;
  }
  ```

- **[`order.model.ts`](src/app/core/models/order.model.ts)**: Represents customer orders
- **[`order-item.model.ts`](src/app/core/models/order-item.model.ts)**: Represents items within an order
- **[`message.model.ts`](src/app/core/models/message.model.ts)**: Represents customer support messages

### Services

Services handle data operations and business logic and are decorated with `@Injectable()`. They are responsible for making HTTP requests to the backend API and managing state. Key services in `src/app/core/services/` include:

- **[`auth.service.ts`](src/app/core/services/auth.service.ts)**: Manages authentication
  ```typescript
  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    private readonly API_URL = `${environment.apiUrl}/api/auth`;
    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'current_user';
    
    public currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();
    
    // Authentication methods
    login(credentials: AuthRequest): Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
        .pipe(
          tap(response => {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            // Store user data
            const user: User = {
              id: response.id,
              username: response.username,
              role: response.role,
              email: '',
              firstName: '',
              lastName: ''
            };
            localStorage.setItem(this.USER_KEY, JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          }),
          catchError(this.handleError)
        );
    }
    
    // Other authentication methods...
  }
  ```

- **[`product.service.ts`](src/app/core/services/product.service.ts)**: Retrieves and manages product data
  ```typescript
  @Injectable({
    providedIn: 'root'
  })
  export class ProductService {
    private readonly API_URL = `${environment.apiUrl}/api/products`;
    
    constructor(private http: HttpClient) { }
    
    getAllProducts(): Observable<Product[]> {
      return this.http.get<Product[]>(this.API_URL)
        .pipe(catchError(this.handleError));
    }
    
    // Other product methods...
  }
  ```

- **[`cart.service.ts`](src/app/core/services/cart.service.ts)**: Manages the shopping cart functionality
- **[`order.service.ts`](src/app/core/services/order.service.ts)**: Handles order creation and management
- **[`user.service.ts`](src/app/core/services/user.service.ts)**: Manages user profile information
- **[`message.service.ts`](src/app/core/services/message.service.ts)**: Handles customer support messaging
- **[`error-handler.service.ts`](src/app/core/services/error-handler.service.ts)**: Centralized error handling

### Interceptors

HTTP interceptors modify requests and responses as part of the [HttpClient pipeline](https://angular.io/guide/http#intercepting-requests-and-responses). Key interceptors in `src/app/core/interceptors/` include:

- **[`jwt.interceptor.ts`](src/app/core/interceptors/jwt.interceptor.ts)**: Adds the JWT authentication token to outgoing requests
  ```typescript
  @Injectable()
  export class JwtInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}
    
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      const token = this.authService.getToken();
      
      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      return next.handle(request);
    }
  }
  ```

- **[`error.interceptor.ts`](src/app/core/interceptors/error.interceptor.ts)**: Handles HTTP errors and provides consistent error handling
  ```typescript
  @Injectable()
  export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) {}
    
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            // Handle unauthorized error
            this.router.navigate(['/login']);
          }
          
          // Handle other errors
          const errorMessage = error.error?.message || error.statusText;
          return throwError(() => errorMessage);
        })
      );
    }
  }
  ```

These interceptors are registered in the `app.module.ts` using the `HTTP_INTERCEPTORS` provider:

```typescript
@NgModule({
  // Other module configuration...
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ]
})
export class AppModule { }
```

### Guards

Route guards protect routes based on authentication and authorization. They implement the [`CanActivate`](https://angular.io/api/router/CanActivate) interface. Key guards in `src/app/core/guards/` include:

- **[`auth.guard.ts`](src/app/core/guards/auth.guard.ts)**: Prevents unauthenticated users from accessing protected routes
  ```typescript
  @Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (this.authService.getToken()) {
        return true;
      }
      
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
  ```

- **[`admin.guard.ts`](src/app/core/guards/admin.guard.ts)**: Restricts access to admin-only routes
  ```typescript
  @Injectable({
    providedIn: 'root'
  })
  export class AdminGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
    
    canActivate(): boolean {
      if (this.authService.isAdmin()) {
        return true;
      }
      
      this.router.navigate(['/']);
      return false;
    }
  }
  ```

## Feature Modules

Feature modules encapsulate specific functionality areas of the application and promote [lazy loading](https://angular.io/guide/lazy-loading-ngmodules). Each feature module has its own routing, components, and sometimes its own services. Key feature modules in `src/app/features/` include:

- **Home** (`features/home/`): Landing page displaying featured products
- **Auth** (`features/auth/`): Login and registration functionality
  - [`login.component.ts`](src/app/features/auth/login/login.component.ts): Handles user login
    ```typescript
    @Component({
      selector: 'app-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.scss']
    })
    export class LoginComponent implements OnInit {
      loginForm: FormGroup;
      
      constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
      ) {
        this.loginForm = this.fb.group({
          username: ['', [Validators.required]],
          password: ['', [Validators.required, Validators.minLength(6)]]
        });
      }
      
      onSubmit(): void {
        if (this.loginForm.invalid) {
          return;
        }
        
        this.authService.login(this.loginForm.value).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.snackBar.open(error, 'Close', {
              duration: 5000
            });
          }
        });
      }
    }
    ```
  - [`register.component.ts`](src/app/features/auth/register/register.component.ts): Handles user registration

- **Cart** (`features/cart/`): Shopping cart management
- **Checkout** (`features/checkout/`): Order placement and payment processing
- **Orders** (`features/orders/`): Order history and tracking
- **Admin** (`features/admin/`): Administrative dashboard for managing products, orders, and users
- **About** (`features/about/`): Information about the pizza restaurant
- **Contact** (`features/contact/`): Customer support contact form

## Shared Module

The Shared module ([`shared.module.ts`](src/app/shared/shared.module.ts)) contains reusable components, directives, and pipes that are imported by many feature modules. This promotes code reusability and consistency across the application.

Components in `src/app/shared/` include:

- **Button Components**: Standardized buttons with different styles
- **Card Components**: Product and order display cards
- **Loading Indicator**: Displays during async operations
- **Alert Components**: Success and error notifications
- **Form Components**: Reusable form controls and validators

The shared module is designed to be imported by many feature modules:

```typescript
@NgModule({
  declarations: [
    // Components, directives, and pipes
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Other shared modules
  ],
  exports: [
    // Components, directives, and pipes to be used in other modules
    CommonModule,
    ReactiveFormsModule,
    // Other shared modules
  ]
})
export class SharedModule { }
```

## State Management

The application implements [Redux-like state management](https://blog.angular-university.io/angular-2-redux-ngrx-rxjs/) using RxJS observables without introducing complex third-party libraries like NgRx. This approach is suitable for medium-sized applications like Pizza Deliziosa.

### State Management Approaches

1. **Services with BehaviorSubjects**: Each service maintains its own state
   ```typescript
   // Example from AuthService
   public currentUserSubject = new BehaviorSubject<User | null>(null);
   currentUser$ = this.currentUserSubject.asObservable();
   
   private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
   isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
   ```

2. **LocalStorage**: For persistent state between browser sessions
   ```typescript
   // Saving to localStorage
   localStorage.setItem(this.TOKEN_KEY, response.token);
   localStorage.setItem(this.USER_KEY, JSON.stringify(user));
   
   // Reading from localStorage
   const token = localStorage.getItem(this.TOKEN_KEY);
   const user = localStorage.getItem(this.USER_KEY);
   ```

3. **URL Parameters**: For sharing state through routes
   ```typescript
   // Passing parameters in routes
   this.router.navigate(['/products'], { queryParams: { category: 'pizza' } });
   
   // Reading parameters in components
   this.route.queryParams.subscribe(params => {
     this.category = params['category'];
   });
   ```

### Key State Management Implementations

- **Authentication State** ([`auth.service.ts`](src/app/core/services/auth.service.ts)): Manages user authentication state
- **Cart State** ([`cart.service.ts`](src/app/core/services/cart.service.ts)): Manages shopping cart items
  ```typescript
  export class CartService {
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    cartItems$ = this.cartItemsSubject.asObservable();
    
    private cartTotalSubject = new BehaviorSubject<number>(0);
    cartTotal$ = this.cartTotalSubject.asObservable();
    
    // Methods to add, remove, and update cart items
    addToCart(product: Product, quantity: number = 1): void {
      const currentCart = this.cartItemsSubject.value;
      // Update cart logic
      this.cartItemsSubject.next(updatedCart);
      this.updateCartTotal();
    }
    
    // Other cart methods...
  }
  ```
- **Order State** ([`order.service.ts`](src/app/core/services/order.service.ts)): Manages order tracking

## Authentication Flow

The authentication system is implemented across multiple files with a detailed flow:

1. **User submits login credentials** ([`login.component.ts`](src/app/features/auth/login/login.component.ts))
   ```typescript
   onSubmit(): void {
     if (this.loginForm.invalid) {
       return;
     }
     
     this.authService.login(this.loginForm.value).subscribe({
       next: () => {
         this.router.navigate(['/']);
       },
       error: (error) => {
         // Handle error
       }
     });
   }
   ```

2. **AuthService sends credentials to backend** ([`auth.service.ts`](src/app/core/services/auth.service.ts))
   ```typescript
   login(credentials: AuthRequest): Observable<AuthResponse> {
     return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials)
       .pipe(
         tap(response => {
           localStorage.setItem(this.TOKEN_KEY, response.token);
           // Store user data and update state
         }),
         catchError(this.handleError)
       );
   }
   ```

3. **Backend validates credentials and returns JWT token** (via `AuthController.java`)
   - Angular receives the response with JWT token
   
4. **Frontend stores the JWT token in localStorage** ([`auth.service.ts`](src/app/core/services/auth.service.ts))
   ```typescript
   // In the tap operator of the login method
   localStorage.setItem(this.TOKEN_KEY, response.token);
   ```

5. **JwtInterceptor attaches token to requests** ([`jwt.interceptor.ts`](src/app/core/interceptors/jwt.interceptor.ts))
   ```typescript
   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
     const token = this.authService.getToken();
     
     if (token) {
       request = request.clone({
         setHeaders: {
           Authorization: `Bearer ${token}`
         }
       });
     }
     
     return next.handle(request);
   }
   ```

6. **AuthGuard protects restricted routes** ([`auth.guard.ts`](src/app/core/guards/auth.guard.ts))
   ```typescript
   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
     if (this.authService.getToken()) {
       return true;
     }
     
     this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
     return false;
   }
   ```

For a deeper understanding of Angular authentication, see:
- [Angular Authentication Guide](https://angular.io/guide/http#security-interceptors)
- [JWT Authentication with Angular](https://bezkoder.com/angular-jwt-authentication/)

## Routing Configuration

The application uses [Angular Router](https://angular.io/guide/router) for navigation, defined in [`app-routing.module.ts`](src/app/app-routing.module.ts) with a hierarchical structure:

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { 
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'orders',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

The routing configuration includes:

- **Route Guards**: `AuthGuard` and `AdminGuard` protect routes that require authentication or admin privileges
- **Lazy Loading**: Admin module is loaded lazily for improved performance
- **Route Parameters**: Used in routes like `products/:id` for displaying specific products
- **Wildcard Route**: Catches invalid URLs and redirects to a 404 page

For navigation in components, the Router service is used:

```typescript
// Navigate programmatically
this.router.navigate(['/orders']);

// Navigate with parameters
this.router.navigate(['/products', productId]);

// Navigate with query parameters
this.router.navigate(['/products'], { queryParams: { category: 'pizza' } });
```

## NGINX Configuration

The frontend is served using [NGINX](https://nginx.org/), a high-performance web server. The configuration is defined in [`nginx.conf`](nginx.conf):

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    # API requests proxy to backend
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # All other routes serve Angular application
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

NGINX provides several critical functions:

1. **Static File Serving**: Efficiently serves the compiled Angular application files
2. **Reverse Proxy**: Forwards API requests (`/api/*`) to the Spring Boot backend service
3. **HTTPS Termination**: In production, handles SSL/TLS connections
4. **Compression**: Reduces bandwidth usage with gzip compression
5. **Cache Control**: Improves performance with proper caching headers

The key part of the configuration is the catch-all location block that redirects all routes to `index.html`, enabling Angular's client-side routing.

For more information on NGINX, see:
- [NGINX Documentation](https://nginx.org/en/docs/)
- [Deploying Angular with NGINX](https://angular.io/guide/deployment#server-configuration)

## Development and Deployment

### Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   ng serve
   ```

3. Access the application at http://localhost:4200

During development, the application uses [Angular's proxy configuration](https://angular.io/guide/build#proxying-to-a-backend-server) to forward API requests to the backend:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

### Building for Production

1. Create a production build:
   ```
   ng build --prod
   ```

2. The compiled application will be in the `dist/` directory

The production build process:
- Compiles TypeScript to JavaScript
- Bundles and minifies files
- Applies AOT (Ahead-of-Time) compilation
- Generates hashed file names for cache busting
- Optimizes assets

### Deployment with Docker

The frontend includes a Dockerfile for containerized deployment:

```dockerfile
# Build stage
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

To deploy:

1. Build the Docker image:
   ```
   docker build -t pizza-frontend .
   ```

2. Run the container:
   ```
   docker run -p 80:80 pizza-frontend
   ```

3. The application will be available at http://localhost

### Railway Deployment

For deployment on Railway, refer to the `RAILWAY_CONFIG.md` file for specific configuration instructions.

### Further Reading

For a deeper understanding of Angular development:
- [Angular Documentation](https://angular.io/docs)
- [Angular CLI](https://angular.io/cli)
- [RxJS Documentation](https://rxjs.dev/guide/overview)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) 