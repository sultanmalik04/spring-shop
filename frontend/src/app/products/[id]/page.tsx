'use client';

import { useState, useEffect } from 'react';
import { productApi } from '@/api';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface ProductImage {
  id: number;
  fileName: string;
  downloadUrl: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  images: ProductImage[]; 
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem, loading: loadingCart, error: cartError, successMessage } = useCart();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await productApi.getProductById(id as string);
          if (response.data.success) {
            setProduct(response.data.data);
          } else {
            setError(response.data.message || 'Failed to fetch product details.');
          }
        } catch (err: any) {
          setError(err.response?.data?.message || 'An error occurred while fetching product details.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (product) {
      await addItem(product.id, quantity);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center p-8">Product not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row items-center md:items-start gap-8">
      <div className="md:w-1/2 w-full">
        <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden shadow-md">
          {product.images && product.images.length > 0 ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].downloadUrl}`}
              alt={product.name}
              fill
              sizes="100vw" // Changed sizes prop to a more general value
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
              No Image Available
            </div>
          )}
        </div>
      </div>
      <div className="md:w-1/2 w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-black text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-600 text-lg mb-2">Brand: {product.brand}</p>
        <p className="text-green-600 font-bold text-3xl mb-4">${(product.price ?? 0).toFixed(2)}</p>
        <p className="text-gray-700 text-base mb-6">{product.description}</p>
        
        {/* Add to Cart functionality */}
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="text-black w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300"
            disabled={loadingCart}
          >
            {loadingCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
        {cartError && <p className="text-red-500 text-sm mt-2">{cartError}</p>}
        {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ProductDetailPage;