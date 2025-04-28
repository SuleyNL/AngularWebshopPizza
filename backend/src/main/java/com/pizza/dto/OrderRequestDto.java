package com.pizza.dto;

import com.pizza.model.Order.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {
    private Long userId;  // Only user ID instead of full user object
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String deliveryAddress;
    private String deliveryPhone;
    private List<OrderItemDto> items;
}