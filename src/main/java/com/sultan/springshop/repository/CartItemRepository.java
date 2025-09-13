package com.sultan.springshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sultan.springshop.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    void deleteAllByCartId(Long id);

    void deleteAllByProductId(Long productId);

}
