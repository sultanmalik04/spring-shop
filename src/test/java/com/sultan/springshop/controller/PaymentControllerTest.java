package com.sultan.springshop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.StripeException;
import com.sultan.springshop.service.order.OrderService;
import com.sultan.springshop.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PaymentController.class)
public class PaymentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderService orderService;

    @MockBean
    private PaymentService paymentService;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        // Stripe.apiKey is set in the controller, no need to mock here if it's a test
        // for controller logic
    }

    @Test
    void createCheckoutSession_shouldReturnSessionId() throws Exception {
        Long orderId = 1L;
        String sessionId = "cs_test_123";

        when(paymentService.createCheckoutSession(anyLong())).thenReturn(sessionId);

        mockMvc.perform(post("/api/v1/payment/create-checkout-session/{orderId}", orderId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sessionId));
    }

    @Test
    void createCheckoutSession_shouldReturnInternalServerError_whenStripeExceptionOccurs() throws Exception {
        Long orderId = 1L;

        when(paymentService.createCheckoutSession(anyLong())).thenThrow(StripeException.class);

        mockMvc.perform(post("/api/v1/payment/create-checkout-session/{orderId}", orderId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void handleStripeWebhook_shouldReturnOk() throws Exception {
        String payload = "{}";
        String sigHeader = "t=123,v1=abc";

        mockMvc.perform(post("/api/v1/payment/webhook")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Stripe-Signature", sigHeader)
                .content(payload))
                .andExpect(status().isOk());
    }
}
