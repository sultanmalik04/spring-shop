package com.sultan.springshop.service.order;

import java.math.BigDecimal;

import java.util.List;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.sultan.springshop.enums.OrderStatus;
import com.sultan.springshop.exceptions.ResourceNotFoundException;
import com.sultan.springshop.model.Cart;
import com.sultan.springshop.model.Order;
import com.sultan.springshop.model.OrderItem;
import com.sultan.springshop.model.Product;
import com.sultan.springshop.repository.OrderRepository;
import com.sultan.springshop.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public Order placeOrder(Long userId) {

        return null;
    }

    private Order createOrder(Cart cart) {
        Order order = new Order();
        // set the user
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());
        return order;
    }

    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            product.setInventory(product.getInventory() - cartItem.getQuantity());
            productRepository.save(product);
            return new OrderItem(order, product, cartItem.getQuantity(), cartItem.getUnitPrice());
        }).toList();
    }

    private BigDecimal calculateTotalAmount(List<OrderItem> orderItemList) {
        return orderItemList.stream().map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public Order getOrder(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

}
