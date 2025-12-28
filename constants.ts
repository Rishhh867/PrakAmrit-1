
import { Product, BlendRecipe } from './types';

// Logic:
// 250g: 0.25 (Standard)
// 500g: 0.5 (Standard)
// 1kg: 1.0 (Standard)
// 5kg: 5% discount -> 5 * (1 - 0.05) = 4.75
// 10kg: 10% discount -> 10 * (1 - 0.10) = 9.0
// 25kg: 15% discount -> 25 * (1 - 0.15) = 21.25
// 50kg: 20% discount -> 50 * (1 - 0.20) = 40.0
export const QUANTITY_MULTIPLIERS: Record<string, number> = {
  '250g': 0.25,
  '500g': 0.5,
  '1kg': 1.0,
  '5kg': 4.75,
  '10kg': 9.0,
  '25kg': 21.25,
  '50kg': 40.0,
};

export const POWDER_SURCHARGE_PERCENT = 0.20; // Deprecated in favor of explicit powderPrice, kept for fallback

// Helper to calculate powder price (+15%)
const calcPowder = (base: number) => Math.round(base * 1.15);

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Awala (Dry)',
    botanicalName: 'Phyllanthus emblica',
    description: 'Dried Indian Gooseberry, a rich source of Vitamin C and antioxidants.',
    basePrice: 450,
    powderPrice: calcPowder(450),
    image: 'https://images.unsplash.com/photo-1563720935-779836365448?auto=format&fit=crop&q=80',
    benefits: ['Immunity', 'Hair Health', 'Digestion'],
    doshas: ['Pitta', 'Kapha']
  },
  {
    id: '2',
    name: 'Harad',
    botanicalName: 'Terminalia chebula',
    description: 'The King of Medicines in Ayurveda, promotes longevity and digestion.',
    basePrice: 380,
    powderPrice: calcPowder(380),
    image: 'https://media.istockphoto.com/id/1661464967/photo/terminalia-chebula-a-dried-plum-fruit.jpg?s=612x612&w=0&k=20&c=9uhW0x3fEu6h6Vno52nNtHYch5YdUuMh-N5Y1ztTr7g=',
    benefits: ['Detoxification', 'Digestion', 'Vision'],
    doshas: ['Vata']
  },
  {
    id: '3',
    name: 'Baheda',
    botanicalName: 'Terminalia bellirica',
    description: 'One of the three fruits in Triphala, excellent for respiratory health.',
    basePrice: 360,
    powderPrice: calcPowder(360),
    image: 'https://media.istockphoto.com/id/1422781297/photo/medicinal-bahera-or-terminalia-bellericais-fruits-on-white-background.jpg?s=612x612&w=0&k=20&c=gY1mcoVM6ddltAZgBV8atc9eyHgmnVQrek5GbiQtD0U=',
    benefits: ['Respiratory Health', 'Hair Growth', 'Throat Care'],
    doshas: ['Kapha']
  },
  {
    id: '4',
    name: 'Sonamukhi',
    botanicalName: 'Cassia angustifolia',
    description: 'Senna leaves, a powerful natural laxative for occasional constipation.',
    basePrice: 280,
    powderPrice: calcPowder(280),
    image: 'https://cpimg.tistatic.com/08313545/b/4/Sonamukhi-Senna-Leaves.jpg',
    benefits: ['Laxative', 'Skin Health', 'Detox'],
    doshas: ['Pitta', 'Vata']
  },
  {
    id: '5',
    name: 'Ajwain',
    botanicalName: 'Trachyspermum ammi',
    description: 'Carom seeds, highly effective for digestive discomfort and acidity.',
    basePrice: 400,
    powderPrice: calcPowder(400),
    image: 'https://rishaayurveda.com/old/wp-content/uploads/2025/05/ajwain-1.jpg',
    benefits: ['Digestion', 'Acidity Relief', 'Respiratory'],
    doshas: ['Vata', 'Kapha']
  },
  {
    id: '6',
    name: 'Ashwagandha',
    botanicalName: 'Withania somnifera',
    description: 'The premier Ayurvedic adaptogen for stress relief and vitality.',
    basePrice: 1200,
    powderPrice: calcPowder(1200),
    image: 'https://maharishiayurvedaindia.com/cdn/shop/articles/ashwagandha_powder_5959991f-4a88-478b-927e-134b5590f30f.jpg?v=1761134765',
    benefits: ['Stress Relief', 'Strength', 'Sleep'],
    doshas: ['Vata', 'Kapha']
  },
  {
    id: '7',
    name: 'Silajit (Pure)',
    botanicalName: 'Asphaltum punjabianum',
    description: 'Mineral pitch resin known for energy, potency, and rejuvenation.',
    basePrice: 15000,
    powderPrice: 15000,
    image: 'https://t3.ftcdn.net/jpg/09/00/76/12/240_F_900761266_9ITkLjanZQGMZpvJyopLO7sLkluSBVgy.jpg',
    benefits: ['Energy', 'Anti-aging', 'Vitality'],
    doshas: ['Vata', 'Kapha'],
    availableForms: ['raw']
  },
  {
    id: '8',
    name: 'Panmuri',
    botanicalName: 'Foeniculum vulgare',
    description: 'Sweet fennel seeds, excellent for digestion and mouth freshening.',
    basePrice: 320,
    powderPrice: calcPowder(320),
    image: 'https://t3.ftcdn.net/jpg/01/98/20/14/240_F_198201493_D4Fx1uMUCCnd1etjO3aXGcWl8Qw8UyOX.jpg',
    benefits: ['Digestion', 'Cooling', 'Fresh Breath'],
    doshas: ['Vata', 'Pitta']
  },
  {
    id: '9',
    name: 'Kurd (Kutki)',
    botanicalName: 'Picrorhiza kurroa',
    description: 'A bitter herb used for liver protection and fever management.',
    basePrice: 2800,
    powderPrice: calcPowder(2800),
    image: 'https://www.gosupps.com/media/catalog/product/cache/25/image/1500x/040ec09b1e35df139433887a97daa66f/7/1/71so1wev_BL._AC_SL1500_.jpg',
    benefits: ['Liver Health', 'Fever', 'Detox'],
    doshas: ['Pitta', 'Kapha']
  },
  {
    id: '10',
    name: 'Brahmni',
    botanicalName: 'Bacopa monnieri',
    description: 'Medhya Rasayana herb known for boosting memory and intelligence.',
    basePrice: 950,
    powderPrice: calcPowder(950),
    image: 'https://images.apollo247.in/pd-cms/cms/2025-11/Brahmi%20Health%20Benefits,%20Uses,%20and%20Brain-Boosting%20Effects.webp',
    benefits: ['Memory', 'Focus', 'Stress'],
    doshas: ['Pitta', 'Kapha']
  },
  {
    id: '11',
    name: 'Jatamansi',
    botanicalName: 'Nardostachys jatamansi',
    description: 'A calming herb used for insomnia, stress, and nervous disorders.',
    basePrice: 3500,
    powderPrice: calcPowder(3500),
    image: 'https://mypahadidukan.com/cdn/shop/articles/Jatamansi_9e9bd971-a3e7-4494-bb24-90a4bc514c89.jpg?v=1756981034&width=1780',
    benefits: ['Sleep', 'Calming', 'Hair Growth'],
    doshas: ['Vata', 'Pitta', 'Kapha']
  },
  {
    id: '12',
    name: 'Sikakai',
    botanicalName: 'Acacia concinna',
    description: 'Traditional hair care herb for cleansing and conditioning.',
    basePrice: 420,
    powderPrice: calcPowder(420),
    image: 'https://ayurvedastoreonline.com/cdn/shop/files/organicshikakaipowder_720x.jpg?v=1719225058',
    benefits: ['Hair Cleansing', 'Dandruff Control', 'Shine'],
    doshas: ['Pitta', 'Kapha']
  },
  {
    id: '13',
    name: 'Gokhru',
    botanicalName: 'Tribulus terrestris',
    description: 'Supports kidney function and urinary health.',
    basePrice: 650,
    powderPrice: calcPowder(650),
    image: 'https://vardhmannutrition.com/admin/style/images/content/20251108124921_Gokhru-Powder.jpg',
    benefits: ['Kidney Health', 'Vitality', 'Urinary Support'],
    doshas: ['Vata', 'Pitta']
  },
  {
    id: '14',
    name: 'Tiwadi (Trivrit)',
    botanicalName: 'Operculina turpethum',
    description: 'Used for purgation therapy in Ayurveda.',
    basePrice: 1100,
    powderPrice: calcPowder(1100),
    image: 'https://5.imimg.com/data5/SELLER/Default/2025/5/507738672/PK/WB/BB/1593470/nishod-operculina-turpethum-1000x1000.jpg',
    benefits: ['Constipation', 'Detox', 'Skin Disorders'],
    doshas: ['Pitta', 'Kapha']
  },
  {
    id: '15',
    name: 'Jawakhar (Yavakshar)',
    botanicalName: 'Hordeum vulgare',
    description: 'Alkali preparation made from barley, used for urinary issues.',
    basePrice: 500,
    powderPrice: calcPowder(500),
    image: 'https://5.imimg.com/data5/SELLER/Default/2024/8/445083914/HX/GK/AK/20515159/yavakshar-500x500.jpg',
    benefits: ['Urinary Health', 'Bloating', 'Digestion'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '16',
    name: 'Kala Namak',
    botanicalName: 'Himalayan Black Salt',
    description: 'Mineral-rich salt used to enhance digestion and flavor.',
    basePrice: 150,
    powderPrice: calcPowder(150),
    image: 'https://t3.ftcdn.net/jpg/06/46/86/14/240_F_646861407_huiOaUYIm7MsES5y15i5yKUTaUUj9NE5.jpg',
    benefits: ['Digestion', 'Gas Relief', 'Flavor'],
    doshas: ['Vata']
  },
  {
    id: '17',
    name: 'Fitkari',
    botanicalName: 'Potassium Alum',
    description: 'Natural antiseptic and water purifier.',
    basePrice: 120,
    powderPrice: calcPowder(120),
    image: 'https://bhutatva.com/wp-content/uploads/2021/06/fitkari.jpg',
    benefits: ['Antiseptic', 'Water Purification', 'Oral Health'],
    doshas: ['Pitta', 'Kapha']
  },
  {
    id: '18',
    name: 'Golki (Gol Mirch)',
    botanicalName: 'Piper nigrum',
    description: 'Black pepper, the king of spices, enhances bioavailability.',
    basePrice: 900,
    powderPrice: calcPowder(900),
    image: 'https://thumbs.dreamstime.com/b/heap-pippali-long-pepper-wooden-cup-isolated-white-background-heap-pippali-long-pepper-wooden-cup-isolated-white-321800815.jpg',
    benefits: ['Bioavailability', 'Digestion', 'Metabolism'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '19',
    name: 'Pipli',
    botanicalName: 'Piper longum',
    description: 'Long pepper, powerful rejuvenator for the respiratory system.',
    basePrice: 2200,
    powderPrice: calcPowder(2200),
    image: 'https://t4.ftcdn.net/jpg/01/30/13/83/240_F_130138315_9JmrGrIsaz92VC3hZ3xWxhffxrHprOYq.jpg',
    benefits: ['Respiratory', 'Metabolism', 'Detox'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '20',
    name: 'Laung',
    botanicalName: 'Syzygium aromaticum',
    description: 'Cloves, rich in antioxidants and excellent for oral health.',
    basePrice: 1800,
    powderPrice: calcPowder(1800),
    image: 'https://t3.ftcdn.net/jpg/01/77/13/82/240_F_177138278_dWfUr8jDQdb1sXczaBYfJh6gRe2ad0E6.jpg',
    benefits: ['Toothache', 'Digestion', 'Immunity'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '21',
    name: 'Elichi',
    botanicalName: 'Elettaria cardamomum',
    description: 'Green cardamom, the queen of spices.',
    basePrice: 3500,
    powderPrice: calcPowder(3500),
    image: 'https://t3.ftcdn.net/jpg/17/10/74/36/240_F_1710743613_taYTuP6f7FedcszgFb7grLOq4ptuAAbe.jpg',
    benefits: ['Digestion', 'Flavor', 'Nausea'],
    doshas: ['Vata', 'Pitta', 'Kapha']
  },
  {
    id: '22',
    name: 'Dalchini',
    botanicalName: 'Cinnamomum verum',
    description: 'True cinnamon bark, supports blood sugar levels.',
    basePrice: 900,
    powderPrice: calcPowder(900),
    image: 'https://t4.ftcdn.net/jpg/18/26/81/63/240_F_1826816361_k7Dlx2PRPRO1IK83mzr2o2R93LsYO6Ez.jpg',
    benefits: ['Blood Sugar', 'Metabolism', 'Heart Health'],
    doshas: ['Vata', 'Kapha']
  },
  {
    id: '23',
    name: 'Bada Elichi',
    botanicalName: 'Amomum subulatum',
    description: 'Black cardamom, strong smoky flavor for respiratory health.',
    basePrice: 1800,
    powderPrice: calcPowder(1800),
    image: 'https://media.istockphoto.com/id/484157098/photo/amomum-pods-in-the-wooden-spoon.jpg?s=612x612&w=0&k=20&c=hMbdUrev47NScQiWWLpCRiF9CGCdCi_cSZB1DNs8d_w=',
    benefits: ['Respiratory', 'Digestion', 'Oral Health'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '24',
    name: 'Tez Patta',
    botanicalName: 'Cinnamomum tamala',
    description: 'Indian bay leaf, used for flavoring and insulin sensitivity.',
    basePrice: 300,
    powderPrice: calcPowder(300),
    image: 'https://media.istockphoto.com/id/2233955491/photo/dried-bay-leaves-on-wooden-background-it-is-also-known-as-tej-pata-cassia-leaves-cinnamomum.jpg?s=612x612&w=0&k=20&c=WX5GeBHv-sP2Ji8xzmWItfrc7K3uxlYEMPDq1leaHSA=',
    benefits: ['Digestion', 'Blood Sugar', 'Flavor'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '25',
    name: 'Paneer Phool',
    botanicalName: 'Withania coagulans',
    description: 'Indian Rennet, traditionally used for managing diabetes.',
    basePrice: 800,
    powderPrice: calcPowder(800),
    image: 'https://media.istockphoto.com/id/1422781720/photo/organic-dry-solanaceae-or-cheese-flowers-background-texture.jpg?s=612x612&w=0&k=20&c=cPgUJ3bhCQoyuwlRbYnnsl3K_ZoOA_IyBJgs1nyVmik=',
    benefits: ['Blood Sugar', 'Insulin Support', 'Wellness'],
    doshas: ['Kapha', 'Pitta']
  },
  {
    id: '26',
    name: 'Tangana (Tankana)',
    botanicalName: 'Borax (Purified)',
    description: 'Used in Ayurveda for cough, bronchitis, and digestive issues.',
    basePrice: 250,
    powderPrice: calcPowder(250),
    image: 'https://images.unsplash.com/photo-1610725664338-23c6d86139dd?auto=format&fit=crop&q=80',
    benefits: ['Cough Relief', 'Digestion', 'Antiseptic'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '27',
    name: 'Ghoda Bach',
    botanicalName: 'Acorus calamus',
    description: 'Sweet Flag root, supports speech and intellect.',
    basePrice: 600,
    powderPrice: calcPowder(600),
    image: 'https://media.istockphoto.com/id/529657332/photo/macro-closeup-of-organic-calamus-root.jpg?s=612x612&w=0&k=20&c=fhC5bURNJ-Nc2nIEbWIh3ijAdMKN4ugaAZPeURM9fdE=',
    benefits: ['Speech', 'Memory', 'Nervine Tonic'],
    doshas: ['Vata', 'Kapha']
  },
  {
    id: '28',
    name: 'Lal Bach',
    botanicalName: 'Alpinia galanga',
    description: 'Greater Galangal, excellent for respiratory and rheumatic conditions.',
    basePrice: 700,
    powderPrice: calcPowder(700),
    image: 'https://www.shop.witchwayout.in/cdn/shop/files/DSC_2094.jpg?v=1706438304&width=1946',
    benefits: ['Respiratory', 'Joint Pain', 'Digestion'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '29',
    name: 'Banshi Lochan',
    botanicalName: 'Bambusa arundinacea',
    description: 'Bamboo manna, excellent source of silica and cooling for the body.',
    basePrice: 2200,
    powderPrice: calcPowder(2200),
    image: 'https://rukminim2.flixcart.com/image/480/640/kjbr8280-0/spice-masala/k/z/a/500-banslochan-tabasheer-500gm-pouch-nice-grocery-whole-original-imafyxfyganqpzku.jpeg?q=90',
    benefits: ['Bone Health', 'Cooling', 'Strength'],
    doshas: ['Pitta', 'Vata']
  },
  {
    id: '30',
    name: 'Lodh',
    botanicalName: 'Symplocos racemosa',
    description: 'Supports female reproductive health and skin complexion.',
    basePrice: 600,
    powderPrice: calcPowder(600),
    image: 'https://www.jiomart.com/images/product/original/rvs6lnffja/nutrixia-lodhra-powder-lodh-chaal-lodh-pathani-chhal-symplocos-racemosa-100-gms-product-images-orvs6lnffja-p600063417-0-202304011310.png?im=Resize=(1000,1000)',
    benefits: ['Women\'s Health', 'Skin Care', 'Cooling'],
    doshas: ['Pitta', 'Kapha']
  },
  {
    id: '31',
    name: 'Shatavari',
    botanicalName: 'Asparagus racemosus',
    description: 'The queen of herbs, supports reproductive health and vitality.',
    basePrice: 1350,
    powderPrice: calcPowder(1350),
    image: 'https://media.istockphoto.com/id/974877192/photo/ayurvedic-herb-satavari-asparagus-racemosus-with-its-powder-and-root-in-a-bowl-on-brown-wooden.jpg?s=612x612&w=0&k=20&c=nOGCgpnWMZ_rORB3NcZwn2uBIYLQE1KGtFqkSckMdBo=',
    benefits: ['Reproductive Health', 'Cooling', 'Immunity'],
    doshas: ['Vata', 'Pitta']
  },
  {
    id: '32',
    name: 'Giloy Satva',
    botanicalName: 'Tinospora cordifolia extract',
    description: 'Dried extract of Giloy, potent immunity booster.',
    basePrice: 4000,
    powderPrice: calcPowder(4000),
    image: 'https://www.greendna.in/cdn/shop/files/giloy-extract_1000x.jpg?v=1748434207',
    benefits: ['Immunity', 'Fever', 'Purification'],
    doshas: ['Pitta', 'Kapha', 'Vata']
  },
  {
    id: '33',
    name: 'Dhaniya',
    botanicalName: 'Coriandrum sativum',
    description: 'Coriander seeds, cooling diuretic and digestive.',
    basePrice: 250,
    powderPrice: calcPowder(250),
    image: 'https://media.istockphoto.com/id/1270516315/photo/coriander-seeds-and-powder-in-wooden-spoon-with-fresh-cilantro-leaves-on-wooden-table.jpg?s=612x612&w=0&k=20&c=siZGlDh0DfPqK-PGxfhcewNzu_FYhUTeb02ukslZIhM=',
    benefits: ['Cooling', 'Digestion', 'Urinary Health'],
    doshas: ['Pitta', 'Kapha']
  },
  {
    id: '34',
    name: 'Piplamool',
    botanicalName: 'Piper longum root',
    description: 'Root of Long Pepper, good for sleep and digestion.',
    basePrice: 1800,
    powderPrice: calcPowder(1800),
    image: 'https://media.istockphoto.com/id/493762352/photo/organic-ganthoda-in-white-bowl.jpg?s=612x612&w=0&k=20&c=CLcM4h5tvhLLqncIbJjueGhJnHDsKyivENfXx_HCGGw=',
    benefits: ['Sleep', 'Digestion', 'Metabolism'],
    doshas: ['Vata', 'Kapha']
  },
  {
    id: '35',
    name: 'Suthi (South)',
    botanicalName: 'Zingiber officinale',
    description: 'Dry Ginger powder/root, universal medicine (Vishwabheshaj).',
    basePrice: 800,
    powderPrice: calcPowder(800),
    image: 'https://media.istockphoto.com/id/1167521639/photo/dried-ginger-and-ground-ginger-close-up.jpg?s=612x612&w=0&k=20&c=DB6uAHEqRI1_rHCDTDm6xm6HoqCpdhmgjBp6ePwFULM=',
    benefits: ['Digestion', 'Anti-inflammatory', 'Cold Relief'],
    doshas: ['Kapha', 'Vata']
  },
  {
    id: '36',
    name: 'Cutting Mishri',
    botanicalName: 'Rock Sugar',
    description: 'Unrefined crystallized sugar, cooling and soothing.',
    basePrice: 180,
    powderPrice: 180,
    image: 'https://img.freepik.com/premium-photo/rock-sugar-wooden_62856-4438.jpg?semt=ais_hybrid&w=740&q=80',
    benefits: ['Energy', 'Cooling', 'Throat Care'],
    doshas: ['Vata', 'Pitta'],
    availableForms: ['raw']
  },
  {
    id: '37',
    name: 'Suta Mishri',
    botanicalName: 'Thread Crystal Sugar',
    description: 'Traditional rock sugar with thread, considered purest.',
    basePrice: 220,
    powderPrice: 220,
    image: 'https://media.istockphoto.com/id/1150968931/photo/white-nabat-with-black-background.jpg?s=612x612&w=0&k=20&c=gjm8ApKSrqnt9dBIm9ryY7I97AOsCJUDG23CDWYN-iY=',
    benefits: ['Purity', 'Taste', 'Cooling'],
    doshas: ['Vata', 'Pitta'],
    availableForms: ['raw']
  },
  {
    id: '38',
    name: 'Yastimadhu',
    botanicalName: 'Glycyrrhiza glabra',
    description: 'Licorice root, soothing for throat and stomach lining.',
    basePrice: 900,
    powderPrice: calcPowder(900),
    image: 'https://thumbs.dreamstime.com/b/liquorice-stick-ground-herbs-wooden-bowl-textured-surface-147760391.jpg',
    benefits: ['Throat Care', 'Acidity', 'Voice'],
    doshas: ['Vata', 'Pitta']
  },
  {
    id: '39',
    name: 'Dal Makhana',
    botanicalName: 'Asteracantha longifolia',
    description: 'Seeds used for vitality and strength.',
    basePrice: 600,
    powderPrice: calcPowder(600),
    image: 'https://images.unsplash.com/photo-1549488497-2342c3008985?auto=format&fit=crop&q=80',
    benefits: ['Strength', 'Vitality', 'Nourishing'],
    doshas: ['Vata', 'Pitta']
  }
];

// Knowledge Base: Health Goal -> Ratios
export const BLEND_RECIPES: Record<string, BlendRecipe> = {
  'stress': {
    id: 'stress',
    title: 'Peace of Mind Blend',
    description: 'A calming mix to reduce cortisol and support nervous system health.',
    ratios: {
      '6': 0.40, // Ashwagandha
      '10': 0.30, // Brahmi
      '31': 0.30  // Shatavari
    }
  },
  'immunity': {
    id: 'immunity',
    title: 'Ojas Immunity Builder',
    description: 'Strengthens the body\'s natural defense mechanisms.',
    ratios: {
      '32': 0.40, // Giloy Satva
      '1': 0.35, // Awala
      '6': 0.25  // Ashwagandha
    }
  },
  'digestion': {
    id: 'digestion',
    title: 'Agni Digestive Aid',
    description: 'Supports healthy metabolism and gentle detoxification.',
    ratios: {
      '2': 0.30, // Harada
      '3': 0.30, // Beherda
      '1': 0.40  // Awala (Triphala Mix)
    }
  }
};
