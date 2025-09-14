'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { userApi } from '@/api';
import Link from 'next/link';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[]; // Assuming roles are part of the user object
}

const AdminUserListPage = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
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

    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user.');
        console.error(err);
      }
    }
  };

  if (isLoading || loading) {
    return <div className="container mx-auto p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Should be redirected by useEffect, but good for safety
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="text-black bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">First Name</th>
              <th className="py-2 px-4 text-left">Last Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Roles</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-gray-600 border-b last:border-b-0">
                <td className="py-2 px-4">{user.firstName}</td>
                <td className="py-2 px-4">{user.lastName}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.roles.join(', ')}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <Link href={`/admin/users/${user.id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(user.id)}
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

export default AdminUserListPage;
