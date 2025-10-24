package com.sultan.springshop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class OrderDto {
    private Long orderId;
    private Long userId;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private String status;
    private List<OrderItemDto> items;
    private String paymentStatus; // e.g., PENDING, PAID, FAILED
    private String paymentId;
}
