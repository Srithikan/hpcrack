import React from 'react';
import { Sparkles, CheckCircle2, XCircle, Truck, ShieldAlert } from 'lucide-react';

export const OrderInstructions: React.FC = () => {
  return (
    <section className="instructions-section">
      {/* Header */}
      <div className="instructions-header">
        <span className="hero-pill-badge">
          <Sparkles size={14} />
          <span>Customer Ordering & Safety Manual</span>
        </span>
        <h2 className="instructions-main-title">How To Order & Safety Guide</h2>
        <p style={{ color: '#64748b', maxWidth: '700px', margin: '0 auto' }}>
          Welcome to Harini Priya Crackers! Follow our simple 4-step process to order your festival crackers,
          and please review our safety precautions to ensure a joyous and secure celebration for your family.
        </p>
      </div>

      {/* 4 Steps Guide */}
      <div className="instruction-steps-grid">
        <div className="step-card">
          <div className="step-number">1</div>
          <h3 className="step-title">Select Products</h3>
          <p className="step-desc">
            Browse our authentic 2026 catalogue across 18 categories with 141+ items. Use the plus and minus buttons to choose your desired quantities.
            Prices reflect a flat 90% festival discount.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <h3 className="step-title">Review Shopping Cart</h3>
          <p className="step-desc">
            Open the cart to review your itemized list, savings per product, total quantity, and final discounted payable amount.
            Adjust quantities anytime.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <h3 className="step-title">Enter Details</h3>
          <p className="step-desc">
            Provide your full name, contact mobile number, and complete delivery address for courier dispatch.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">4</div>
          <h3 className="step-title">Download PDF or WhatsApp</h3>
          <p className="step-desc">
            Click "Download Order PDF" to get a clean printable sheet, or tap "Open WhatsApp" to share your order directly with Harini Priya Crackers!
          </p>
        </div>
      </div>

      {/* Dispatch & Sivakasi Sourcing Info */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          border: '1.5px solid #fed7aa',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '40px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <Truck size={28} color="#9a3412" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#9a3412' }}>
            Direct Sivakasi Dispatch & Transportation Information
          </h3>
        </div>
        <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '12px' }}>
          All fireworks are manufactured in certified Sivakasi factories adhering to strict safety and chemical quality standards.
          Orders are packed in specialized heavy-duty corrugated cartons wrapped with waterproof tarpaulin sheets to guarantee zero moisture during transit.
        </p>
        <ul style={{ fontSize: '0.88rem', color: '#334155', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li>Consignments are booked via licensed and insured cargo transport operators.</li>
          <li>Once your order is confirmed via WhatsApp, dispatch tracking details and transport lorry receipts (LR) will be shared.</li>
          <li>Please order early before peak Diwali rush to ensure timely delivery.</li>
        </ul>
      </div>

      {/* Safety Precautions: Do's and Don'ts */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#990000', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={24} />
          <span>Firework Safety Precautions (Do's & Don'ts)</span>
        </h3>
      </div>

      <div className="safety-dos-donts">
        {/* DO's */}
        <div className="safety-box dos">
          <h4 className="safety-title" style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} />
            <span>DO'S — Safe Practices</span>
          </h4>
          <ul className="safety-list">
            <li>
              <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Always light crackers in open outdoor spaces away from buildings, vehicles, and dry grass.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Keep a bucket of clean water or sand ready nearby for emergencies and used sparkler immersion.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Always wear cotton clothing and sturdy footwear while lighting fireworks. Avoid loose synthetic garments.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Ensure children are strictly supervised by responsible adults at all times.</span>
            </li>
            <li>
              <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Light fireworks using an agarbatti (incense stick) or sparkler, keeping your body at arm's length.</span>
            </li>
          </ul>
        </div>

        {/* DON'TS */}
        <div className="safety-box donts">
          <h4 className="safety-title" style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={20} />
            <span>DON'TS — Strict Warnings</span>
          </h4>
          <ul className="safety-list">
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Never bend over fireworks while lighting the fuse. Never light crackers inside hand or throw them.</span>
            </li>
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Never attempt to relight or inspect a dud cracker that failed to go off immediately. Pour water on it.</span>
            </li>
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Never carry fireworks inside pocket or store them near electrical appliances or gas cylinders.</span>
            </li>
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Never tie multiple bombs or dismantle crackers to experiment with loose flash powder.</span>
            </li>
            <li>
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>Never burst loud crackers near hospitals, elderly persons, pregnant women, or domestic animals.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
