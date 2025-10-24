package com.sultan.springshop.service.order;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.sultan.springshop.model.Order;
import com.sultan.springshop.service.order.OrderService;
import com.sultan.springshop.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private PaymentService paymentService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(paymentService, "stripeSecretKey", "sk_test_123");
    }

    @Test
    void createCheckoutSession_shouldReturnSessionId() throws StripeException {
        Long orderId = 1L;
        Order order = new Order();
        order.setOrderId(orderId);
        order.setTotalAmount(new BigDecimal("10.00"));

        when(orderService.getOrderById(orderId)).thenReturn(order);

        try (MockedStatic<Session> mockedSession = mockStatic(Session.class)) {
            Session mockStripeSession = mock(Session.class);
            when(mockStripeSession.getId()).thenReturn("cs_test_123");
            mockedSession.when(() -> Session.create(org.mockito.ArgumentMatchers.anyMap()))
                    .thenReturn(mockStripeSession);

            String sessionId = paymentService.createCheckoutSession(orderId);

            assertNotNull(sessionId);
            assertEquals("cs_test_123", sessionId);
            verify(orderService, times(1)).getOrderById(orderId);
            mockedSession.verify(() -> Session.create(org.mockito.ArgumentMatchers.anyMap()), times(1));
        }
    }

    @Test
    void handleSuccessfulPayment_shouldUpdateOrderStatus() throws StripeException {
        String sessionId = "cs_test_123";
        String orderId = "1";

        Session mockStripeSession = mock(Session.class);
        when(mockStripeSession.getMetadata()).thenReturn(java.util.Collections.singletonMap("orderId", orderId));

        try (MockedStatic<Session> mockedSession = mockStatic(Session.class)) {
            mockedSession.when(() -> Session.retrieve(sessionId)).thenReturn(mockStripeSession);

            paymentService.handleSuccessfulPayment(sessionId);

            verify(orderService, times(1)).updateOrderStatus(Long.valueOf(orderId), "PAID");
        }
    }

    @Test
    void handleSuccessfulPayment_shouldHandleStripeException() throws StripeException {
        String sessionId = "cs_test_123";

        try (MockedStatic<Session> mockedSession = mockStatic(Session.class)) {
            mockedSession.when(() -> Session.retrieve(sessionId)).thenThrow(StripeException.class);

            assertDoesNotThrow(() -> paymentService.handleSuccessfulPayment(sessionId));
            verify(orderService, never()).updateOrderStatus(any(), any());
        }
    }
}
