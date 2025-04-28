package com.pizza.controller;

import com.pizza.model.Order;
import com.pizza.model.OrderItem;
import com.pizza.model.Product;
import com.pizza.model.User;
import com.pizza.dto.OrderRequestDto;
import com.pizza.repository.OrderRepository;
import com.pizza.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderRepository.findById(id);
        return order.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUserId(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
    }
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequestDto orderRequestDto) {
        // 1. Find the user first
        User user = userRepository.findById(orderRequestDto.getUserId())
        .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + orderRequestDto.getUserId()));
        
        // Convert DTO to Entity
        Order order = Order.builder()
                .user(user) // Now you have a User object
                .status(orderRequestDto.getStatus())
                .deliveryAddress(orderRequestDto.getDeliveryAddress())
                .deliveryPhone(orderRequestDto.getDeliveryPhone())
                .build();
    
        // Create and add order items
        if (orderRequestDto.getItems() != null) {
            List<OrderItem> orderItems = orderRequestDto.getItems().stream()
                    .map(itemDto -> OrderItem.builder()
                            .product(Product.builder().id(itemDto.getProductId()).build())
                            .quantity(itemDto.getQuantity())
                            .unitPrice(itemDto.getUnitPrice())
                            .totalPrice(itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity())))
                            .order(order) // Set the bidirectional relationship
                            .build())
                    .collect(Collectors.toList());
    
            System.out.println("Order items: " + orderItems);
            System.out.println("Order totalprice: " + order.getTotalAmount());
            order.setItems(orderItems);
        }
        // Calculate total amount after all items have totals
        order.recalculateTotalAmount();
        System.out.println("Order totalprice: " + order.getTotalAmount());
    
        // Save order
        Order savedOrder = orderRepository.save(order);
        return new ResponseEntity<>(savedOrder, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody OrderRequestDto orderRequestDto) {
        return orderRepository.findById(id)
                .map(existingOrder -> {
                    // Update order fields
                    existingOrder.setStatus(orderRequestDto.getStatus());
                    existingOrder.setDeliveryAddress(orderRequestDto.getDeliveryAddress());
                    existingOrder.setDeliveryPhone(orderRequestDto.getDeliveryPhone());
                    
                    // Clear existing items and add new ones
                    existingOrder.getItems().clear();
                    
                    if (orderRequestDto.getItems() != null) {
                        orderRequestDto.getItems().forEach(itemDto -> {
                            OrderItem item = OrderItem.builder()
                                .product(Product.builder().id(itemDto.getProductId()).build())
                                .quantity(itemDto.getQuantity())
                                .unitPrice(itemDto.getUnitPrice())
                                .order(existingOrder)
                                .build();
                            existingOrder.addOrderItem(item);
                        });
                    }
                    
                    return ResponseEntity.ok(orderRepository.save(existingOrder));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(order -> {
                    orderRepository.delete(order);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
} 