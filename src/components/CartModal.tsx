import React from 'react';
import type { CartItem, CartSummary } from '../types';
import { formatINR, calculateProductPricing } from '../utils/calculations';
import { X, Trash2, ArrowRight, Minus, Plus, ShoppingBag, FileDown } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';
import { generateOrderPDF } from '../utils/pdfGenerator';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  summary: CartSummary;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cart,
  summary,
  onQuantityChange,
  onClearCart,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  if (!isOpen) return null;

  const activeCart = cart.filter((item) => item.quantity > 0);

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="cart-modal-container">
        {/* Header */}
        <div className="cart-modal-header">
          <h2 className="cart-modal-title" id="cart-title">
            <ShoppingBag size={22} color="#fef08a" />
            <span>Your Festival Crackers Cart</span>
            <span style={{ fontSize: '0.85rem', color: '#fed7aa', fontWeight: 600 }}>
              ({summary.totalQuantity} items)
            </span>
          </h2>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close cart modal">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {activeCart.length > 0 ? (
          <>
            <div className="cart-items-scroll-area">
              {/* Desktop Table */}
              <div className="cart-desktop-table-wrapper">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Unit</th>
                      <th>Price (90% Off)</th>
                      <th style={{ textAlign: 'center' }}>Quantity</th>
                      <th style={{ textAlign: 'right' }}>Subtotal</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCart.map((item) => {
                      const pricing = calculateProductPricing(
                        item.product.originalPrice,
                        item.product.discountPercentage
                      );
                      const subtotal = pricing.discountedPrice * item.quantity;
                      const originalSubtotal = pricing.originalPrice * item.quantity;

                      return (
                        <tr key={item.product.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '48px', height: '40px', borderRadius: '4px', overflow: 'hidden' }}>
                                <ProductArtwork product={item.product} size="sm" />
                              </div>
                              <div>
                                <div className="cart-item-title">{item.product.name}</div>
                                <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>
                                  {pricing.discountPercentage}% OFF
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="cart-item-unit">{item.product.unit}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 800, color: '#990000', fontSize: '1rem' }}>
                                {formatINR(pricing.discountedPrice)}
                              </span>
                              <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                                {formatINR(pricing.originalPrice)}
                              </span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div
                              className="qty-control-box"
                              style={{ maxWidth: '110px', margin: '0 auto', height: '36px' }}
                            >
                              <button
                                type="button"
                                className="qty-btn"
                                style={{ width: '32px', height: '36px' }}
                                onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  onQuantityChange(item.product.id, isNaN(val) ? 0 : Math.max(0, val));
                                }}
                                className="qty-number-input"
                                style={{ height: '36px', fontSize: '0.95rem' }}
                              />
                              <button
                                type="button"
                                className="qty-btn"
                                style={{ width: '32px', height: '36px' }}
                                onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <span style={{ fontWeight: 800, color: '#15803d', fontSize: '1.05rem' }}>
                                {formatINR(subtotal)}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Save {formatINR(originalSubtotal - subtotal)}
                              </span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              type="button"
                              className="cart-item-remove-btn"
                              onClick={() => onQuantityChange(item.product.id, 0)}
                              title="Remove product"
                              aria-label={`Remove ${item.product.name}`}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Dedicated Touch Card List */}
              <div className="cart-mobile-cards-list">
                {activeCart.map((item) => {
                  const pricing = calculateProductPricing(
                    item.product.originalPrice,
                    item.product.discountPercentage
                  );
                  const subtotal = pricing.discountedPrice * item.quantity;
                  const originalSubtotal = pricing.originalPrice * item.quantity;

                  return (
                    <div key={`m-${item.product.id}`} className="cart-mobile-item-card">
                      <div className="cart-mobile-item-header">
                        <div style={{ width: '56px', height: '46px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                          <ProductArtwork product={item.product} size="sm" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="cart-item-title" style={{ fontSize: '0.92rem', lineHeight: '1.2' }}>
                            {item.product.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span className="cart-item-unit">{item.product.unit}</span>
                            <span style={{ fontSize: '0.72rem', color: '#dc2626', fontWeight: 700 }}>
                              {pricing.discountPercentage}% OFF
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                            <span style={{ fontWeight: 800, color: '#990000', fontSize: '1rem' }}>
                              {formatINR(pricing.discountedPrice)}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                              {formatINR(pricing.originalPrice)}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => onQuantityChange(item.product.id, 0)}
                          aria-label={`Remove ${item.product.name}`}
                          style={{ alignSelf: 'flex-start', padding: '4px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="cart-mobile-item-bottom">
                        <div className="qty-control-box" style={{ width: '120px', height: '36px' }}>
                          <button
                            type="button"
                            className="qty-btn"
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              onQuantityChange(item.product.id, isNaN(val) ? 0 : Math.max(0, val));
                            }}
                            className="qty-number-input"
                            style={{ height: '36px', fontSize: '0.95rem' }}
                          />
                          <button
                            type="button"
                            className="qty-btn"
                            style={{ width: '36px', height: '36px' }}
                            onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                            Subtotal (Save {formatINR(originalSubtotal - subtotal)})
                          </div>
                          <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1.1rem' }}>
                            {formatINR(subtotal)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calculations and Breakdown Box */}
            <div className="cart-summary-box">
              <div className="summary-stats-grid">
                <div className="summary-stat-card">
                  <div className="stat-label">Total Product Types</div>
                  <div className="stat-value">{summary.totalItemTypes} Varieties</div>
                </div>

                <div className="summary-stat-card">
                  <div className="stat-label">Total Quantity</div>
                  <div className="stat-value">{summary.totalQuantity} Boxes / Packs</div>
                </div>

                <div className="summary-stat-card">
                  <div className="stat-label">Total Original Value</div>
                  <div className="stat-value" style={{ textDecoration: 'line-through', color: '#94a3b8' }}>
                    {formatINR(summary.totalOriginalValue)}
                  </div>
                </div>

                <div className="summary-stat-card" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <div className="stat-label" style={{ color: '#166534' }}>Total Discount Savings (90%)</div>
                  <div className="stat-value savings">{formatINR(summary.totalSavings)}</div>
                </div>

                <div className="summary-stat-card" style={{ background: '#fef2f2', borderColor: '#fca5a5' }}>
                  <div className="stat-label" style={{ color: '#990000' }}>Final Payable Amount</div>
                  <div className="stat-value grand-total">{formatINR(summary.grandTotal)}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="cart-footer-actions">
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button type="button" className="clear-cart-btn" onClick={onClearCart}>
                    <Trash2 size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    Clear Entire Cart
                  </button>
                  <button
                    type="button"
                    className="clear-cart-btn"
                    style={{ color: '#334155', borderColor: '#cbd5e1' }}
                    onClick={onContinueShopping}
                  >
                    + Add More Crackers
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="clear-cart-btn"
                    style={{ color: '#990000', borderColor: '#fca5a5', background: '#fef2f2', fontWeight: 700 }}
                    onClick={() => generateOrderPDF({ name: '', phone: '', address: '' }, activeCart, summary)}
                    title="Download Order PDF sheet"
                  >
                    <FileDown size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    Download PDF
                  </button>

                  <button
                    type="button"
                    className="checkout-proceed-btn"
                    onClick={onProceedToCheckout}
                    id="cart-proceed-checkout-btn"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart-state">
            <div className="empty-cart-icon">🛒</div>
            <h3 className="empty-cart-title">Your Cart is Empty</h3>
            <p className="empty-cart-sub">
              You haven't added any crackers yet! Browse our Sivakasi fireworks collection with flat 90% off.
            </p>
            <button
              type="button"
              className="checkout-proceed-btn"
              onClick={onContinueShopping}
              style={{ margin: '0 auto' }}
            >
              Start Shopping Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
