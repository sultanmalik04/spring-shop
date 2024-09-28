package com.sultan.springshop.service.order;

import com.sultan.springshop.model.Order;

public interface IOrderService {

    Order placeOrder(Long userId);

    Order getOrder(Long orderId);

}
