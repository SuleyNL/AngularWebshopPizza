# Pizza Webshop - Comprehensive Master Plan

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Architecture](#project-architecture)
    - [Directory Structure](#directory-structure)
    - [Backend Architecture](#backend-architecture)
    - [Frontend Architecture](#frontend-architecture)
    - [Database Design](#database-design)
4. [Development Roadmap](#development-roadmap)
    - [Phase 1: Core Product Experience](#phase-1-core-product-experience)
    - [Phase 2: Guest Checkout Flow](#phase-2-guest-checkout-flow)
    - [Phase 3: User Authentication](#phase-3-user-authentication)
    - [Phase 4: Admin Functionality](#phase-4-admin-functionality)
    - [Phase 5: Refinement and Optimization](#phase-5-refinement-and-optimization)
    - [Deployment Preparation](#deployment-preparation)
5. [Detailed Implementation Plan](#detailed-implementation-plan)
    - [Database Schema](#database-schema)
    - [Backend API Endpoints](#backend-api-endpoints)
    - [Frontend Components](#frontend-components)
    - [Integration Points](#integration-points)
6. [Development Process](#development-process)
    - [Development Workflow](#development-workflow)
    - [Implementation Strategy](#implementation-strategy)
    - [Useful Commands](#useful-commands)
7. [Progress Tracking](#progress-tracking)
8. [Development Notes](#development-notes)
    - [Challenges Encountered](#challenges-encountered)
    - [Lessons Learned](#lessons-learned)
9. [Testing Strategy](#testing-strategy)
10. [Deployment Guide](#deployment-guide)

## Project Overview

The Pizza Webshop is an e-commerce application for ordering pizzas online. The application will be built using Angular for the frontend and Spring Boot for the backend, with PostgreSQL as the database. The application will follow the MVP approach, focusing on core functionality while maintaining elegance and simplicity.

### Core Features

1. User authentication and authorization (customer and admin roles)
2. Product catalog with at least 10 different pizza/food items
3. Shopping cart functionality
4. Order processing
5. Admin portal for management (users, products, orders, promocodes)
6. Promocode application for discounts

## Technology Stack

### Frontend
- Angular 17+
- Angular Material
- NgRx for state management
- RxJS for reactive programming
- SCSS for styling
- Google Fonts (Playfair Display and Roboto)

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- JWT for authentication

### Database
- PostgreSQL

### Development Tools
- Git for version control
- Maven for backend build
- npm for frontend package management
- Angular CLI for Angular development
- VSCode/IntelliJ IDEA (recommended IDEs)

## Project Architecture

The Pizza Webshop is built using a modern full-stack architecture designed for maintainability, scalability, and clear separation of concerns.

### Directory Structure

```
AngularWebshopPizza/
├── docs/                          # Project documentation
│   ├── feature-plans/             # Detailed plans for each feature bundle
│   ├── progress/                  # Progress tracking
│   └── documentation/             # Technical documentation
├── frontend/                      # Angular frontend application
└── backend/                       # Spring Boot backend application
```

### Backend Architecture

The backend follows a standard Spring Boot architecture with a layered design:

#### Core Components

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Handle data access and persistence
- **Models/Entities**: Data models that map to database tables
- **DTOs**: Data Transfer Objects for request/response payloads
- **Security**: JWT-based authentication and authorization

#### Package Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/pizza/
│   │   │   ├── config/              # Configuration classes
│   │   │   ├── controller/          # REST controllers
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── exception/           # Custom exceptions and handlers
│   │   │   ├── model/               # Entity models
│   │   │   ├── repository/          # Data repositories
│   │   │   ├── security/            # Security configurations
│   │   │   ├── service/             # Business logic services
│   │   │   └── util/                # Utility classes
│   │   └── resources/
│   │       ├── application.properties  # Application configuration
│   │       └── data.sql                # Database seeding
```

### Frontend Architecture

The frontend follows a modular Angular architecture with a focus on component reusability:

#### Core Components

- **Modules**: Feature modules for code organization
- **Components**: UI components with specific responsibilities
- **Services**: Data and state management
- **Models**: TypeScript interfaces for data structures
- **Guards**: Route protection based on authentication and roles
- **Interceptors**: HTTP request/response manipulation

#### Package Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                   # Core functionality (services, guards, etc.)
│   │   ├── shared/                 # Shared components and utilities
│   │   ├── features/               # Feature modules
│   │   └── app-routing.module.ts   # Main routing configuration
│   ├── assets/                     # Static assets (images, fonts, etc.)
│   ├── environments/               # Environment configurations
│   └── styles/                     # Global styles
```

#### Key Angular Features to Use

1. **Lazy Loading**: For faster initial load times
2. **Reactive Forms**: For form handling with validation
3. **Angular Material**: For UI components
4. **NgRx**: For state management (cart, auth status)

### Database Design

The database design follows a relational model with the following key entities:

- **Users**: Customer and admin user accounts
- **Products**: Pizza and other food items
- **Cart/Cart Items**: Shopping cart functionality
- **Orders/Order Items**: Order processing
- **Promocodes**: Discount codes for orders

#### Authentication Flow

The application uses JWT (JSON Web Token) based authentication:

1. User logs in with credentials
2. Backend validates credentials and generates a JWT
3. JWT is returned to the frontend and stored
4. JWT is sent with each subsequent request via HTTP headers
5. Backend validates the JWT for each protected request
6. Access is granted or denied based on user role and permissions

## Development Roadmap

This roadmap outlines the implementation sequence for the Pizza Webshop application, broken down into small, testable features. Each feature should be fully implemented and tested before moving to the next one.

### Phase 1: Core Product Experience

#### Feature 1: Basic Application Structure and Homepage
- Set up backend structure with Spring Boot
- Set up frontend structure with Angular
- Create basic homepage with header, footer, and navigation
- Implement responsive design basics with Italian-themed color scheme (red, white, green)
- Select fonts that convey an authentic Italian restaurant feel (Playfair Display for headings, Roboto for body text)
- Implement a hero section with a pizza background image
- **Testing**: Supervisor can view the homepage with Italian pizza shop styling

#### Feature 2: Product Catalog Viewing
- Implement backend models and database for products
- Create seed data with at least 10 pizza/food items
- Implement API endpoints to retrieve products
- Create frontend product listing page
- Create frontend product detail page
- **Testing**: Supervisor can browse the product catalog and view product details as a non-logged-in user

#### Feature 3: Basic Shopping Cart
- Implement client-side cart functionality
- Create "Add to Cart" functionality on product cards and detail pages
- Implement cart view page with item listing
- Add ability to update quantities in cart
- Add ability to remove items from cart
- **Testing**: Supervisor can add products to cart, update quantities, and remove items without being logged in

### Phase 2: Guest Checkout Flow

#### Feature 4: Guest Checkout
- Create checkout page with order summary
- Implement delivery information form
- Add order placement functionality for guest users
- Create order confirmation page
- **Testing**: Supervisor can place an order without being logged in by providing delivery details

#### Feature 5: Basic Promocode Functionality
- Create promocode database model and seed data
- Implement backend validation for promocodes
- Add promocode input field to checkout
- Implement frontend validation and application of discounts
- **Testing**: Supervisor can apply a valid promocode during checkout to receive a discount

### Phase 3: User Authentication

#### Feature 6: User Registration and Login
- Implement user registration backend
- Create user registration form
- Implement login functionality with JWT
- Create login form
- Add logout functionality
- **Testing**: Supervisor can register a new account and log in/out

#### Feature 7: User Profile and Order History
- Create user profile page
- Implement edit profile functionality
- Create order history page
- Implement order detail view
- **Testing**: Supervisor can view and edit their profile, and see their order history

#### Feature 8: Registered User Checkout
- Connect cart to user account when logged in
- Autofill delivery information from user profile
- Save new addresses to user profile
- **Testing**: Supervisor can place an order with pre-filled delivery information when logged in

### Phase 4: Admin Functionality

#### Feature 9: Admin Authentication
- Implement admin role and authorization
- Create admin login functionality
- Implement route protection for admin pages
- **Testing**: Supervisor can log in as an admin

#### Feature 10: Admin Dashboard - Overview
- Create admin dashboard layout
- Implement basic statistics (total orders, revenue, etc.)
- **Testing**: Supervisor can view the admin dashboard with statistics

#### Feature 11: Admin Dashboard - User Management
- Implement user listing functionality
- Add user details view
- Create user deletion functionality
- **Testing**: Supervisor can view all users, see user details, and delete users

#### Feature 12: Admin Dashboard - Product Management
- Implement product listing for admin
- Create product add/edit form
- Implement product deletion
- Add product availability toggling
- **Testing**: Supervisor can add, edit, and delete products

#### Feature 13: Admin Dashboard - Order Management
- Implement order listing for admin
- Create order details view
- Add order status update functionality
- **Testing**: Supervisor can view all orders, see order details, and update order status

#### Feature 14: Admin Dashboard - Promocode Management
- Implement promocode listing
- Create promocode add/edit form
- Implement promocode activation/deactivation
- Add promocode deletion
- **Testing**: Supervisor can create, edit, activate/deactivate, and delete promocodes

### Phase 5: Refinement and Optimization

#### Feature 15: Enhanced User Experience
- Implement toast notifications
- Add loading indicators
- Improve form validations
- Enhance responsive design
- **Testing**: Supervisor can see improved UX elements across the application

#### Feature 16: Cart Persistence
- Implement persistent cart for non-logged-in users
- Merge anonymous cart with user cart on login
- **Testing**: Supervisor can add items to cart, log in, and see the items are still there

#### Feature 17: Polish and Final Touches
- Refine styling and theme consistency
- Optimize performance
- Add final UI polish
- **Testing**: Supervisor can observe the polished application with consistent styling and good performance

### Deployment Preparation

#### Feature 18: Deployment Configuration
- Configure production builds
- Setup environment variables
- Create deployment documentation
- **Testing**: Supervisor can review the deployment configuration

## Detailed Implementation Plan

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    role VARCHAR(10) NOT NULL DEFAULT 'CUSTOMER',  -- CUSTOMER or ADMIN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category VARCHAR(50) NOT NULL,  -- e.g., 'PIZZA', 'PASTA', 'BEVERAGE', etc.
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Promocodes Table
CREATE TABLE promocodes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    discount_percentage DECIMAL(5, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',  -- PENDING, CONFIRMED, DELIVERED, CANCELLED
    promocode_id INTEGER REFERENCES promocodes(id),
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    delivery_address TEXT,
    delivery_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table (for items in each order)
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Table (for active shopping carts)
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items Table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES cart(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Database Seeding Strategy

We'll create a database seeder that will populate the database with:

1. Default admin user
2. At least 10 different pizza and food items
3. Sample promocodes

### Backend API Endpoints

The backend will be organized using the MVC pattern with controllers, services, and repositories. Here's a detailed breakdown of the API endpoints:

#### Authentication API

```
POST /api/auth/register - Register a new user
POST /api/auth/login - Login a user and get JWT token
GET /api/auth/me - Get current user details
POST /api/auth/logout - Logout the current user
```

#### Users API

```
GET /api/users - Get all users (admin only)
GET /api/users/{id} - Get a specific user
PUT /api/users/{id} - Update user info
DELETE /api/users/{id} - Delete a user (admin only)
```

#### Products API

```
GET /api/products - Get all products
GET /api/products/{id} - Get a specific product
POST /api/products - Create a new product (admin only)
PUT /api/products/{id} - Update a product (admin only)
DELETE /api/products/{id} - Delete a product (admin only)
```

#### Cart API

```
GET /api/cart - Get the current user's cart
POST /api/cart/items - Add an item to cart
PUT /api/cart/items/{id} - Update cart item quantity
DELETE /api/cart/items/{id} - Remove an item from cart
DELETE /api/cart/clear - Clear the cart
```

#### Orders API

```
POST /api/orders - Create a new order from cart
GET /api/orders - Get all orders for the current user (or all orders for admin)
GET /api/orders/{id} - Get a specific order
PUT /api/orders/{id}/status - Update order status (admin only)
```

#### Promocodes API

```
GET /api/promocodes - Get all promocodes (admin only)
POST /api/promocodes - Create a new promocode (admin only)
PUT /api/promocodes/{id} - Update a promocode (admin only)
DELETE /api/promocodes/{id} - Delete a promocode (admin only)
GET /api/promocodes/validate/{code} - Validate a promocode
```

### Frontend Components

The frontend will be built using Angular with a modular structure. Here's a breakdown of the components and their relationships:

#### Components Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts
│   │   ├── interceptors/
│   │   │   ├── jwt.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   ├── product.model.ts
│   │   │   ├── cart.model.ts
│   │   │   ├── order.model.ts
│   │   │   └── promocode.model.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── user.service.ts
│   │       ├── product.service.ts
│   │       ├── cart.service.ts
│   │       ├── order.service.ts
│   │       └── promocode.service.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── navbar/
│   │   │   ├── footer/
│   │   │   ├── loading-spinner/
│   │   │   ├── alert/
│   │   │   ├── modal/
│   │   │   └── product-card/
│   │   └── pipes/
│   │       └── currency.pipe.ts
│   ├── features/
│   │   ├── home/
│   │   │   └── home.component.ts
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── login.component.ts
│   │   │   └── register/
│   │   │       └── register.component.ts
│   │   ├── products/
│   │   │   ├── product-list/
│   │   │   │   └── product-list.component.ts
│   │   │   └── product-detail/
│   │   │       └── product-detail.component.ts
│   │   ├── cart/
│   │   │   └── cart.component.ts
│   │   ├── checkout/
│   │   │   └── checkout.component.ts
│   │   ├── orders/
│   │   │   ├── order-list/
│   │   │   │   └── order-list.component.ts
│   │   │   └── order-detail/
│   │   │       └── order-detail.component.ts
│   │   └── admin/
│   │       ├── admin-dashboard/
│   │       │   └── admin-dashboard.component.ts
│   │       ├── user-management/
│   │       │   └── user-management.component.ts
│   │       ├── product-management/
│   │       │   └── product-management.component.ts
│   │       ├── order-management/
│   │       │   └── order-management.component.ts
│   │       └── promocode-management/
│   │           └── promocode-management.component.ts
│   └── app-routing.module.ts
```

#### Routing Structure

```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrderListComponent, canActivate: [AuthGuard] },
  { path: 'orders/:id', component: OrderDetailComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'products', component: ProductManagementComponent },
      { path: 'orders', component: OrderManagementComponent },
      { path: 'promocodes', component: PromocodeManagementComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
```

### Integration Points

#### Authentication Flow

1. Backend generates JWT token on successful login
2. Frontend stores token in localStorage
3. JWT interceptor adds token to every API request
4. Auth Guard protects routes based on user role

#### Shopping Cart to Order Flow

1. User adds products to cart (stored in database)
2. User goes to checkout page
3. User enters delivery details and optional promocode
4. Frontend validates promocode with backend
5. Order is created in the database
6. Cart is cleared after successful order

#### Admin Dashboard Flow

1. Admin logs in with admin credentials
2. Admin guard protects admin routes
3. Admin has access to user management, product management, order management, and promocode management

## Development Process

### Development Workflow

For each feature:

1. **Planning**: Review the feature requirements and design solutions
2. **Development**: Implement both frontend and backend components
3. **Testing**: Manually test the feature to ensure it works as expected
4. **Documentation**: Update documentation to reflect the implemented feature
5. **Review**: Present to supervisor for testing and feedback
6. **Refinement**: Address any issues or feedback before moving to the next feature

This approach ensures that at each step, we have a functional application that can be tested and validated, building incrementally toward the full feature set.

#### Backend Development

1. Set up Spring Boot project using Spring Initializr
2. Configure PostgreSQL connection
3. Create entities and repositories
4. Implement services with business logic
5. Create controllers for API endpoints
6. Add JWT authentication
7. Implement role-based authorization

#### Frontend Development

1. Set up Angular project using Angular CLI
2. Set up Angular Material
3. Create core modules and shared components
4. Implement feature modules with components
5. Add routing
6. Implement services for API communication
7. Add state management with NgRx
8. Style the application with a pizza theme

### Implementation Strategy

- **Design Decisions**:
  - Italian Pizza Theme: Use colors inspired by the Italian flag (red, white, green)
  - Responsive Design: Mobile-first approach with responsive breakpoints
  - Component Structure: Separate header and footer into reusable components

- **Development Approach**:
  - Modular Architecture: Breaking down the application into smaller, focused components
  - API Design: Clean API with proper DTOs for separation between frontend and backend
  - Testing Approach: Sample data loaders for easier development testing

### Useful Commands

#### Backend Commands (Windows)

```
# Create Spring Boot Project (Windows PowerShell)
.\mvnw.cmd spring-boot:run

# Run Spring Boot Application (Windows PowerShell)
.\mvnw.cmd spring-boot:run
```

#### Frontend Commands

```
# Create Angular Project
ng new frontend --routing=true --style=scss

# Generate Modules
ng generate module core
ng generate module shared
ng generate module features/auth --module app

# Generate Components
ng generate component features/auth/login --module features/auth
ng generate component features/auth/register --module features/auth
ng generate component features/home --module app
ng generate component features/products/product-list --module app
ng generate component features/products/product-detail --module app
ng generate component features/cart --module app
ng generate component features/checkout --module app
ng generate component features/orders/order-list --module app
ng generate component features/orders/order-detail --module app
ng generate component features/admin/admin-dashboard --module app
ng generate component features/admin/user-management --module app
ng generate component features/admin/product-management --module app
ng generate component features/admin/order-management --module app
ng generate component features/admin/promocode-management --module app

# Generate Services
ng generate service core/services/auth
ng generate service core/services/user
ng generate service core/services/product
ng generate service core/services/cart
ng generate service core/services/order
ng generate service core/services/promocode

# Generate Guards
ng generate guard core/guards/auth
ng generate guard core/guards/admin

# Generate Pipes
ng generate pipe shared/pipes/currency

# Serve Angular Application
ng serve

# Build Angular Application
ng build --configuration production
```

#### PostgreSQL Setup

PostgreSQL needs to be set up and configured:

```
# Create Database (in pgAdmin or psql)
CREATE DATABASE pizza_webshop;

# Connect to Database
\c pizza_webshop

# Run Schema SQL
# (Run the SQL script from the Database Schema section)
```

## Progress Tracking

Current progress status:

1. ✅ Project planning and documentation
2. ⬜ Backend setup
3. ⬜ Frontend setup
4. ⬜ Feature 1: Basic Application Structure and Homepage
5. ⬜ Subsequent features (per the roadmap)

## Development Notes

### Challenges Encountered

1. **Angular Setup**: Initial setup of the Angular application required careful configuration to ensure proper routing and component structure.
2. **Spring Boot Configuration**: Setting up the Spring Boot application with the right dependencies and configuration took some time to get right.
3. **Responsive Design**: Implementing responsive design from the start is easier than retrofitting it later. Using CSS Grid and Flexbox makes responsive layouts more straightforward.

### Lessons Learned

1. **Modular Architecture**: Breaking down the application into smaller, focused components makes development and maintenance easier.
2. **API Design**: Designing a clean API with proper DTOs helps maintain separation between the frontend and backend.
3. **Testing Approach**: Implementing sample data loaders makes testing easier during development.

## Testing Strategy

### Backend Testing

1. **Unit Testing**: Test individual services and repositories
2. **Integration Testing**: Test API endpoints with mock data
3. **Security Testing**: Verify JWT authentication and role-based authorization

### Frontend Testing

1. **Unit Testing**: Test individual components and services
2. **E2E Testing**: Test complete user flows (e.g., add to cart, checkout)
3. **Cross-browser Testing**: Verify application works in multiple browsers

## Deployment Guide

### Production Build Configuration

1. **Backend**:
   - Configure production database connection
   - Set proper JWT secret and expiration
   - Enable CORS for production frontend URL

2. **Frontend**:
   - Configure production API URL
   - Enable production mode
   - Optimize assets

### Deployment Steps

1. **Backend Deployment**:
   - Build JAR file: `.\mvnw.cmd clean package -DskipTests`
   - Deploy JAR file to server

2. **Frontend Deployment**:
   - Build production bundle: `ng build --configuration production`
   - Deploy built files to web server

3. **Database Setup**:
   - Set up production PostgreSQL database
   - Apply schema migrations
   - Seed initial data if required

This comprehensive plan combines all the information from the previous documentation files and provides a complete guide for developing the Pizza Webshop application. 