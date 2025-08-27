'use client';

import { useState, useEffect } from 'react';
import { productApi } from '@/api';
import Image from 'next/image';
import Link from 'next/link';

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

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getAllProducts();
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch products.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred while fetching products.');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Our Products</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {(products ?? []).map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <div className="relative w-full h-48">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].downloadUrl}`}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-black text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-2">Brand: {product.brand}</p>
                <p className="text-green-600 font-bold text-lg">${(product.price ?? 0).toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;