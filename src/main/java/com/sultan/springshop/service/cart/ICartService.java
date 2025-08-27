package com.sultan.springshop.service.cart;

import java.math.BigDecimal;

import com.sultan.springshop.dto.CartDto;
import com.sultan.springshop.model.Cart;
import com.sultan.springshop.model.User;

public interface ICartService {

    Cart getCart(Long id);

    void clearCart(Long id);

    BigDecimal getTotalPrice(Long id);

    public Cart initializeNewCart(User user);

    Cart getCartByUserId(Long userId);

    CartDto convertCarttoCartDto(Cart cart);
}
