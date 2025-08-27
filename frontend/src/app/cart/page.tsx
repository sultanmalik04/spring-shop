'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { orderApi } from '@/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CartPage = () => {
  const { cart, totalPrice, removeItem, updateItemQuantity, clearCart, loading, error } = useCart();
  const router = useRouter();
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const handleCheckout = async () => {
    setOrderError(null);
    setOrderSuccess(null);
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage after login
    if (!userId) {
      setOrderError('Please log in to place an order.');
      return;
    }
    if (cart.length === 0) {
      setOrderError('Your cart is empty. Add items before checking out.');
      return;
    }

    try {
      const response = await orderApi.createOrder(userId);
      if (response.data.success) {
        setOrderSuccess('Order placed successfully!');
        clearCart(); // Clear cart after successful order
        router.push('/orders'); // Redirect to order history
      } else {
        setOrderError(response.data.message || 'Failed to place order.');
      }
    } catch (err: any) {
      setOrderError(err.response?.data?.message || 'An error occurred while placing your order.');
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading cart...</div>;
  }

  if (error) {
    if (error === 'Your cart is empty.') {
      return <p className="text-center text-gray-600">Your cart is empty. <Link href="/products" className="text-blue-500 hover:underline">Start shopping!</Link></p>;
    } else {
      return <div className="text-red-500 text-center p-8">Error: {error}</div>;
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty. <Link href="/products" className="text-blue-500 hover:underline">Start shopping!</Link></p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            {(cart ?? []).map((item) => (
              <div key={item.productId} className="flex items-center border-b py-4 last:border-b-0">
                <div className="w-24 h-24 relative mr-4">
                  {item.productImage ? (
                    <Image src={item.productImage} alt={item.name} fill style={{ objectFit: 'cover' }} className="rounded-md" priority />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 rounded-md">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
                  <p className="text-gray-600 mb-1">${(item.price ?? 0).toFixed(2)}</p>
                  <div className="flex items-center space-x-2">
                    <label htmlFor={`quantity-${item.productId}`} className="sr-only">Quantity</label>
                    <input
                      type="number"
                      id={`quantity-${item.productId}`}
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItemQuantity(item.productId, Number(e.target.value))}
                      className="w-20 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-lg font-bold">${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between text-lg mb-2">
              <span>Total Items:</span>
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total Price:</span>
              <span>${(totalPrice ?? 0).toFixed(2)}</span>
            </div>
            {orderError && <p className="text-red-500 text-sm mb-4">{orderError}</p>}
            {orderSuccess && <p className="text-green-500 text-sm mb-4">{orderSuccess}</p>}
            <button
              onClick={clearCart}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 mb-4"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;