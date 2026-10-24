import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CartItem, CartSummary, CustomerDetails } from '../types';
import { calculateProductPricing, formatINR } from './calculations';

export interface BuiltOrderPDF {
  doc: jsPDF;
  filename: string;
  orderId: string;
}

/**
 * Safe currency formatter for jsPDF standard Helvetica font (avoids Unicode ₹ corruption into ¹)
 */
function formatPDFCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rs. 0';
  }
  const cleanAmount = Math.max(0, Math.round(amount));
  return `Rs. ${new Intl.NumberFormat('en-IN').format(cleanAmount)}`;
}

export function buildOrderPDF(
  customer: CustomerDetails,
  cart: CartItem[],
  summary: CartSummary
): BuiltOrderPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const activeCart = cart.filter((item) => item.quantity > 0);
  const orderId = `HPC-${Date.now().toString().slice(-6)}`;
  const orderDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Top Festive Header
  doc.setFillColor(153, 0, 0); // #990000 Festive Red
  doc.rect(0, 0, 210, 36, 'F');

  // Gold accent bar
  doc.setFillColor(245, 158, 11); // #f59e0b Gold
  doc.rect(0, 36, 210, 3, 'F');

  // Brand Name
  doc.setTextColor(254, 240, 138); // Soft Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('HARINI PRIYA CRACKERS', 14, 18);

  // Subtitle
  doc.setTextColor(254, 215, 170); // Light Peach
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Authentic Sivakasi Quality Fireworks • Wholesale & Festival Orders', 14, 25);

  // Order Sheet Label on Right
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ORDER SHEET', 196, 17, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Order Ref: ${orderId}`, 196, 24, { align: 'right' });
  doc.text(`Date: ${orderDate}`, 196, 30, { align: 'right' });

  // Customer Details Section Box
  doc.setFillColor(255, 248, 240);
  doc.roundedRect(14, 44, 182, 34, 3, 3, 'F');
  doc.setDrawColor(254, 215, 170);
  doc.roundedRect(14, 44, 182, 34, 3, 3, 'S');

  doc.setTextColor(153, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('CUSTOMER DETAILS', 20, 52);

  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Name:', 20, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(customer.name.trim() || 'Valued Customer', 48, 60);

  doc.setFont('helvetica', 'bold');
  doc.text('Contact No:', 20, 67);
  doc.setFont('helvetica', 'normal');
  doc.text(customer.phone.trim() || 'N/A', 48, 67);

  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Address:', 20, 74);
  doc.setFont('helvetica', 'normal');
  // Truncate or wrap address if long
  const splitAddress = doc.splitTextToSize(customer.address.trim() || 'N/A', 130);
  doc.text(splitAddress, 55, 74);

  // Build Table Data: Product, Unit, Discount Price, Quantity, Subtotal
  const tableRows = activeCart.map((item, index) => {
    const pricing = calculateProductPricing(
      item.product.originalPrice,
      item.product.discountPercentage
    );
    const subtotal = pricing.discountedPrice * item.quantity;

    return [
      (index + 1).toString(),
      item.product.name,
      item.product.unit,
      formatPDFCurrency(pricing.discountedPrice),
      item.quantity.toString(),
      formatPDFCurrency(subtotal),
    ];
  });

  // Render Table using autoTable
  autoTable(doc, {
    startY: 84,
    head: [['#', 'Product Name', 'Unit', 'Discount Price', 'Qty', 'Subtotal']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [153, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    bodyStyles: {
      textColor: [31, 41, 55],
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
      2: { cellWidth: 24 },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 14, halign: 'center' },
      5: { cellWidth: 32, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [255, 251, 245],
    },
    margin: { left: 14, right: 14 },
  });

  // Get bottom of table
  const finalY = (doc as any).lastAutoTable?.finalY || 180;

  // Multi-page check: if table ends near the bottom, add a new page for the summary
  let summaryBoxY = finalY + 8;
  if (summaryBoxY + 45 > 280) {
    doc.addPage();
    summaryBoxY = 20;
  }

  // Order Summary Box
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(110, summaryBoxY, 86, 38, 2, 2, 'F');
  doc.setDrawColor(252, 165, 165);
  doc.roundedRect(110, summaryBoxY, 86, 38, 2, 2, 'S');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Original Value:', 116, summaryBoxY + 8);
  doc.text(formatPDFCurrency(summary.totalOriginalValue), 190, summaryBoxY + 8, { align: 'right' });

  doc.setTextColor(22, 163, 74); // Green
  doc.setFont('helvetica', 'bold');
  doc.text('Total Festive Savings (90%):', 116, summaryBoxY + 16);
  doc.text(`-${formatPDFCurrency(summary.totalSavings)}`, 190, summaryBoxY + 16, { align: 'right' });

  doc.setDrawColor(254, 202, 202);
  doc.line(116, summaryBoxY + 21, 190, summaryBoxY + 21);

  doc.setTextColor(153, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('FINAL ORDER TOTAL:', 116, summaryBoxY + 30);
  doc.text(formatPDFCurrency(summary.grandTotal), 190, summaryBoxY + 30, { align: 'right' });

  // Thank you note
  const footerY = Math.min(summaryBoxY + 46, 285);
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Thank you for ordering with Harini Priya Crackers! All items are directly packed from Sivakasi.',
    14,
    footerY
  );
  doc.text(
    'Please share this PDF or confirmation on WhatsApp to schedule dispatch and transport booking.',
    14,
    footerY + 5
  );

  const cleanCustomerName = (customer.name.trim() || 'Customer').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Harini_Priya_Crackers_Order_${cleanCustomerName}.pdf`;

  return { doc, filename, orderId };
}

/**
 * Downloads the Order PDF directly to customer device
 */
export function generateOrderPDF(
  customer: CustomerDetails,
  cart: CartItem[],
  summary: CartSummary
): void {
  const { doc, filename } = buildOrderPDF(customer, cart, summary);
  doc.save(filename);
}

/**
 * Shares the PDF file directly via Web Share API (native on mobile into WhatsApp)
 * or falls back to downloading the PDF and opening WhatsApp with reference details
 */
export async function shareOrderAsPDF(
  customer: CustomerDetails,
  cart: CartItem[],
  summary: CartSummary
): Promise<{ sharedDirectly: boolean; orderId: string; filename: string }> {
  const { doc, filename, orderId } = buildOrderPDF(customer, cart, summary);
  const pdfBlob = doc.output('blob');
  const pdfFile = new File([pdfBlob], filename, { type: 'application/pdf' });

  // 1. Try Native Web Share API with File (Mobile Chrome / Safari -> WhatsApp)
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: 'Harini Priya Crackers - Order Sheet',
        text: `Hello Harini Priya Crackers! Here is my Order Sheet PDF (Ref: ${orderId}) for ${customer.name.trim() || 'Customer'}. Total: ${formatINR(summary.grandTotal)}`,
      });
      return { sharedDirectly: true, orderId, filename };
    } catch (shareErr: any) {
      if (shareErr.name === 'AbortError') {
        // User cancelled share picker
        return { sharedDirectly: true, orderId, filename };
      }
      console.warn('Native share failed, using fallback download + WhatsApp', shareErr);
    }
  }

  // 2. Fallback for Desktop/Non-share browsers:
  // Automatically download the PDF to device
  doc.save(filename);

  // And open WhatsApp with reference to attach the PDF
  const whatsappMsg = `Hello Harini Priya Crackers!
I would like to place an order.

CUSTOMER DETAILS
Name: ${customer.name.trim()}
Contact: ${customer.phone.trim()}
Address: ${customer.address.trim()}

ORDER SHEET (Ref: ${orderId})
Total Items: ${summary.totalQuantity} items (${summary.totalItemTypes} varieties)
Total Original Value: ${formatINR(summary.totalOriginalValue)}
Total Savings (90%): -${formatINR(summary.totalSavings)}
FINAL ORDER TOTAL: ${formatINR(summary.grandTotal)}

📄 I have generated & downloaded my official Order PDF (${filename}) and attaching it here.
Please confirm availability and dispatch details. Thank you!`;

  const encoded = encodeURIComponent(whatsappMsg);
  const targetUrl = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(targetUrl, '_blank', 'noopener,noreferrer');

  return { sharedDirectly: false, orderId, filename };
}
