package com.sultan.springshop.dto;

import java.math.BigDecimal;
import java.util.Set;

import lombok.Data;

@Data
public class CartDto {
    private Long CartId;
    private Set<CartItemDto> items;
    private BigDecimal totalAmount;
}
