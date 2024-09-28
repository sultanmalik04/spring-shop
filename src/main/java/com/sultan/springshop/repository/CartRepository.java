package com.sultan.springshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sultan.springshop.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

    Cart findByUserId(Long userId);
}
