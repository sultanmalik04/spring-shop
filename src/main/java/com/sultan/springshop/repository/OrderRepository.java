package com.sultan.springshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sultan.springshop.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
