'use client';

import React, { use } from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { productApi, imageApi, categoryApi } from '@/api';

interface Category {
  id: string;
  name: string;
}

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
  brand: string;
  inventory: number;
  category: Category; // Expecting a full Category object from backend
  images: ProductImage[]; // Assuming product has an array of images
}

const EditProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [inventory, setInventory] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
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

    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await productApi.getProductById(id);
        const productData: Product = productResponse.data.data;
        setProduct(productData);
        setName(productData.name);
        setBrand(productData.brand);
        setPrice(productData.price);
        setInventory(productData.inventory);
        setDescription(productData.description);
        setSelectedCategoryId(productData.category.id); // Set the selected category

        // Fetch categories
        const categoriesResponse = await categoryApi.getAllCategories();
        setCategories(categoriesResponse.data.data);
      } catch (err) {
        setError('Failed to fetch product or categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, isAdmin, isLoading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

      if (!selectedCategory) {
        setError('Please select a valid category.');
        setSubmitting(false);
        return;
      }

      const productData = {
        id,
        name,
        description,
        price,
        brand,
        inventory,
        category: selectedCategory, // Send the full Category object
      };

      await productApi.updateProduct(id, productData);

      if (selectedFiles && selectedFiles.length > 0) {
        await imageApi.uploadImages(Array.from(selectedFiles), id);
      }

      setSuccess('Product updated successfully!');
      router.push('/admin/products');
    } catch (err) {
      setError('Failed to update product.');
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
      <h1 className="text-2xl font-bold mb-4">Edit Product: {product?.name}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white">Product Name</label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-white">Brand</label>
          <input
            type="text"
            id="brand"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-300"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-white">Price</label>
          <input
            type="number"
            id="price"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-300"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="inventory" className="block text-sm font-medium text-white">Inventory</label>
          <input
            type="number"
            id="inventory"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-300"
            value={inventory}
            onChange={(e) => setInventory(parseInt(e.target.value))}
            required
            min="0"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
          <textarea
            id="description"
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-white">Category</label>
          <select
            id="category"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-300"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-white">Product Images</label>
          {/* Display existing images and allow deletion/new uploads */}
          <div className="flex flex-wrap gap-2 mt-2">
            {product?.images.map((image) => (
              <div key={image.id} className="relative w-24 h-24 border rounded-md overflow-hidden">
                <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].downloadUrl}`} alt="Product Image" className="w-full h-full object-cover" />
                {/* Add delete button for images later */}
              </div>
            ))}
          </div>
          <input
            type="file"
            id="images"
            className="mt-1 block w-full text-white"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
          disabled={submitting}
        >
          {submitting ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
