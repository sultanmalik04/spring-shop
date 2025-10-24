package com.sultan.springshop.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.sultan.springshop.service.order.OrderService;
import com.sultan.springshop.service.PaymentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    @Value("${stripe.api.secretKey}")
    private String stripeSecretKey;

    private final OrderService orderService;
    private final PaymentService paymentService;

    public PaymentController(OrderService orderService, PaymentService paymentService) {
        this.orderService = orderService;
        this.paymentService = paymentService;
    }

    @PostMapping("/create-checkout-session/{orderId}")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@PathVariable Long orderId) {
        try {
            String sessionId = paymentService.createCheckoutSession(orderId);
            Map<String, String> response = new HashMap<>();
            response.put("id", sessionId);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (StripeException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        // In a real application, you would verify the webhook signature
        // and process the event accordingly (e.g., update order status)
        // For simplicity, we'll just log the event for now
        System.out.println("Stripe Webhook Event: " + payload);
        return new ResponseEntity<>("Webhook received", HttpStatus.OK);
    }
}
