package com.sultan.springshop.service.order;

import java.util.List;

import com.sultan.springshop.dto.OrderDto;
import com.sultan.springshop.model.Order;

public interface IOrderService {

    Order placeOrder(Long userId);

    OrderDto getOrder(Long orderId);

    List<OrderDto> getUserOrders(Long userId);

    OrderDto converToDto(Order order);
}
