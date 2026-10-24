import React from 'react';
import { CATEGORIES_INFO } from '../data/products';
import type { Product } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategoriesViewProps {
  products: Product[];
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  products,
  onSelectCategory,
}) => {
  return (
    <section className="instructions-section">
      <div className="instructions-header">
        <span className="hero-pill-badge">
          <Sparkles size={14} />
          <span>Sivakasi Master Collection</span>
        </span>
        <h2 className="instructions-main-title">Festival Cracker Categories</h2>
        <p style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto' }}>
          Explore our complete range of fireworks crafted with precision in Sivakasi.
          From kids favorites to grand aerial displays, each category is available at direct wholesale rates.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {CATEGORIES_INFO.map((cat) => {
          const categoryProducts = products.filter(
            (p) => p.category === cat.name && p.enabled !== false
          );

          return (
            <div
              key={cat.name}
              className="product-card"
              style={{
                cursor: 'pointer',
                border: '1.5px solid #fed7aa',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'linear-gradient(180deg, #ffffff 0%, #fffbf5 100%)',
              }}
              onClick={() => onSelectCategory(cat.name)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      background: 'var(--festive-gold-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    {cat.icon}
                  </div>
                  <span className="badge-discount">90% OFF</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
                  {cat.name}
                </h3>
                <div style={{ fontSize: '0.82rem', color: '#990000', fontWeight: 700, marginBottom: '8px' }}>
                  {cat.tagline}
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '18px' }}>
                  {cat.description}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px dashed #fed7aa',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                  {categoryProducts.length} Products
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: '#990000',
                  }}
                >
                  <span>Explore</span>
                  <ArrowRight size={15} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
