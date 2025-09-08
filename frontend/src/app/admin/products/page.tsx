'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { productApi } from '@/api';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  categoryName: string;
  imageUrl: string; // Assuming an image URL for display
}

const AdminProductListPage = () => {
  const { isAuthenticated, isAdmin, isLoading} = useAuth();
  console.log("AdminProductListPage isAuthenticated: ", isAuthenticated, " isAdmin: ", isAdmin);
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait until authentication state is determined
    if (isLoading) return;
    
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      router.push('/login');
      return;
    }
    if (!isAdmin) {
      router.push('/');
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await productApi.getAllProducts();
        console.log("Admin fetch products: ",response.data);
        setProducts(response.data.data || []);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated, isAdmin, isLoading, router]);

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.deleteProduct(productId);
        setProducts(products.filter(product => product.id !== productId));
      } catch (err) {
        setError('Failed to delete product.');
        console.error(err);
      }
    }
  };

  if (isLoading || loading) {
    return <div className="container mx-auto p-4">Loading products...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Should be redirected by useEffect, but good for safety
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <Link href="/admin/products/new" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mb-4 inline-block">
        Add New Product
      </Link>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="text-black bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Brand</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-gray-600 border-b last:border-b-0">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.brand}</td>
                <td className="py-2 px-4">{product.categoryName}</td>
                <td className="py-2 px-4">${product.price.toFixed(2)}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <Link href={`/admin/products/${product.id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
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

export default AdminProductListPage;
