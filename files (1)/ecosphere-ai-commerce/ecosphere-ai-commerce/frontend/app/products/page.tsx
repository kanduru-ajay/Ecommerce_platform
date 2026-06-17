// frontend/app/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  carbonScore: number;
  ecoScore: number;
  averageRating: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [page, setPage] = useState(1);
  const router = useRouter();

  const categories = ['all', 'electronics', 'clothing', 'home', 'eco-products', 'beauty'];

  useEffect(() => {
    fetchProducts();
  }, [search, category, sortBy, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
      });

      if (search) params.append('search', search);
      if (category !== 'all') params.append('category', category);

      const response = await fetch(`${API_URL}/api/products?${params}`);
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Search and Filters */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-8">Browse Products</h1>

          <div className="grid grid-cols-4 gap-4 mb-8">
            {/* Search */}
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full"
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="card h-96 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="card h-full cursor-pointer group">
                  {/* Image Placeholder */}
                  <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center text-4xl">
                    {product.images[0] || '📦'}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold mb-2 line-clamp-2 text-sm">{product.title}</h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl font-bold gradient-text">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Sustainability Score */}
                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      🌱 {product.ecoScore.toFixed(1)}
                    </span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      💨 {product.carbonScore.toFixed(1)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm">{product.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4">{page}</span>
            <button
              onClick={() => setPage(page + 1)}
              className="btn-secondary"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
