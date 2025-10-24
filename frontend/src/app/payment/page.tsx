'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { paymentApi } from '@/api';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const initiateCheckout = async () => {
      if (!orderId) {
        setError('Order ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await paymentApi.createCheckoutSession(orderId);
        const checkoutUrl = response.data.id; // This will now be the URL

        if (checkoutUrl) {
          router.push(checkoutUrl); // Redirect to the Stripe Checkout URL
        } else {
          setError('Failed to get checkout URL from backend.');
        }
      } catch (err: any) {
        setError(`Failed to initiate payment: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initiateCheckout();
  }, [orderId, router]);

  if (loading) {
    return <div className="text-center p-8">Redirecting to payment...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  return (
    <div className="text-center p-8">
      <p>If you are not redirected automatically, please click here:</p>
      {/* Optionally add a manual redirect button here if needed */}
    </div>
  );
};

export default PaymentPage;
