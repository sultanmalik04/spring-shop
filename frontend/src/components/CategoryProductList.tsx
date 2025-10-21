import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categoryApi, productApi } from '@/api'; // Assuming you have your API functions here

interface ProductImage {
  id: number;
  fileName: string;
  downloadUrl: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: ProductImage[]; 
  brandName: string;
  categoryName: string;
}

interface CategoryProductListProps {
  categoryName: string;
}

const CategoryProductList: React.FC<CategoryProductListProps> = ({ categoryName }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProductsByCategory(categoryName);
        setProducts(response.data.data.slice(0, 5)); // Display first 5 products
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center py-8 text-gray-600">No products found for {categoryName}.</div>;
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white capitalize">{categoryName}</h2>
        <Link href={`/products/category/${encodeURIComponent(categoryName)}`} className="text-blue-600 hover:text-blue-800 font-semibold">
          View All Products &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative w-full h-48">
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].downloadUrl}`} // Fallback image
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>
              <p className="text-xl font-bold text-blue-700">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryProductList;
