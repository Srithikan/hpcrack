import React from 'react';
import type { CartItem, CartSummary, CustomerDetails } from '../types';
import {
  formatINR,
  calculateProductPricing,
  generateWhatsAppOrderUrl,
} from '../utils/calculations';
import {
  X,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Copy,
  FileDown,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateOrderPDF, shareOrderAsPDF } from '../utils/pdfGenerator';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToCart: () => void;
  cart: CartItem[];
  summary: CartSummary;
  customer: CustomerDetails;
  onCustomerChange: (updated: CustomerDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onBackToCart,
  cart,
  summary,
  customer,
  onCustomerChange,
}) => {
  if (!isOpen) return null;

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isCopied, setIsCopied] = React.useState(false);
  const [preparedUrl, setPreparedUrl] = React.useState<string>('');
  const [preparedMessage, setPreparedMessage] = React.useState<string>('');
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);

  const activeCart = cart.filter((item) => item.quantity > 0);

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    onCustomerChange({
      ...customer,
      [field]: value,
    });
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!customer.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!customer.phone.trim()) {
      newErrors.phone = 'Please enter your contact mobile number.';
    } else {
      const sanitized = customer.phone.replace(/[^\d]/g, '');
      if (sanitized.length < 10) {
        newErrors.phone = 'Contact number must be at least 10 digits.';
      }
    }

    if (!customer.address.trim()) {
      newErrors.address = 'Please enter complete delivery address including city and pincode.';
    } else if (customer.address.trim().length < 10) {
      newErrors.address = 'Please provide a detailed address for safe delivery.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSharing, setIsSharing] = React.useState(false);
  const [downloadedFilename, setDownloadedFilename] = React.useState('');

  const handleShareOrderAsPDF = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSharing(true);

    // Launch celebratory fireworks confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#dc2626', '#f59e0b', '#fbbf24', '#16a34a', '#ffffff'],
      });
    } catch (err) {
      // ignore
    }

    try {
      const res = await shareOrderAsPDF(customer, activeCart, summary);
      setDownloadedFilename(res.filename);

      const whatsAppRes = generateWhatsAppOrderUrl(customer, activeCart, summary);
      setPreparedUrl(whatsAppRes.url);
      setPreparedMessage(whatsAppRes.rawMessage);

      if (!res.sharedDirectly) {
        setShowPreviewModal(true);
      }
    } catch (err) {
      console.error('Error sharing PDF:', err);
      generateOrderPDF(customer, activeCart, summary);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPDF = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      generateOrderPDF(customer, activeCart, summary);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#f59e0b', '#fbbf24', '#16a34a', '#ffffff'],
        });
      } catch (cErr) {
        // ignore
      }
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleCopyMessage = () => {
    if (preparedMessage) {
      navigator.clipboard.writeText(preparedMessage);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
      <div className="checkout-modal-container">
        {/* Header */}
        <div className="cart-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="close-modal-btn"
              onClick={onBackToCart}
              title="Back to Cart"
              aria-label="Back to Cart"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              <ArrowLeft size={18} />
            </button>
            <h2 className="cart-modal-title" id="checkout-title">
              <span>Checkout &amp; WhatsApp / PDF Order</span>
            </h2>
          </div>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close checkout modal">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleShareOrderAsPDF} className="checkout-form-scroll">
          {/* PDF & WhatsApp direct sharing banner */}
          <div className="whatsapp-notice-banner" style={{ background: '#f0fdf4', borderColor: '#86efac' }}>
            <FileDown className="whatsapp-notice-icon" size={26} color="#16a34a" />
            <div className="whatsapp-notice-text">
              <strong style={{ color: '#166534' }}>Share as Official Order PDF:</strong> When you tap <em>"Share Order as PDF"</em> below,
              your official Harini Priya Crackers Order Sheet PDF is generated and shared directly to WhatsApp!
            </div>
          </div>

          {/* Customer Details Form Fields */}
          <div className="form-group">
            <label className="form-label" htmlFor="customer-name">
              <span>
                <User size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Customer Full Name
                <span className="required-star">*</span>
              </span>
            </label>
            <input
              type="text"
              id="customer-name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Rajesh Kumar"
              value={customer.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            {errors.name && <span className="field-error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-phone">
              <span>
                <Phone size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Customer Contact Number
                <span className="required-star">*</span>
              </span>
            </label>
            <input
              type="tel"
              id="customer-phone"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="e.g. 9876543210 (10-digit mobile number)"
              value={customer.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
            {errors.phone && <span className="field-error-text">{errors.phone}</span>}
            <span className="field-hint-text">Used by courier and delivery partner to contact you upon dispatch.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customer-address">
              <span>
                <MapPin size={15} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Complete Delivery Address
                <span className="required-star">*</span>
              </span>
            </label>
            <textarea
              id="customer-address"
              rows={3}
              className={`form-textarea ${errors.address ? 'error' : ''}`}
              placeholder="Door No, Street name, Landmark, City, State and Pincode..."
              value={customer.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
            {errors.address && <span className="field-error-text">{errors.address}</span>}
          </div>

          {/* Complete Order Review Summary */}
          <div className="order-review-summary-card">
            <div className="order-review-title">
              <span>Review Order Summary ({summary.totalQuantity} items)</span>
            </div>

            <div className="review-items-mini-list">
              {activeCart.map((item) => {
                const pricing = calculateProductPricing(
                  item.product.originalPrice,
                  item.product.discountPercentage
                );
                const subtotal = pricing.discountedPrice * item.quantity;
                return (
                  <div key={item.product.id} className="review-item-mini-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px dashed #fde68a' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.92rem' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                        Unit: <strong>{item.product.unit}</strong> • Discount Price: <strong style={{ color: '#990000' }}>{formatINR(pricing.discountedPrice)}</strong> × {item.quantity}
                      </div>
                    </div>
                    <span style={{ fontWeight: 800, color: '#990000', fontSize: '1rem' }}>
                      {formatINR(subtotal)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '10px', borderTop: '1px solid #fed7aa', marginTop: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                <span>Total Original Value:</span>
                <span style={{ textDecoration: 'line-through' }}>{formatINR(summary.totalOriginalValue)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#16a34a', fontWeight: 700 }}>
                <span>Total Festive Savings (90% Off):</span>
                <span>-{formatINR(summary.totalSavings)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', color: '#990000', fontWeight: 800, marginTop: '4px' }}>
                <span>Final Payable Amount:</span>
                <span>{formatINR(summary.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
            <button
              type="button"
              className="clear-cart-btn"
              onClick={onBackToCart}
              style={{ color: '#475569', borderColor: '#cbd5e1' }}
            >
              <ArrowLeft size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Back
            </button>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="clear-cart-btn"
                onClick={handleDownloadPDF}
                id="download-order-pdf-btn"
                style={{
                  background: '#fff',
                  color: '#990000',
                  borderColor: '#fca5a5',
                  fontWeight: 700,
                }}
              >
                <FileDown size={17} color="#990000" />
                <span>Download PDF</span>
              </button>

              <button
                type="submit"
                className="checkout-proceed-btn"
                style={{
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#fff',
                  borderColor: '#86efac',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                }}
                id="confirm-share-pdf-btn"
                disabled={isSharing}
              >
                <Share2 size={18} />
                <span>{isSharing ? 'Generating PDF...' : 'Share Order as PDF'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Post-Submit Helper Dialog */}
        {showPreviewModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '100%',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                border: '2px solid #22c55e',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <CheckCircle2 size={48} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#14532d' }}>
                  Order PDF Ready &amp; WhatsApp Opened!
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4b5563', marginTop: '4px' }}>
                  Your official Order Sheet PDF <strong>{downloadedFilename ? `(${downloadedFilename})` : ''}</strong> has been downloaded to your device, and WhatsApp has opened.
                  Simply attach the downloaded PDF into WhatsApp to send to Harini Priya Crackers!
                </p>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.8rem',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  color: '#334155',
                  marginBottom: '16px',
                }}
              >
                {preparedMessage}
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="clear-cart-btn"
                  onClick={handleCopyMessage}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Copy size={16} />
                  <span>{isCopied ? 'Copied Text!' : 'Copy Text'}</span>
                </button>
                <button
                  type="button"
                  className="checkout-proceed-btn"
                  onClick={handleDownloadPDF}
                  style={{ background: '#990000', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileDown size={16} color="#fef08a" />
                  <span>Re-download PDF</span>
                </button>
                <a
                  href={preparedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="checkout-proceed-btn"
                  style={{ textDecoration: 'none', background: '#16a34a', color: '#fff' }}
                >
                  Re-open WhatsApp
                </a>
                <button
                  type="button"
                  className="clear-cart-btn"
                  onClick={() => {
                    setShowPreviewModal(false);
                    onClose();
                  }}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
