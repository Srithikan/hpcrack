import React from 'react';
import type { Product } from '../types';
import { calculateProductPricing, formatINR } from '../utils/calculations';
import { ProductArtwork } from './ProductArtwork';
import { Minus, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onAddToCart: (product: Product, quantityToAdd: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
}) => {
  const pricing = calculateProductPricing(product.originalPrice, product.discountPercentage);
  const isItemInCart = quantity > 0;
  const currentSubtotal = pricing.discountedPrice * quantity;

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuantityChange(product.id, Math.max(0, quantity - 1));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuantityChange(product.id, quantity + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const safeVal = isNaN(val) ? 0 : Math.max(0, val);
    onQuantityChange(product.id, safeVal);
  };

  const handleAddFirst = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
  };

  return (
    <article className={`product-card ${isItemInCart ? 'in-cart-active' : ''}`} id={`product-${product.id}`}>
      {/* Media column / Artwork wrapper */}
      <div className="card-media-col">
        <div className="card-artwork-wrapper">
          <ProductArtwork product={product} size="md" />
          <span className="badge-discount">{pricing.discountPercentage}% OFF</span>
          {product.badge && <span className="badge-feature">{product.badge}</span>}
        </div>
      </div>

      {/* Details */}
      <div className="card-details">
        <div className="card-header-line">
          <span className="card-category-tag">{product.category}</span>
          <span className="card-selling-unit">Unit: {product.unit}</span>
        </div>

        <h3 className="card-product-name">{product.name}</h3>

        {product.description && (
          <p className="card-description" title={product.description}>
            {product.description}
          </p>
        )}

        {/* Pricing calculations section */}
        <div className="pricing-display-box">
          <div className="price-primary-group">
            <span className="final-price-value">
              {formatINR(pricing.discountedPrice)}
            </span>
            <span className="original-price-strikethrough">
              {formatINR(pricing.originalPrice)}
            </span>
            <span className="save-pill-tag">
              Save {formatINR(pricing.savingsPerUnit)}
            </span>
          </div>
          <span className="unit-label-desktop">/ {product.unit}</span>
        </div>

        {/* Quantity Controls / Add Button */}
        <div className="card-actions-row">
          {isItemInCart ? (
            <div className="active-cart-control-group">
              <div className="qty-control-box">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={handleDecrement}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>

                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={handleInputChange}
                  className="qty-number-input"
                  aria-label={`Quantity for ${product.name}`}
                />

                <button
                  type="button"
                  className="qty-btn"
                  onClick={handleIncrement}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <div className="card-subtotal-indicator">
                Subtotal: <strong>{formatINR(currentSubtotal)}</strong>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn-add-primary"
              onClick={handleAddFirst}
              aria-label={`Add ${product.name} to cart`}
              id={`add-btn-${product.id}`}
            >
              <Plus size={16} />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
