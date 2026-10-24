import React from 'react';
import type { CartSummary } from '../types';
import { formatINR } from '../utils/calculations';
import { ShoppingCart, ArrowRight } from 'lucide-react';

interface FloatingCartBarProps {
  summary: CartSummary;
  onOpenCart: () => void;
  onProceedCheckout: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  summary,
  onOpenCart,
  onProceedCheckout,
}) => {
  if (summary.totalQuantity <= 0) return null;

  return (
    <aside className="floating-cart-bar" aria-label="Quick cart bar">
      <div className="floating-cart-container">
        <div className="floating-cart-info" onClick={onOpenCart} style={{ cursor: 'pointer' }}>
          <div className="floating-count-badge">
            <ShoppingCart size={15} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {summary.totalQuantity} {summary.totalQuantity === 1 ? 'Item' : 'Items'}
          </div>

          <div className="floating-price-info">
            <span className="floating-total-label hide-on-mobile">Final Order Total</span>
            <div className="floating-amount-row">
              <span className="floating-total-amount">{formatINR(summary.grandTotal)}</span>
              <span className="floating-savings-note">
                (Saved {formatINR(summary.totalSavings)})
              </span>
            </div>
          </div>
        </div>

        <div className="floating-actions-group">
          <button
            type="button"
            className="floating-review-btn hide-on-mobile"
            onClick={onOpenCart}
          >
            Review Cart
          </button>
          <button
            type="button"
            className="floating-cta-btn"
            onClick={onProceedCheckout}
            id="floating-checkout-btn"
          >
            <span>Checkout</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
