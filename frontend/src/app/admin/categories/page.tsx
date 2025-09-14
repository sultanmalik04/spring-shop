'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { categoryApi } from '@/api';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

const AdminCategoryListPage = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!isAdmin) {
      router.push('/');
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        setCategories(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryApi.deleteCategory(categoryId);
        setCategories(categories.filter(category => category.id !== categoryId));
      } catch (err) {
        setError('Failed to delete category.');
        console.error(err);
      }
    }
  };

  if (isLoading || loading) {
    return <div className="container mx-auto p-4">Loading categories...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Should be redirected by useEffect, but good for safety
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <Link href="/admin/categories/new" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mb-4 inline-block">
        Add New Category
      </Link>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="text-black bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="text-gray-600 border-b last:border-b-0">
                <td className="py-2 px-4">{category.name}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <Link href={`/admin/categories/${category.id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoryListPage;
