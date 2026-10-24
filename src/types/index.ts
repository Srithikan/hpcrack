export type ProductCategory =
  | 'Sparklers'
  | 'Flower Pots'
  | 'Ground Chakkar'
  | 'Single Sound'
  | 'Atom Bombs'
  | 'Rockets'
  | 'Twinkling Star'
  | 'Peacock Fancy'
  | 'Kids Fancy'
  | 'Wounderfull Fountains'
  | 'Special Fancy'
  | 'Kids Favorites'
  | 'Mega Bomb'
  | 'Multi Sound Crackers (Mothers)'
  | 'Single Sky Shot'
  | 'Fantacy Shots'
  | 'Colour Shot Rider'
  | 'Multi Colour Sky Shot';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: string;
  originalPrice: number;
  discountPercentage: number;
  image: string;
  badge?: string;
  description?: string;
  enabled?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
  whatsappDestination?: string;
}

export interface PricingCalculation {
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  discountedPrice: number;
  savingsPerUnit: number;
}

export interface CartSummary {
  totalItemTypes: number;
  totalQuantity: number;
  totalOriginalValue: number;
  totalSavings: number;
  grandTotal: number;
}

export type ActiveTab = 'home' | 'products' | 'categories' | 'instructions' | 'cart' | 'checkout';
