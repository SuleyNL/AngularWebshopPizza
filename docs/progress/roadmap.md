# Pizza Webshop Development Roadmap

This roadmap outlines the implementation sequence for the Pizza Webshop application, broken down into small, testable features. Each feature should be fully implemented and tested before moving to the next one.

## Phase 1: Core Product Experience

### Feature 1: Basic Application Structure and Homepage
- Set up backend structure with Spring Boot
- Set up frontend structure with Angular
- Create basic homepage with header, footer, and navigation
- Implement responsive design basics
- **Testing**: Supervisor can view the homepage with Italian pizza shop styling

### Feature 2: Product Catalog Viewing
- Implement backend models and database for products
- Create seed data with at least 10 pizza/food items
- Implement API endpoints to retrieve products
- Create frontend product listing page
- Create frontend product detail page
- **Testing**: Supervisor can browse the product catalog and view product details as a non-logged-in user

### Feature 3: Basic Shopping Cart
- Implement client-side cart functionality
- Create "Add to Cart" functionality on product cards and detail pages
- Implement cart view page with item listing
- Add ability to update quantities in cart
- Add ability to remove items from cart
- **Testing**: Supervisor can add products to cart, update quantities, and remove items without being logged in

## Phase 2: Guest Checkout Flow

### Feature 4: Guest Checkout
- Create checkout page with order summary
- Implement delivery information form
- Add order placement functionality for guest users
- Create order confirmation page
- **Testing**: Supervisor can place an order without being logged in by providing delivery details

### Feature 5: Basic Promocode Functionality
- Create promocode database model and seed data
- Implement backend validation for promocodes
- Add promocode input field to checkout
- Implement frontend validation and application of discounts
- **Testing**: Supervisor can apply a valid promocode during checkout to receive a discount

## Phase 3: User Authentication

### Feature 6: User Registration and Login
- Implement user registration backend
- Create user registration form
- Implement login functionality with JWT
- Create login form
- Add logout functionality
- **Testing**: Supervisor can register a new account and log in/out

### Feature 7: User Profile and Order History
- Create user profile page
- Implement edit profile functionality
- Create order history page
- Implement order detail view
- **Testing**: Supervisor can view and edit their profile, and see their order history

### Feature 8: Registered User Checkout
- Connect cart to user account when logged in
- Autofill delivery information from user profile
- Save new addresses to user profile
- **Testing**: Supervisor can place an order with pre-filled delivery information when logged in

## Phase 4: Admin Functionality

### Feature 9: Admin Authentication
- Implement admin role and authorization
- Create admin login functionality
- Implement route protection for admin pages
- **Testing**: Supervisor can log in as an admin

### Feature 10: Admin Dashboard - Overview
- Create admin dashboard layout
- Implement basic statistics (total orders, revenue, etc.)
- **Testing**: Supervisor can view the admin dashboard with statistics

### Feature 11: Admin Dashboard - User Management
- Implement user listing functionality
- Add user details view
- Create user deletion functionality
- **Testing**: Supervisor can view all users, see user details, and delete users

### Feature 12: Admin Dashboard - Product Management
- Implement product listing for admin
- Create product add/edit form
- Implement product deletion
- Add product availability toggling
- **Testing**: Supervisor can add, edit, and delete products

### Feature 13: Admin Dashboard - Order Management
- Implement order listing for admin
- Create order details view
- Add order status update functionality
- **Testing**: Supervisor can view all orders, see order details, and update order status

### Feature 14: Admin Dashboard - Promocode Management
- Implement promocode listing
- Create promocode add/edit form
- Implement promocode activation/deactivation
- Add promocode deletion
- **Testing**: Supervisor can create, edit, activate/deactivate, and delete promocodes

## Phase 5: Refinement and Optimization

### Feature 15: Enhanced User Experience
- Implement toast notifications
- Add loading indicators
- Improve form validations
- Enhance responsive design
- **Testing**: Supervisor can see improved UX elements across the application

### Feature 16: Cart Persistence
- Implement persistent cart for non-logged-in users
- Merge anonymous cart with user cart on login
- **Testing**: Supervisor can add items to cart, log in, and see the items are still there

### Feature 17: Polish and Final Touches
- Refine styling and theme consistency
- Optimize performance
- Add final UI polish
- **Testing**: Supervisor can observe the polished application with consistent styling and good performance

## Deployment Preparation

### Feature 18: Deployment Configuration
- Configure production builds
- Setup environment variables
- Create deployment documentation
- **Testing**: Supervisor can review the deployment configuration

---

## Implementation Strategy

For each feature:

1. **Planning**: Review the feature requirements and design solutions
2. **Development**: Implement both frontend and backend components
3. **Testing**: Manually test the feature to ensure it works as expected
4. **Documentation**: Update documentation to reflect the implemented feature
5. **Review**: Present to supervisor for testing and feedback
6. **Refinement**: Address any issues or feedback before moving to the next feature

This approach ensures that at each step, we have a functional application that can be tested and validated, building incrementally toward the full feature set. 