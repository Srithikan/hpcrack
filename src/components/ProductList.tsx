import React from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { calculateProductPricing } from '../utils/calculations';

interface ProductListProps {
  products: Product[];
  selectedCategory: string;
  cartMap: Record<string, number>;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onAddToCart: (product: Product, quantityToAdd: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  selectedCategory,
  cartMap,
  onQuantityChange,
  onAddToCart,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      // Must be enabled
      if (product.enabled === false) return false;

      // Category filter
      if (selectedCategory !== 'ALL' && product.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  // Sort products
  const sortedProducts = React.useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => {
        const priceA = calculateProductPricing(a.originalPrice, a.discountPercentage).discountedPrice;
        const priceB = calculateProductPricing(b.originalPrice, b.discountPercentage).discountedPrice;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => {
        const priceA = calculateProductPricing(a.originalPrice, a.discountPercentage).discountedPrice;
        const priceB = calculateProductPricing(b.originalPrice, b.discountPercentage).discountedPrice;
        return priceB - priceA;
      });
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filteredProducts, sortBy]);

  return (
    <section className="products-grid-section">
      {/* Search & Sort Controls Bar */}
      <div className="filter-bar-wrapper">
        <div className="search-box-container">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by cracker name (Lakshmi, Flower Pot, Sparklers, 30 Shot...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-crackers-input"
          />
        </div>

        <div className="filter-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={16} color="#64748b" />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              id="sort-crackers-select"
            >
              <option value="featured">Featured / Category Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>

          <span className="product-count-text">
            Showing <strong>{sortedProducts.length}</strong> items
          </span>
        </div>
      </div>

      {/* Grid of Products */}
      {sortedProducts.length > 0 ? (
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cartMap[product.id] || 0}
              onQuantityChange={onQuantityChange}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="empty-cart-state" style={{ background: '#fff', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
          <AlertCircle size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3 className="empty-cart-title">No Crackers Found</h3>
          <p className="empty-cart-sub">
            We couldn't find any products matching "{searchQuery}" in{' '}
            {selectedCategory === 'ALL' ? 'all categories' : selectedCategory}.
          </p>
          <button
            className="clear-cart-btn"
            onClick={() => setSearchQuery('')}
            style={{ color: '#990000', borderColor: '#990000' }}
          >
            Clear Search Filter
          </button>
        </div>
      )}
    </section>
  );
};
