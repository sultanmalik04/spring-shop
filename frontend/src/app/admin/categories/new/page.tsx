'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { categoryApi } from '@/api';

const AddNewCategoryPage = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const categoryData = {
        name,
      };
      await categoryApi.addCategory(categoryData);
      setSuccess('Category added successfully!');
      router.push('/admin/categories');
    } catch (err) {
      setError('Failed to add category.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || (!isAuthenticated && !isLoading)) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Should be redirected by useEffect
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white">Category Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
          disabled={submitting}
        >
          {submitting ? 'Adding Category...' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddNewCategoryPage;
