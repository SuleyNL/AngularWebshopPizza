# Basic Application Structure and Homepage - Documentation

This document provides an overview of the implementation of the basic application structure and homepage for the Pizza Webshop application.

## Backend Structure

### Technologies Used
- Spring Boot 3.x
- Spring Data JPA
- Spring Security
- PostgreSQL

### Key Components

1. **Main Application Class**
   - `PizzaWebshopApplication.java`: Entry point for the Spring Boot application

2. **Configuration**
   - `SecurityConfig.java`: Basic security configuration that allows access to the status endpoint
   - `application.properties`: Configuration for database connection, JWT, and other settings

3. **Controllers**
   - `HomeController.java`: Simple controller with a status endpoint to verify the API is running

## Frontend Structure

### Technologies Used
- Angular 19.x
- SCSS for styling
- Google Fonts (Playfair Display and Roboto)

### Key Components

1. **Core Components**
   - `AppComponent`: Root component that includes the header, main content area, and footer
   - `HeaderComponent`: Navigation bar with logo and menu items
   - `FooterComponent`: Footer with contact information and copyright
   - `HomeComponent`: Landing page with hero section, features, and call-to-action

2. **Styling**
   - Italian-themed color scheme (red, white, green)
   - Responsive design for mobile and desktop
   - Custom typography with Playfair Display for headings and Roboto for body text

3. **Routing**
   - Basic routing configuration with home route and wildcard route

## Design Decisions

1. **Italian Pizza Theme**
   - Used colors inspired by the Italian flag (red, white, green)
   - Selected fonts that convey an authentic Italian restaurant feel
   - Implemented a hero section with a pizza background image

2. **Responsive Design**
   - Mobile-first approach with responsive breakpoints
   - Flexible grid layout for feature cards
   - Adjustable typography for different screen sizes

3. **Component Structure**
   - Separated header and footer into reusable components
   - Created a modular home page with distinct sections
   - Used SCSS for nested styling and better organization

## Future Enhancements

1. **Images**
   - Replace placeholder references with actual optimized images
   - Add image lazy loading for better performance

2. **Navigation**
   - Implement mobile menu toggle for smaller screens
   - Add active state styling for current page

3. **Animation**
   - Add subtle animations for better user experience
   - Implement scroll animations for content sections

## Setup Instructions

### Backend
1. Navigate to the backend directory
2. Run `mvn spring-boot:run` to start the Spring Boot application
3. The API will be available at `http://localhost:8080`

### Frontend
1. Navigate to the frontend directory
2. Run `ng serve` to start the Angular development server
3. The application will be available at `http://localhost:4200` 