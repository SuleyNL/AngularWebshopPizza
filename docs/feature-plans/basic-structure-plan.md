# Basic Application Structure and Homepage - Feature Plan

## Overview

This document outlines the plan for implementing the basic application structure and homepage for the Pizza Webshop. This feature represents the foundation of the application, providing the initial setup for both frontend and backend components, as well as establishing the visual identity of the application.

## Goals

1. Set up the backend structure with Spring Boot
2. Set up the frontend structure with Angular
3. Create basic homepage with Italian pizza shop styling
4. Implement responsive design fundamentals
5. Establish the visual theme and branding

## Technical Approach

### Backend Implementation

#### Spring Boot Setup

1. Create a new Spring Boot project with the following dependencies:
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Spring Security (basic configuration only, no authentication yet)
   - Spring DevTools
   - Lombok (for reducing boilerplate code)

2. Configure basic application properties:
   ```properties
   # Server configuration
   server.port=8080
   
   # Database configuration (minimal setup for now)
   spring.datasource.url=jdbc:postgresql://localhost:5432/pizza_webshop
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   spring.jpa.properties.hibernate.format_sql=true
   
   # Logging configuration
   logging.level.org.hibernate.SQL=DEBUG
   logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
   ```

3. Create a simple status controller:
   ```java
   @RestController
   @RequestMapping("/api")
   public class HomeController {
       
       @GetMapping("/status")
       public ResponseEntity<Map<String, String>> getStatus() {
           Map<String, String> response = new HashMap<>();
           response.put("status", "online");
           response.put("message", "Pizza Webshop API is running");
           response.put("timestamp", LocalDateTime.now().toString());
           return ResponseEntity.ok(response);
       }
   }
   ```

4. Set up basic security configuration to allow access to the status endpoint

### Frontend Implementation

#### Angular Setup

1. Create a new Angular project:
   ```bash
   ng new frontend --routing=true --style=scss
   ```

2. Set up core modules:
   ```bash
   ng generate module core
   ng generate module shared
   ```

3. Install Angular Material for UI components:
   ```bash
   ng add @angular/material
   ```

4. Set up global styles:
   - Create variables for the Italian theme colors (red, white, green)
   - Set up typography using Google Fonts (Playfair Display for headings, Roboto for body text)
   - Create responsive breakpoints

#### Component Structure

1. Header Component:
   - Logo (placeholder for now)
   - Navigation menu (Home, Menu - links will be non-functional for now)
   - Responsive mobile menu toggle

2. Footer Component:
   - Contact information
   - Copyright notice
   - Address (fictional pizza shop address)

3. Homepage Component:
   - Hero section with a pizza background image
   - Introduction to the pizza shop
   - Featured pizzas section (static content for now)
   - Call-to-action for ordering

### Integration Points

1. Backend and Frontend connection:
   - Configure CORS in Spring Boot to allow requests from the Angular application
   - Create a simple service in Angular to verify the API connection

## UI/UX Design Considerations

1. Color Scheme:
   - Primary: Deep red (#D72323) - For headers and important elements
   - Secondary: Forest green (#3A6B35) - For accents and buttons
   - Background: Off-white (#F5F5F5) - For content areas
   - Text: Dark gray (#333333) - For better readability

2. Typography:
   - Headings: Playfair Display (serif font that conveys Italian tradition)
   - Body: Roboto (clean, modern sans-serif for readability)

3. Responsive Design:
   - Mobile-first approach
   - Breakpoints at 576px, 768px, 992px, and 1200px
   - Use of flex and grid layouts for responsive components

## Testing Plan

1. Backend Testing:
   - Verify the API status endpoint returns the correct response
   - Check that CORS is properly configured

2. Frontend Testing:
   - Test responsive design on different viewport sizes
   - Verify that all components render correctly
   - Ensure the application works in Chrome, Firefox, and Edge browsers

## Implementation Steps

1. Backend Setup (2 hours):
   - Create Spring Boot project
   - Configure application properties
   - Implement status controller
   - Configure security and CORS

2. Frontend Setup (3 hours):
   - Create Angular project
   - Install dependencies
   - Set up modules
   - Configure routing

3. UI Component Implementation (4 hours):
   - Create header component
   - Create footer component
   - Create homepage component
   - Implement responsive designs

4. Integration and Testing (1 hour):
   - Connect frontend to backend
   - Test all components
   - Fix any issues

Total Estimated Time: 10 hours

## Deliverables

1. Working Spring Boot backend application with status endpoint
2. Working Angular frontend application with responsive design
3. Homepage with Italian pizza shop styling
4. Documentation of the implementation

## Future Considerations

1. The header will need to be updated to include cart and login functionality in later features
2. The homepage will be updated to show actual products from the database in a later feature
3. The current setup focuses on structure and design, with minimal actual functionality 