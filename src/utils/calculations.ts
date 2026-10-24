import type { CartItem, CartSummary, CustomerDetails, PricingCalculation } from '../types';

/**
 * Format number into standard Indian Rupee format (e.g. ₹1,250, ₹10,000, ₹1,25,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  const cleanAmount = Math.max(0, Math.round(amount));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cleanAmount);
}

/**
 * Standardized single calculation function for product pricing
 */
export function calculateProductPricing(
  originalPrice: number,
  discountPercentage: number
): PricingCalculation {
  const safeOriginalPrice = Math.max(0, Number(originalPrice) || 0);
  const safeDiscount = Math.min(100, Math.max(0, Number(discountPercentage) || 0));

  const discountAmount = Math.round((safeOriginalPrice * safeDiscount) / 100);
  const discountedPrice = Math.max(0, safeOriginalPrice - discountAmount);
  const savingsPerUnit = discountAmount;

  return {
    originalPrice: safeOriginalPrice,
    discountPercentage: safeDiscount,
    discountAmount,
    discountedPrice,
    savingsPerUnit,
  };
}

/**
 * Calculate item subtotal based on discounted price and quantity
 */
export function calculateItemSubtotal(discountedPrice: number, quantity: number): number {
  const safePrice = Math.max(0, Number(discountedPrice) || 0);
  const safeQty = Math.max(0, Math.floor(Number(quantity) || 0));
  return safePrice * safeQty;
}

/**
 * Single calculation function for total cart summary
 */
export function calculateCartSummary(cart: CartItem[]): CartSummary {
  if (!cart || cart.length === 0) {
    return {
      totalItemTypes: 0,
      totalQuantity: 0,
      totalOriginalValue: 0,
      totalSavings: 0,
      grandTotal: 0,
    };
  }

  let totalQuantity = 0;
  let totalOriginalValue = 0;
  let totalSavings = 0;
  let grandTotal = 0;

  // Filter only items with quantity > 0
  const activeItems = cart.filter((item) => item.quantity > 0);

  for (const item of activeItems) {
    const qty = Math.max(0, Math.floor(Number(item.quantity) || 0));
    if (qty <= 0) continue;

    const pricing = calculateProductPricing(
      item.product.originalPrice,
      item.product.discountPercentage
    );

    const itemOriginalTotal = pricing.originalPrice * qty;
    const itemSubtotal = pricing.discountedPrice * qty;
    const itemSavings = (pricing.originalPrice - pricing.discountedPrice) * qty;

    totalQuantity += qty;
    totalOriginalValue += itemOriginalTotal;
    totalSavings += itemSavings;
    grandTotal += itemSubtotal;
  }

  return {
    totalItemTypes: activeItems.length,
    totalQuantity,
    totalOriginalValue,
    totalSavings,
    grandTotal,
  };
}

/**
 * Sanitize and normalize phone number for WhatsApp wa.me link.
 * Removes spaces, hyphens, brackets, and correctly formats the 91 country code without duplication.
 */
export function cleanWhatsAppNumber(inputPhone: string): { cleanNumber: string; isValid: boolean; error?: string } {
  if (!inputPhone) {
    return { cleanNumber: '', isValid: false, error: 'Destination number is required.' };
  }

  // Remove all non-digits except optional leading plus
  let sanitized = inputPhone.trim().replace(/[^\d+]/g, '');

  // Strip leading plus if present
  if (sanitized.startsWith('+')) {
    sanitized = sanitized.substring(1);
  }

  // If starts with 0 (e.g. 09876543210), strip the leading 0
  if (sanitized.startsWith('0') && sanitized.length === 11) {
    sanitized = sanitized.substring(1);
  }

  // Handle Indian number formats
  // If 10 digits, prepend 91
  if (/^\d{10}$/.test(sanitized)) {
    sanitized = '91' + sanitized;
  }

  // Validate format (country code + 10 digits, or standard international 10-15 digits)
  const isValid = /^\d{11,15}$/.test(sanitized);

  if (!isValid) {
    return {
      cleanNumber: sanitized,
      isValid: false,
      error: 'Please enter a valid 10-digit mobile number or standard international number.',
    };
  }

  return {
    cleanNumber: sanitized,
    isValid: true,
  };
}

/**
 * Build exact WhatsApp Click-to-Chat URL as specified in Section 8
 */
export function generateWhatsAppOrderUrl(
  customer: CustomerDetails,
  cart: CartItem[],
  summary: CartSummary
): { url: string; rawMessage: string; error?: string } {
  let targetUrl = 'https://api.whatsapp.com/send';

  if (customer.whatsappDestination && customer.whatsappDestination.trim()) {
    const numberCheck = cleanWhatsAppNumber(customer.whatsappDestination);
    if (numberCheck.isValid) {
      targetUrl = `https://wa.me/${numberCheck.cleanNumber}`;
    }
  }

  const activeItems = cart.filter((item) => item.quantity > 0);
  if (activeItems.length === 0) {
    return {
      url: '',
      rawMessage: '',
      error: 'Cart is empty. Please add items before checking out.',
    };
  }

  // Build simplified product lines: Product, Unit, Discount Price, Quantity
  const productLines = activeItems
    .map((item, index) => {
      const pricing = calculateProductPricing(
        item.product.originalPrice,
        item.product.discountPercentage
      );
      const subtotal = pricing.discountedPrice * item.quantity;
      const qtyInfo = item.quantity > 1 ? `\nQuantity: ${item.quantity}\nSubtotal: ${formatINR(subtotal)}` : `\nQuantity: 1`;

      return `${index + 1}. ${item.product.name}
Unit: ${item.product.unit}
Discount Price: ${formatINR(pricing.discountedPrice)}${qtyInfo}`;
    })
    .join('\n\n');

  // Exact message structure matching the prompt specifications:
  const rawMessage = `Hello Harini Priya Crackers!
I would like to place an order.

CUSTOMER DETAILS
Name: ${customer.name.trim()}
Contact Number: ${customer.phone.trim()}
Delivery Address: ${customer.address.trim()}

ORDER DETAILS
${productLines}

TOTAL ORIGINAL VALUE: ${formatINR(summary.totalOriginalValue)}
TOTAL SAVINGS: ${formatINR(summary.totalSavings)}
FINAL ORDER TOTAL: ${formatINR(summary.grandTotal)}

Please confirm product availability, final pricing, and delivery details.
Thank you!`;

  const encodedMessage = encodeURIComponent(rawMessage);
  const separator = targetUrl.includes('?') ? '&' : '?';
  const url = `${targetUrl}${separator}text=${encodedMessage}`;

  return {
    url,
    rawMessage,
  };
}
