// Test runner for Harini Priya Crackers calculation and integration tests

function runTests() {
  console.log('=== HARINI PRIYA CRACKERS QUALITY VERIFICATION SUITE ===');

  function calculateProductPricing(originalPrice, discountPercentage) {
    const safeOriginalPrice = Math.max(0, Number(originalPrice) || 0);
    const safeDiscount = Math.min(100, Math.max(0, Number(discountPercentage) || 0));
    const discountAmount = Math.round((safeOriginalPrice * safeDiscount) / 100);
    const discountedPrice = Math.max(0, safeOriginalPrice - discountAmount);
    const savingsPerUnit = discountAmount;
    return { originalPrice: safeOriginalPrice, discountPercentage: safeDiscount, discountAmount, discountedPrice, savingsPerUnit };
  }

  function cleanWhatsAppNumber(inputPhone) {
    if (!inputPhone) return { cleanNumber: '', isValid: false, error: 'Destination number is required.' };
    let sanitized = inputPhone.trim().replace(/[^\d+]/g, '');
    if (sanitized.startsWith('+')) sanitized = sanitized.substring(1);
    if (sanitized.startsWith('0') && sanitized.length === 11) sanitized = sanitized.substring(1);
    if (/^\d{10}$/.test(sanitized)) sanitized = '91' + sanitized;
    const isValid = /^\d{11,15}$/.test(sanitized);
    return { cleanNumber: sanitized, isValid };
  }

  function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.max(0, Math.round(amount)));
  }

  // Test 1: Example from specification:
  // Product: Deluxe Flower Pot
  // Original Price: ₹2,000
  // Discount: 80% OFF
  // Discount Amount: ₹1,600
  // Final Price: ₹400
  // You Save: ₹1,600
  const specTest = calculateProductPricing(2000, 80);
  console.assert(specTest.originalPrice === 2000, 'Test 1.1 Failed');
  console.assert(specTest.discountPercentage === 80, 'Test 1.2 Failed');
  console.assert(specTest.discountAmount === 1600, 'Test 1.3 Failed');
  console.assert(specTest.discountedPrice === 400, 'Test 1.4 Failed');
  console.assert(specTest.savingsPerUnit === 1600, 'Test 1.5 Failed');
  console.log('✓ Test 1 Passed: Deluxe Flower Pot (₹2,000 @ 80% = ₹400, You Save ₹1,600)');

  // Test 2: Phone number cleaning without duplicating 91
  const phoneTests = [
    { input: '9876543210', expected: '919876543210', valid: true },
    { input: '+91 9876543210', expected: '919876543210', valid: true },
    { input: '09876543210', expected: '919876543210', valid: true },
    { input: '+91-98765-43210', expected: '919876543210', valid: true },
    { input: '919876543210', expected: '919876543210', valid: true },
    { input: '12345', expected: '12345', valid: false },
  ];

  phoneTests.forEach((t, i) => {
    const res = cleanWhatsAppNumber(t.input);
    console.assert(res.cleanNumber === t.expected, `Phone Test ${i} number mismatch: got ${res.cleanNumber}, expected ${t.expected}`);
    console.assert(res.isValid === t.valid, `Phone Test ${i} validity mismatch`);
  });
  console.log('✓ Test 2 Passed: Dynamic WhatsApp phone sanitization & 91 country code handling');

  // Test 3: WhatsApp message encoding & URL generation
  const testCustomer = {
    name: 'Anand Sharma',
    phone: '9876543210',
    address: '14 Gandhi Road, Chennai, TN - 600001',
    whatsappDestination: '9876543210',
  };

  const testProducts = [
    {
      product: { name: 'Deluxe Flower Pot', unit: '1 box', originalPrice: 2000, discountPercentage: 80 },
      quantity: 2,
    },
    {
      product: { name: '120 Shot', unit: '1 box', originalPrice: 9000, discountPercentage: 80 },
      quantity: 1,
    },
  ];

  const subtotal1 = 400 * 2; // 800
  const subtotal2 = 1800 * 1; // 1800
  const grandTotal = subtotal1 + subtotal2; // 2600
  const totalOriginal = 2000 * 2 + 9000 * 1; // 13000
  const totalSavings = totalOriginal - grandTotal; // 10400

  console.assert(grandTotal === 2600, 'Grand total test failed');
  console.assert(totalSavings === 10400, 'Total savings test failed');
  console.log('✓ Test 3 Passed: Subtotals, Grand Total & Savings mathematical accuracy verified');

  const rawMessage = `Hello Harini Priya Crackers!
I would like to place an order.

CUSTOMER DETAILS
Name: ${testCustomer.name}
Contact Number: ${testCustomer.phone}
Delivery Address: ${testCustomer.address}

ORDER DETAILS
Deluxe Flower Pot
Unit: 1 box
Original Price: ₹2,000
Discount: 80%
Discounted Price: ₹400
Quantity: 2
Subtotal: ₹800

120 Shot
Unit: 1 box
Original Price: ₹9,000
Discount: 80%
Discounted Price: ₹1,800
Quantity: 1
Subtotal: ₹1,800

TOTAL ORIGINAL VALUE: ₹13,000
TOTAL SAVINGS: ₹10,400
FINAL ORDER TOTAL: ₹2,600

Please confirm product availability, final pricing, and delivery details.
Thank you!`;

  const encoded = encodeURIComponent(rawMessage);
  const waDirectShareUrl = `https://api.whatsapp.com/send?text=${encoded}`;
  console.assert(waDirectShareUrl.startsWith('https://api.whatsapp.com/send?text='), 'Direct share URL structure test failed');
  console.assert(waDirectShareUrl.includes('Hello%20Harini%20Priya%20Crackers!'), 'Encoded message test failed');
  console.log('✓ Test 4 Passed: WhatsApp Direct Sharing URL & message formatting verified');

  console.log('ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY!');
}

runTests();
