'use client';

import HeroSection from "@/components/HeroSection";
import CategoryProductList from "@/components/CategoryProductList";
import { categoryApi } from "@/api";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryApi.getAllCategories();
        console.log(response.data);
        setCategories(response.data.data);
      } catch (err) {
        setError("Failed to fetch categories");
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <main className="">
      <HeroSection/>
      <div className="container mx-auto px-4 py-8">
        {categories.map(category => (
          <CategoryProductList key={category.id} categoryName={category.name} />
        ))}
      </div>
    </main>
  );
}
