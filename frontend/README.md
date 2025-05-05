# Pizza Deliziosa Frontend

This is the frontend application for Pizza Deliziosa, built with Angular. This document provides a detailed explanation of the frontend architecture, components, services, and functionality.

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

The Pizza Deliziosa frontend is built using Angular, following a modular architecture pattern. It communicates with the Spring Boot backend via RESTful API calls. The architecture is organized into the following modules:

1. **Core Module**: Contains application-wide singleton services, models, and utilities
2. **Feature Modules**: Contains specific functionality areas like products, cart, checkout, etc.
3. **Shared Module**: Contains reusable components, directives, and pipes

This architecture promotes code reusability, maintainability, and follows the Angular best practices for scalable applications.

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

## Core Module

The Core module contains application-wide singleton services and components that are loaded once when the application starts. It includes:

### Models

The data models define the structure of the objects used throughout the application:

- **User**: Represents user information for customers and administrators
- **Product**: Represents pizza and other products for sale
- **Order**: Represents customer orders with delivery information
- **OrderItem**: Represents items within an order with quantities and prices
- **Message**: Represents customer support messages

### Services

Services handle data operations and business logic:

- **AuthService**: Manages authentication, login, logout, and registration
- **ProductService**: Retrieves and manages product data
- **CartService**: Manages the shopping cart functionality
- **OrderService**: Handles order creation and management
- **UserService**: Manages user profile information
- **MessageService**: Handles customer support messaging
- **ErrorHandlerService**: Centralized error handling

### Interceptors

HTTP interceptors modify requests and responses:

- **JwtInterceptor**: Adds the JWT authentication token to outgoing requests
- **ErrorInterceptor**: Handles HTTP errors and provides consistent error handling

### Guards

Route guards protect routes based on authentication and authorization:

- **AuthGuard**: Prevents unauthenticated users from accessing protected routes
- **AdminGuard**: Restricts access to admin-only routes

## Feature Modules

Feature modules contain specific functionality areas of the application:

- **Home**: Landing page displaying featured products
- **Auth**: Login and registration functionality
- **Cart**: Shopping cart management
- **Checkout**: Order placement and payment processing
- **Orders**: Order history and tracking
- **Admin**: Administrative dashboard for managing products, orders, and users
- **About**: Information about the pizza restaurant
- **Contact**: Customer support contact form

## Shared Module

The Shared module contains components, directives, and pipes that are used across multiple feature modules:

- **Button Components**: Standardized buttons with different styles
- **Card Components**: Product and order display cards
- **Loading Indicator**: Displays during async operations
- **Alert Components**: Success and error notifications
- **Form Components**: Reusable form controls and validators

## State Management

The application manages state through:

1. **Services**: For simple state management using RxJS BehaviorSubjects
2. **LocalStorage**: For persistent data like authentication tokens
3. **URL Parameters**: For sharing state through routes

Key state management approaches:

- **Authentication State**: Managed by the AuthService with user data and JWT tokens
- **Cart State**: Managed by the CartService with product items and quantities
- **Order State**: Managed by the OrderService for tracking orders

## Authentication Flow

The authentication process works as follows:

1. User submits credentials through the login form
2. AuthService sends credentials to the backend `/api/auth/login` endpoint
3. Backend validates credentials and returns a JWT token
4. Frontend stores the JWT token in localStorage
5. JwtInterceptor attaches the token to subsequent API requests
6. AuthGuard uses AuthService to protect restricted routes

User registration follows a similar flow, with additional validation steps.

## Routing Configuration

The application uses Angular Router for navigation with a hierarchical structure:

- Base routes for main features (home, about, contact)
- Protected routes for authenticated users (orders, profile)
- Admin routes for administrators (admin dashboard)
- Wildcard route for handling 404 errors

The routing configuration includes:

- Route guards for protection
- Lazy loading for improved performance
- Route parameters for dynamic data

## NGINX Configuration

The frontend is served using NGINX, which provides:

1. **Static file serving**: Efficiently serves the compiled Angular application
2. **Reverse proxy**: Forwards API requests to the backend service
3. **HTTPS termination**: Handles SSL/TLS when deployed with HTTPS
4. **Compression**: Reduces bandwidth usage
5. **Cache control**: Improves performance with proper caching

The NGINX configuration includes settings for:

- Serving the Angular application's index.html for all routes (SPA support)
- Proxying API requests to the backend
- Setting appropriate security headers
- Configuring CORS

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

### Building for Production

1. Create a production build:
   ```
   ng build --prod
   ```

2. The compiled application will be in the `dist/` directory

### Deployment with Docker

The frontend includes a Dockerfile for containerized deployment:

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