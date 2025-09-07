'use client';

import { useState, useEffect } from 'react';
import { orderApi } from '@/api';
import Link from 'next/link';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  productBrand: string; // Add productBrand based on OCR
}

interface Order {
  id: string;
  orderDate: string;
  totalAmount: number; // Changed from totalPrice
  status: string; // Changed from orderStatus
  items: OrderItem[]; // Changed from orderItems
  userId: string; // Add userId based on OCR
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      console.log(localStorage);
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please log in to view your orders.');
        setLoading(false);
        return;
      }

      try {
        const response = await orderApi.getUserOrders(userId);
        if (response.data.success) {
          console.log(response.data.data);
          setOrders(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch orders.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while fetching orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You have no orders yet. <Link href="/products" className="text-blue-500 hover:underline">Start shopping!</Link></p>
      ) : (
        <div className="space-y-6">
          {(orders ?? []).map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-gray-600 flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order ID: {order.id}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-gray-600 mb-2">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              <p className="text-gray-800 font-semibold mb-4">Total Price: ${(order.totalAmount ?? 0).toFixed(2)}</p>

              <h3 className="text-gray-600 text-lg font-semibold mb-2">Items:</h3>
              <ul className="list-disc list-inside space-y-1">
                {(order.items ?? []).map((item) => (
                  <li key={item.productId} className="text-gray-700">
                    {item.productName} (x{item.quantity}) - ${item.price.toFixed(2)} each
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;