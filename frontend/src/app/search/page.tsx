'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { productApi } from '@/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types';

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredBrand, setFilteredBrand] = useState<string>('');
  const [filteredMinPrice, setFilteredMinPrice] = useState<number | ''>( '');
  const [filteredMaxPrice, setFilteredMaxPrice] = useState<number | ''>( '');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        // Assuming an API endpoint for searching products by name
        const response = await productApi.searchProductByName(decodeURIComponent(searchQuery));
        console.log('Search API response:', response);
        setProducts(response.data.data || []);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleBrandFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilteredBrand(e.target.value);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredMinPrice(e.target.value === '' ? '' : Number(e.target.value));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilteredMaxPrice(e.target.value === '' ? '' : Number(e.target.value));
  };

  const getFilteredProducts = () => {
    return products.filter(product => {
      const matchesBrand = filteredBrand === '' || product.brand === filteredBrand;
      const matchesMinPrice = filteredMinPrice === '' || product.price >= filteredMinPrice;
      const matchesMaxPrice = filteredMaxPrice === '' || product.price <= filteredMaxPrice;
      return matchesBrand && matchesMinPrice && matchesMaxPrice;
    });
  };

  const availableBrands = Array.from(new Set(products.map(product => product.brand)));
  const filteredProducts = getFilteredProducts();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Results for "{searchQuery}"</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Brand Filter */}
        <div className="w-full md:w-1/3">
          <label htmlFor="brand-filter" className="block text-gray-700 text-sm font-bold mb-2">Filter by Brand:</label>
          <select
            id="brand-filter"
            value={filteredBrand}
            onChange={handleBrandFilterChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">All Brands</option>
            {availableBrands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Price Filter */}
        <div className="w-full md:w-2/3 flex gap-4">
          <div className="w-1/2">
            <label htmlFor="min-price" className="block text-gray-700 text-sm font-bold mb-2">Min Price:</label>
            <input
              type="number"
              id="min-price"
              value={filteredMinPrice}
              onChange={handleMinPriceChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Min Price"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="max-price" className="block text-gray-700 text-sm font-bold mb-2">Max Price:</label>
            <input
              type="number"
              id="max-price"
              value={filteredMaxPrice}
              onChange={handleMaxPriceChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Max Price"
            />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
