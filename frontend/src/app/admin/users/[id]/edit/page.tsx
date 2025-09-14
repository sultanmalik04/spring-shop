'use client';

import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

const EditUserPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
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

    const fetchUser = async () => {
      try {
        const response = await userApi.getUserById(id);
        const userData: User = response.data.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
      } catch (err) {
        setError('Failed to fetch user details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, isAuthenticated, isAdmin, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const userData = {
        firstName,
        lastName,
      };
      await userApi.updateUser(id, userData);
      setSuccess('User updated successfully!');
      router.push('/admin/users');
    } catch (err) {
      setError('Failed to update user.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || loading) {
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
      <h1 className="text-2xl font-bold mb-4">Edit User: {firstName} {lastName}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-white">First Name</label>
          <input
            type="text"
            id="firstName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-300"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-white">Last Name</label>
          <input
            type="text"
            id="lastName"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-300"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-400 bg-gray-700 cursor-not-allowed"
            value={email}
            disabled // Email is typically not editable directly
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
          disabled={submitting}
        >
          {submitting ? 'Updating User...' : 'Update User'}
        </button>
      </form>
    </div>
  );
};

export default EditUserPage;
