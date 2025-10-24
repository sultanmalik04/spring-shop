package com.sultan.springshop.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.sultan.springshop.model.Order;
import com.sultan.springshop.service.order.OrderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    @Value("${stripe.api.secretKey}")
    private String stripeSecretKey;

    private final OrderService orderService;

    public PaymentService(OrderService orderService) {
        this.orderService = orderService;
    }

    public String createCheckoutSession(Long orderId) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        Order order = orderService.getOrderById(orderId);
        // You would dynamically create line items based on the order details
        // For simplicity, using a placeholder for now
        long amountTotal = (long) (order.getTotalAmount().doubleValue() * 100); // Convert to cents

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:3000/payment-cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(amountTotal)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Order #" + order.getOrderId())
                                                                .build())
                                                .build())
                                .build())
                .putMetadata("orderId", String.valueOf(orderId))
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    // Method to handle successful payment (e.g., update order status)
    public void handleSuccessfulPayment(String sessionId) {
        // Retrieve session from Stripe to get orderId from metadata
        try {
            Session session = Session.retrieve(sessionId);
            String orderId = session.getMetadata().get("orderId");
            if (orderId != null) {
                orderService.updateOrderStatus(Long.valueOf(orderId), "PAID"); // Assuming a method to update order status
            }
        } catch (StripeException e) {
            e.printStackTrace();
            // Handle error
        }
    }
}
