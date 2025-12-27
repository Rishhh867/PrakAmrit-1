
export type ProductForm = 'raw' | 'powder';
export type Quantity = '250g' | '500g' | '1kg' | '5kg' | '10kg' | '25kg' | '50kg' | string;
export type Dosha = 'Vata' | 'Pitta' | 'Kapha';

export interface Product {
  id: string;
  name: string;
  botanicalName: string;
  description: string;
  basePrice: number; // Price per 1kg Raw
  powderPrice: number; // Price per 1kg Powder
  image: string;
  benefits: string[];
  doshas: Dosha[];
}

export interface CartItem {
  productId: string;
  productName: string;
  form: ProductForm;
  quantity: Quantity; // For custom blends, we might map to nearest or store custom string in a real app, but sticking to type for now
  customWeight?: number; // Added to support exact gram calculations from blending tool
  price: number;
  isSubscribed: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  businessName?: string; // Captured for B2B Quotes
  email: string;
  phone: string;
  whatsapp?: string; // Added for WhatsApp Business API Integration
  address: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Quote Requested' | 'Quotation Sent' | 'Completed';
  date: string;
  quotationFile?: string; // Mock file name
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

export interface BlendRecipe {
  id: string;
  title: string;
  description: string;
  ratios: Record<string, number>; // ProductID -> Percentage (0.0 to 1.0)
}
