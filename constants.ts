
import { Product, BlendRecipe } from './types';

// Logic:
// 250g: 0.25 (Standard)
// 500g: 0.5 (Standard)
// 1kg: 1.0 (Standard)
// 5kg: 15% discount -> 5 * (1 - 0.15) = 4.25
// 10kg: 25% discount -> 10 * (1 - 0.25) = 7.5
// 25kg: 30% discount -> 25 * (1 - 0.30) = 17.5
// 50kg: 35% discount -> 50 * (1 - 0.35) = 32.5
export const QUANTITY_MULTIPLIERS: Record<string, number> = {
  '250g': 0.25,
  '500g': 0.5,
  '1kg': 1.0,
  '5kg': 4.25,
  '10kg': 7.5,
  '25kg': 17.5,
  '50kg': 32.5,
};

export const POWDER_SURCHARGE_PERCENT = 0.20; // Deprecated in favor of explicit powderPrice, kept for fallback

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Ashwagandha',
    botanicalName: 'Withania somnifera',
    description: 'Known as Indian Ginseng, Ashwagandha is a premier adaptogen helping the body manage stress.',
    basePrice: 1200, // Raw
    powderPrice: 1450, // Powder
    image: 'https://picsum.photos/seed/ashwagandha/400/300',
    benefits: ['Stress Relief', 'Energy Boost', 'Cognitive Health'],
    doshas: ['Vata', 'Kapha']
  },
  {
    id: '2',
    name: 'Turmeric (Haldi)',
    botanicalName: 'Curcuma longa',
    description: 'High curcumin content Lakadong turmeric sourced from organic farms in Meghalaya.',
    basePrice: 450,
    powderPrice: 550,
    image: 'https://picsum.photos/seed/turmeric/400/300',
    benefits: ['Anti-inflammatory', 'Immunity', 'Skin Health'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '3',
    name: 'Triphala',
    botanicalName: 'Polyherbal Formulation',
    description: 'A traditional Ayurvedic formulation consisting of Amla, Bibhitaki, and Haritaki.',
    basePrice: 600,
    powderPrice: 750,
    image: 'https://picsum.photos/seed/triphala/400/300',
    benefits: ['Digestion', 'Detoxification', 'Eye Health'],
    doshas: ['Vata', 'Pitta', 'Kapha']
  },
  {
    id: '4',
    name: 'Brahmi',
    botanicalName: 'Bacopa monnieri',
    description: 'A powerful herb used for centuries to support memory and mental focus.',
    basePrice: 1500,
    powderPrice: 1800,
    image: 'https://picsum.photos/seed/brahmi/400/300',
    benefits: ['Memory', 'Focus', 'Hair Health'],
    doshas: ['Pitta', 'Kapha']
  },
  {
    id: '5',
    name: 'Shatavari',
    botanicalName: 'Asparagus racemosus',
    description: 'A rejuvenating herb that cools the body and strengthens and nourishes the tissues.',
    basePrice: 1350,
    powderPrice: 1650,
    image: 'https://picsum.photos/seed/shatavari/400/300',
    benefits: ['Reproductive Health', 'Vitality', 'Cooling'],
    doshas: ['Vata', 'Pitta']
  },
  {
    id: '6',
    name: 'Giloy',
    botanicalName: 'Tinospora cordifolia',
    description: 'An Ayurvedic herb that has been used and advocated in Indian medicine for ages.',
    basePrice: 800,
    powderPrice: 950,
    image: 'https://picsum.photos/seed/giloy/400/300',
    benefits: ['Immunity', 'Fever Management', 'Blood Sugar'],
    doshas: ['Pitta', 'Kapha']
  }
];

// Knowledge Base: Health Goal -> Ratios
export const BLEND_RECIPES: Record<string, BlendRecipe> = {
  'stress': {
    id: 'stress',
    title: 'Peace of Mind Blend',
    description: 'A calming mix to reduce cortisol and support nervous system health.',
    ratios: {
      '1': 0.40, // Ashwagandha
      '4': 0.30, // Brahmi
      '5': 0.30  // Shatavari
    }
  },
  'immunity': {
    id: 'immunity',
    title: 'Ojas Immunity Builder',
    description: 'Strengthens the body\'s natural defense mechanisms.',
    ratios: {
      '6': 0.40, // Giloy
      '2': 0.35, // Turmeric
      '1': 0.25  // Ashwagandha
    }
  },
  'digestion': {
    id: 'digestion',
    title: 'Agni Digestive Aid',
    description: 'Supports healthy metabolism and gentle detoxification.',
    ratios: {
      '3': 0.50, // Triphala
      '2': 0.30, // Turmeric
      '6': 0.20  // Giloy
    }
  }
};
