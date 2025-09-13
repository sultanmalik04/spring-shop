'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/'); // Redirect non-admins to home or an unauthorized page
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null; // Or a loading spinner
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard! Here you can manage products, categories, users, and more.</p>
      {/* Add admin-specific links and components here */}
      <ul className="mt-4 space-y-2">
        <li>
          <a href="/admin/products" className="text-blue-500 hover:underline">Manage Products</a>
        </li>
        <li>
          <a href="/admin/categories" className="text-blue-500 hover:underline">Manage Categories</a>
        </li>
        <li>
          <a href="/admin/users" className="text-blue-500 hover:underline">Manage Users</a>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboardPage;

