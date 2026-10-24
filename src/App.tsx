import React from 'react';
import type { ActiveTab, CartItem, CustomerDetails, Product } from './types';
import { loadStoredProducts } from './data/products';
import { calculateCartSummary } from './utils/calculations';

// Components
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { ProductList } from './components/ProductList';
import { CategoriesView } from './components/CategoriesView';
import { OrderInstructions } from './components/OrderInstructions';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { FloatingCartBar } from './components/FloatingCartBar';

const CART_STORAGE_KEY = 'harini_priya_cart_2026_v2';
const CUSTOMER_STORAGE_KEY = 'harini_priya_customer_2026_v2';

export function App() {
  // 1. Products state loaded from configuration
  const [products] = React.useState<Product[]>(() => loadStoredProducts());

  // 2. Active Tab / Page navigation
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('home');

  // 3. Category selection filter
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');

  // 4. Cart State persisted in localStorage
  const [cart, setCart] = React.useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
    }
    return [];
  });

  // Save cart whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // 5. Customer Details persisted in localStorage
  const [customer, setCustomer] = React.useState<CustomerDetails>(() => {
    try {
      const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.error('Failed to load customer details', e);
    }
    return {
      name: '',
      phone: '',
      address: '',
    };
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    } catch (e) {
      console.error('Failed to save customer details', e);
    }
  }, [customer]);

  // 6. Modal visibility states
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  // 7. Cart Map lookup for O(1) performance (productId -> quantity)
  const cartMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cart) {
      if (item.quantity > 0) {
        map[item.product.id] = item.quantity;
      }
    }
    return map;
  }, [cart]);

  // 8. Live Cart Summary Calculations
  const summary = React.useMemo(() => {
    return calculateCartSummary(cart);
  }, [cart]);

  // Handlers for cart modifications
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    const safeQty = Math.max(0, Math.floor(newQuantity));

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === productId);

      if (existingIndex > -1) {
        if (safeQty === 0) {
          // Remove from cart
          return prevCart.filter((item) => item.product.id !== productId);
        } else {
          // Update quantity
          const updated = [...prevCart];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: safeQty,
          };
          return updated;
        }
      } else if (safeQty > 0) {
        // Find product
        const prod = products.find((p) => p.id === productId);
        if (prod) {
          return [...prevCart, { product: prod, quantity: safeQty }];
        }
      }
      return prevCart;
    });
  };

  const handleAddToCart = (product: Product, quantityToAdd: number) => {
    const safeQtyToAdd = Math.max(1, Math.floor(quantityToAdd));

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + safeQtyToAdd,
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity: safeQtyToAdd }];
      }
    });
  };

  const handleClearCart = () => {
    if (cart.length === 0) return;
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      setCart([]);
      setIsCartOpen(false);
    }
  };

  // Navigation helpers
  const handleCategoryPillSelect = (catName: string) => {
    setSelectedCategory(catName);
    if (activeTab !== 'products') {
      setActiveTab('products');
    }
    // Smooth scroll down to products section
    const el = document.getElementById('products-section-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-page">
      {/* 1. Header with brand and live cart */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        summary={summary}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. Page Content Rendered Based On Active Tab */}
      <main style={{ flex: 1 }}>
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            {/* Quick Category Navigation Bar */}
            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryPillSelect}
              products={products}
            />

            <div id="products-section-anchor" className="products-section-container">
              <div className="products-hero-intro">
                <span className="hero-pill-badge">
                  🔥 Harini Priya Crackers 2026 Price List
                </span>
                <h2 className="products-main-heading">
                  Festival Mega Savings Collection (Flat 90% OFF)
                </h2>
                <p className="products-sub-heading">
                  Direct Sivakasi wholesale rates for Sparklers, Flower Pots, Chakkars, Bombs, Fountains, and Aerial Multi-Shots.
                </p>
              </div>

              {/* Product Grid */}
              <ProductList
                products={products}
                selectedCategory={selectedCategory}
                cartMap={cartMap}
                onQuantityChange={handleQuantityChange}
                onAddToCart={handleAddToCart}
              />
            </div>
          </>
        )}

        {/* ALL PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="products-section-container">
            <div className="products-hero-intro">
              <h2 className="products-main-heading">
                Complete Crackers Price List 2026
              </h2>
              <p className="products-sub-heading">
                Browse all 141+ Sivakasi crackers with automatic 90% discount calculation and instant quantity selectors.
              </p>
            </div>

            <CategoryNav
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              products={products}
            />

            <ProductList
              products={products}
              selectedCategory={selectedCategory}
              cartMap={cartMap}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <CategoriesView
            products={products}
            onSelectCategory={(catName) => {
              setSelectedCategory(catName);
              setActiveTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ORDER INSTRUCTIONS TAB */}
        {activeTab === 'instructions' && <OrderInstructions />}
      </main>

      {/* 3. Floating Bottom Cart Bar (Sticky when cart > 0) */}
      <FloatingCartBar
        summary={summary}
        onOpenCart={() => setIsCartOpen(true)}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 4. Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        summary={summary}
        onQuantityChange={handleQuantityChange}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => setIsCartOpen(false)}
      />

      {/* 5. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onBackToCart={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        cart={cart}
        summary={summary}
        customer={customer}
        onCustomerChange={setCustomer}
      />

      {/* Safe bottom spacing for mobile floating cart bar */}
      <div className="mobile-bottom-safe-spacer" />
    </div>
  );
}

export default App;
