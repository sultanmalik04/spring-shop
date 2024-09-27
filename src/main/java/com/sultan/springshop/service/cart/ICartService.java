package com.sultan.springshop.service.cart;

import java.math.BigDecimal;

import com.sultan.springshop.model.Cart;

public interface ICartService {

    Cart getCart(Long id);

    void clearCart(Long id);

    BigDecimal getTotalPrice(Long id);
}
