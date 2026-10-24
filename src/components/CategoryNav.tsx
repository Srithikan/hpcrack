import React from 'react';
import type { Product } from '../types';
import { CATEGORIES_INFO } from '../data/products';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  products: Product[];
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  products,
}) => {
  // Compute counts
  const totalCount = products.filter((p) => p.enabled !== false).length;

  return (
    <nav className="category-nav-bar" aria-label="Product categories">
      <div className="category-nav-container">
        {/* All Products pill */}
        <button
          className={`cat-pill-btn ${selectedCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => onSelectCategory('ALL')}
        >
          <span>🔥</span>
          <span>All Crackers</span>
          <span className="pill-count">{totalCount}</span>
        </button>

        {/* Individual category pills */}
        {CATEGORIES_INFO.map((cat) => {
          const count = products.filter(
            (p) => p.category === cat.name && p.enabled !== false
          ).length;

          return (
            <button
              key={cat.name}
              className={`cat-pill-btn ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.name)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="pill-count">{count}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
