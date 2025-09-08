'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const Navbar = () => {
  const { cart } = useCart();
  const [totalItems, setTotalItems] = useState(0);
  const router = useRouter();
  const { isAuthenticated, logout, isAdmin } = useAuth(); // Use useAuth hook
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setTotalItems(cart.reduce((sum, item) => sum + item.quantity, 0));
    if (typeof window !== 'undefined') {
      setUserId(localStorage.getItem('userId'));
    }
  }, [cart]);

  const handleLogout = () => {
    logout(); // Use logout from AuthContext
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          SpringShop
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/products" className="hover:text-gray-300">
            Products
          </Link>
          <Link href="/cart" className="relative hover:text-gray-300">
            Cart ({totalItems})
          </Link>
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link href="/admin" className="hover:text-gray-300">
                  Admin Dashboard
                </Link>
              )}
              <Link href="/orders" className="hover:text-gray-300">
                My Orders
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;