package com.pizza.config;

import com.pizza.model.Order;
import com.pizza.model.OrderItem;
import com.pizza.model.Product;
import com.pizza.model.Role;
import com.pizza.model.User;
import com.pizza.repository.ProductRepository;
import com.pizza.repository.UserRepository;
import com.pizza.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed users if none exist
        if (userRepository.count() == 0) {
            seedUsers();
        }
        
        // Seed products if none exist
        if (productRepository.count() == 0) {
            seedProducts();
        }

        // Seed orders if none exist
        if (orderRepository.count() == 0) {
            seedOrders();
        }
    }
    
    private void seedUsers() {
        // Create admin user
        User admin = User.builder()
                .username("admin")
                .email("admin@pizzadeliziosa.com")
                .password(passwordEncoder.encode("admin123"))
                .firstName("Admin")
                .lastName("User")
                .role(Role.ADMIN)
                .build();
        
        // Create regular user
        User customer = User.builder()
                .username("customer")
                .email("customer@example.com")
                .password(passwordEncoder.encode("customer123"))
                .firstName("Regular")
                .lastName("Customer")
                .address("123 Main St")
                .phone("555-123-4567")
                .role(Role.CUSTOMER)
                .build();
        
        userRepository.saveAll(Arrays.asList(admin, customer));
        
        System.out.println("Users seeded successfully!");
    }
    
    private void seedProducts() {
        List<Product> products = Arrays.asList(
            Product.builder()
                .name("Margherita")
                .description("Classic pizza with tomato sauce, mozzarella, and fresh basil")
                .price(new BigDecimal("8.99"))
                .category("PIZZA")
                .imageUrl("https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")
                .isAvailable(true)
                .build(),
                
            Product.builder()
                .name("Pepperoni")
                .description("American favorite with tomato sauce, mozzarella, and spicy pepperoni")
                .price(new BigDecimal("10.99"))
                .category("PIZZA")
                .imageUrl("https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")
                .isAvailable(true)
                .build(),
                
            Product.builder()
                .name("Quattro Formaggi")
                .description("Four cheese pizza with mozzarella, gorgonzola, fontina, and parmesan")
                .price(new BigDecimal("11.99"))
                .category("PIZZA")
                .imageUrl("https://images.unsplash.com/photo-1593246049226-ded77bf90326?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")
                .isAvailable(true)
                .build(),
                
            Product.builder()
                .name("Hawaiiana")
                .description("Tomato sauce, mozzarella, ham, and pineapple")
                .price(new BigDecimal("9.99"))
                .category("PIZZA")
                .imageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")
                .isAvailable(true)
                .build(),
                
            Product.builder()
                .name("Vegetariana")
                .description("Tomato sauce, mozzarella, bell peppers, mushrooms, and olives")
                .price(new BigDecimal("9.49"))
                .category("PIZZA")
                .imageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")
                .isAvailable(true)
                .build(),
                
            Product.builder()
                .name("Calzone")
                .description("Folded pizza with ricotta, mozzarella, and ham")
                .price(new BigDecimal("12.99"))
                .category("PIZZA")
                .imageUrl("https://images.unsplash.com/photo-1536184071535-78906f7172c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")
                .isAvailable(true)
                .build(),
                
            Product.builder()
                .name("Marinara")
                .description("Simple pizza with tomato sauce, garlic, and oregano")
                .price(new BigDecimal("7.99"))
                .category("PIZZA")
                .imageUrl("https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")
                .isAvailable(true)
                .build(),
                
            Product.builder()
                .name("Capricciosa")
                .description("Tomato sauce, mozzarella, ham, artichokes, mushrooms, and olives")
                .price(new BigDecimal("11.49"))
                .category("PIZZA")
                .imageUrl("https://images.unsplash.com/photo-1590083745251-4fdb0b285c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")
                .isAvailable(true)
                .build(),
                
            Product.builder()
                .name("Diavola")
                .description("Spicy pizza with tomato sauce, mozzarella, and hot salami")
                .price(new BigDecimal("10.49"))
                .category("PIZZA")
                .imageUrl("https://images.unsplash.com/photo-1572552635104-daf938e0aa1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80")
                .isAvailable(true)
                .build(),
                
            Product.builder()
                .name("Prosciutto e Funghi")
                .description("Tomato sauce, mozzarella, ham, and mushrooms")
                .price(new BigDecimal("10.99"))
                .category("PIZZA")
                .imageUrl("https://plus.unsplash.com/premium_photo-1663858366999-aa1ce123a972?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                .isAvailable(true)
                .build()
        );
        
        productRepository.saveAll(products);
        
        System.out.println("Products seeded successfully!");
    }
    
    private void seedOrders() {
        // Get the customer user
        User customer = userRepository.findByUsername("customer")
                .orElseThrow(() -> new RuntimeException("Customer user not found"));
        
        // Get available products to add to orders
        List<Product> availableProducts = productRepository.findByIsAvailableTrue();
        if (availableProducts.isEmpty()) {
            throw new RuntimeException("No available products found for creating orders");
        }
        
        Random random = new Random();
        
        // Create and save orders one at a time to ensure OrderItems are saved correctly
        // Order 1: Family dinner with 3 items
        createOrderWithItems(customer, 
            Order.OrderStatus.DELIVERED, 
            "123 Main St, Apt 4B, New York, NY 10001", 
            "555-123-4567", 
            LocalDateTime.now().minusDays(5), 
            availableProducts, 
            3, 
            random);
        
        // Order 2: Office lunch with 5 items
        createOrderWithItems(customer, 
            Order.OrderStatus.CONFIRMED, 
            "555 Business Plaza, Floor 12, Boston, MA 02108", 
            "555-234-5678", 
            LocalDateTime.now().minusDays(1), 
            availableProducts, 
            5, 
            random);
        
        // Order 3: Late night craving with 1 item
        createOrderWithItems(customer, 
            Order.OrderStatus.PENDING, 
            "789 College Ave, Dorm B, Miami, FL 33139", 
            "555-345-6789", 
            LocalDateTime.now().minusHours(2), 
            availableProducts, 
            1, 
            random);
        
        // Order 4: Cancelled order with 2 items
        createOrderWithItems(customer, 
            Order.OrderStatus.CANCELLED, 
            "321 Mountain View Rd, Denver, CO 80202", 
            "555-456-7890", 
            LocalDateTime.now().minusDays(3), 
            availableProducts, 
            2, 
            random);
        
        System.out.println("Orders seeded successfully!");
    }
    
    /**
     * Helper method to create an order with items and save it to the database
     */
    private void createOrderWithItems(
            User user, 
            Order.OrderStatus status, 
            String address, 
            String phone, 
            LocalDateTime createdAt, 
            List<Product> availableProducts, 
            int itemCount,
            Random random) {
        
        // First, create the order with initial totalAmount = 0
        Order order = Order.builder()
                .user(user)
                .status(status)
                .deliveryAddress(address)
                .deliveryPhone(phone)
                .createdAt(createdAt)
                .totalAmount(BigDecimal.ZERO) // Initialize with zero to satisfy NOT NULL constraint
                .build();
        
        // Create order items
        for (int i = 0; i < itemCount; i++) {
            // Get random product and quantity
            Product product = availableProducts.get(random.nextInt(availableProducts.size()));
            int quantity = random.nextInt(3) + 1; // 1-3 items
            
            // Create OrderItem with calculated totalPrice
            BigDecimal unitPrice = product.getPrice();
            BigDecimal totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
            
            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice) // Set the totalPrice explicitly
                    .order(order)
                    .build();
            
            // Add to order and update order's total amount
            order.getItems().add(item);
        }
        
        // Recalculate the total amount before saving
        order.recalculateTotalAmount();
        
        // Debug output
        System.out.println("Created order with " + order.getItems().size() + " items, total amount: " + order.getTotalAmount());
        
        // Save the order to the database - this should cascade to the order items
        orderRepository.save(order);
    }
} 