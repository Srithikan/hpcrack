import React from 'react';
import type { ActiveTab, CartSummary } from '../types';
import { ShoppingCart, BookOpen, Layers, Grid, Home } from 'lucide-react';
import { formatINR } from '../utils/calculations';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  summary: CartSummary;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  summary,
  onOpenCart,
}) => {
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="top-announcement-bar">
        <span className="announcement-badge">Mega Festival Sale</span>
        <span className="announcement-text">✨ HARINI PRIYA CRACKERS 2026: FLAT 90% DISCOUNT ON ALL 141+ CRACKERS! DIRECT SIVAKASI SUPPLY ✨</span>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="header-container">
          {/* Brand Logo & Title */}
          <div className="brand-wrapper" onClick={() => setActiveTab('home')}>
            <div className="brand-emblem">
              🎆
            </div>
            <div className="brand-text">
              <h1 className="brand-title">Harini Priya Crackers</h1>
              <span className="brand-subtitle">Authentic Sivakasi Quality Fireworks • Wholesale & Retail</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="header-nav">
            <button
              className={`nav-link-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <Home size={15} />
              <span>Home</span>
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Grid size={15} />
              <span>All Products</span>
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <Layers size={15} />
              <span>Categories</span>
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'instructions' ? 'active' : ''}`}
              onClick={() => setActiveTab('instructions')}
            >
              <BookOpen size={15} />
              <span>Order Guide</span>
            </button>
          </nav>

          {/* Cart Action Button */}
          <button
            className="header-cart-btn"
            onClick={onOpenCart}
            aria-label="View shopping cart"
          >
            <ShoppingCart size={17} />
            <span className="cart-btn-label">Cart</span>
            {summary.totalQuantity > 0 && (
              <>
                <span className="cart-counter-badge">{summary.totalQuantity}</span>
                <span className="cart-btn-total">
                  ({formatINR(summary.grandTotal)})
                </span>
              </>
            )}
          </button>
        </div>
      </header>
    </>
  );
};
