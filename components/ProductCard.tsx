
import React, { useState, useMemo } from 'react';
import { ShoppingBag, Heart, RefreshCcw, ChevronDown, ChevronUp, Flame, Wind, Droplets, FileText, Check } from 'lucide-react';
import { Product, ProductForm, Quantity, CartItem, Dosha } from '../types';
import { QUANTITY_MULTIPLIERS } from '../constants';

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
  onRequestQuote: (item: CartItem) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onRequestQuote, isWishlisted, onToggleWishlist }) => {
  // Default to first available form or 'raw'
  const [form, setForm] = useState<ProductForm>(product.availableForms ? product.availableForms[0] : 'raw');
  const [quantity, setQuantity] = useState<Quantity>('1kg');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPriceTable, setShowPriceTable] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Interaction State
  const [animateHeart, setAnimateHeart] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Check if *Bulk Order* logic applies
  const isBulkOrder = quantity === '25kg' || quantity === '50kg';

  // Calculate dynamic price
  const finalPrice = useMemo(() => {
    // 1. Determine Base Price based on Form
    const baseUnit = form === 'raw' ? product.basePrice : product.powderPrice;

    // 2. Apply Quantity Multiplier (which includes baked-in bulk discounts)
    let price = baseUnit * QUANTITY_MULTIPLIERS[quantity];

    // 3. Subscription Discount (10%)
    if (isSubscribed) {
      price = price * 0.90;
    }

    return Math.round(price);
  }, [product.basePrice, product.powderPrice, form, quantity, isSubscribed]);

  // Helper to calculate unit price for the table
  const getTablePrice = (multiplier: number) => {
    const baseUnit = form === 'raw' ? product.basePrice : product.powderPrice;
    let base = baseUnit * multiplier;
    if (isSubscribed) base = base * 0.90;
    return Math.round(base);
  };

  const handleAction = () => {
    const item = {
      productId: product.id,
      productName: product.name,
      form,
      quantity,
      price: finalPrice,
      isSubscribed
    };

    if (isBulkOrder) {
      onRequestQuote(item);
    } else {
      onAddToCart(item);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 1. Trigger "Pop" Animation
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 300);

    // 2. Trigger Toast (Only if adding)
    if (!isWishlisted) {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }

    // 3. Toggle State
    onToggleWishlist(product.id);
  };

  const getDoshaIcon = (dosha: Dosha) => {
    switch (dosha) {
      case 'Vata': return <Wind size={12} className="text-blue-400" />;
      case 'Pitta': return <Flame size={12} className="text-orange-500" />;
      case 'Kapha': return <Droplets size={12} className="text-green-600" />;
    }
  };

  // Determine which forms are available (default to both if undefined)
  const forms = product.availableForms || ['raw', 'powder'];
  const hasMultipleForms = forms.length > 1;

  return (
    <div 
      className="glass-card rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(27,67,50,0.2)] hover:-translate-y-2 group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-60 overflow-hidden p-4">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 to-transparent z-0"></div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110 shadow-sm relative z-10"
        />
        
        {/* Dosha Badges */}
        <div className="absolute top-6 left-6 z-20 flex gap-1">
          {product.doshas.map(dosha => (
             <div key={dosha} className="bg-white/90 backdrop-blur-md pl-2 pr-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm flex items-center gap-1 border border-white/50">
                {getDoshaIcon(dosha)}
                {dosha}
             </div>
          ))}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-6 right-6 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm group/heart ${
            isWishlisted
              ? 'bg-red-500 text-white shadow-red-500/30'
              : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart 
            size={18} 
            fill={isWishlisted ? "currentColor" : "none"} 
            className={`transition-transform duration-300 ${animateHeart ? 'scale-125' : (isWishlisted ? 'scale-100' : 'group-hover/heart:scale-110')}`} 
          />
        </button>

        {/* Confirmation Toast */}
        {showToast && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl flex items-center gap-2 animate-fade-in-up pointer-events-none ring-1 ring-white/20">
            <div className="bg-prak-green rounded-full p-0.5">
               <Check size={10} strokeWidth={3} className="text-white" />
            </div>
            <span>Added to Wishlist</span>
          </div>
        )}
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-col flex-grow relative z-10">
        <div className="mb-2">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-2xl font-serif font-bold text-prak-green mb-1 group-hover:text-prak-lightGreen transition-colors">{product.name}</h3>
                <p className="text-xs text-prak-gold font-bold italic tracking-wider">{product.botanicalName}</p>
             </div>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

        <div className="space-y-4 mt-auto">
          {/* Controls Container */}
          <div className="bg-white/50 rounded-2xl p-4 border border-white/60 space-y-4 shadow-sm">
            
            {/* Form & Quantity Row */}
            <div className="flex gap-2">
                <div className="flex-1">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Format</p>
                   {hasMultipleForms ? (
                     <div className="flex bg-gray-100/50 rounded-lg p-1 relative h-9">
                       <button
                         onClick={() => setForm('raw')}
                         className={`flex-1 text-[10px] rounded-md transition-all font-bold z-10 ${
                           form === 'raw' 
                             ? 'text-prak-green bg-white shadow-sm' 
                             : 'text-gray-500 hover:text-prak-green'
                         }`}
                       >
                         Raw
                       </button>
                       <button
                         onClick={() => setForm('powder')}
                         className={`flex-1 text-[10px] rounded-md transition-all font-bold z-10 ${
                           form === 'powder' 
                             ? 'text-prak-green bg-white shadow-sm' 
                             : 'text-gray-500 hover:text-prak-green'
                         }`}
                       >
                         Pwdr
                       </button>
                     </div>
                   ) : (
                     <div className="bg-gray-100/30 border border-gray-100 rounded-lg h-9 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{form} Only</span>
                     </div>
                   )}
                </div>

                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Size</p>
                  <div className="relative">
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value as Quantity)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:ring-1 focus:ring-prak-green/30 cursor-pointer h-9"
                    >
                      {Object.keys(QUANTITY_MULTIPLIERS).map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown size={12} />
                    </div>
                  </div>
                </div>
            </div>

            {/* Subscribe & Save Checkbox */}
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSubscribed ? 'bg-green-50 border-green-200' : 'bg-transparent border-transparent hover:bg-gray-50'}`}>
               <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSubscribed ? 'bg-prak-green border-prak-green text-white' : 'border-gray-300 bg-white'}`}>
                  {isSubscribed && <RefreshCcw size={12} />}
               </div>
               <input type="checkbox" className="hidden" checked={isSubscribed} onChange={() => setIsSubscribed(!isSubscribed)} />
               <div className="flex-1">
                 <p className={`text-xs font-bold ${isSubscribed ? 'text-prak-green' : 'text-gray-600'}`}>Subscribe & Save 10%</p>
                 <p className="text-[10px] text-gray-400">Auto-deliver every month</p>
               </div>
            </label>

            {/* Dynamic Price Table Toggle */}
            <div className="border-t border-gray-100 pt-2">
                <button 
                  onClick={() => setShowPriceTable(!showPriceTable)}
                  className="w-full flex items-center justify-between text-[10px] font-bold text-prak-gold hover:text-prak-brown transition-colors uppercase tracking-wider"
                >
                   <span>View *Bulk Savings*</span>
                   {showPriceTable ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                
                {showPriceTable && (
                   <div className="mt-3 overflow-visible rounded-lg border border-gray-100 animate-fade-in-up">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 text-gray-500">
                           <tr>
                             <th className="px-3 py-2 font-medium">Qty</th>
                             <th className="px-3 py-2 font-medium">Price</th>
                             <th className="px-3 py-2 font-medium">Save</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                           {/* 1kg Row */}
                           <tr 
                              onClick={() => setQuantity('1kg')}
                              className={`cursor-pointer transition-all ${quantity === '1kg' ? 'bg-green-50/80 border-l-4 border-prak-green' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                           >
                              <td className={`px-3 py-2 ${quantity === '1kg' ? 'text-prak-green font-bold' : 'text-gray-600'}`}>1kg</td>
                              <td className={`px-3 py-2 ${quantity === '1kg' ? 'text-prak-green font-bold' : 'font-medium'}`}>₹{getTablePrice(1)}</td>
                              <td className="px-3 py-2 text-gray-400 text-[10px]">-</td>
                           </tr>

                           {/* 5kg Row */}
                           <tr 
                              onClick={() => setQuantity('5kg')}
                              className={`cursor-pointer transition-all ${quantity === '5kg' ? 'bg-green-50/80 border-l-4 border-prak-green' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                           >
                              <td className={`px-3 py-2 ${quantity === '5kg' ? 'text-prak-green font-bold' : 'text-gray-600'}`}>5kg</td>
                              <td className={`px-3 py-2 ${quantity === '5kg' ? 'text-prak-green font-bold' : 'font-medium'}`}>₹{getTablePrice(4.25)}</td>
                              <td className="px-3 py-2 text-green-600 font-bold text-[10px]">15%</td>
                           </tr>

                           {/* 25kg Row (Bulk) */}
                           <tr 
                              onClick={() => setQuantity('25kg')}
                              className={`cursor-pointer transition-all ${quantity === '25kg' ? 'bg-green-50/80 border-l-4 border-prak-green' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                           >
                              <td className={`px-3 py-2 ${quantity === '25kg' ? 'text-prak-green font-bold' : 'text-gray-600'}`}>25kg</td>
                              <td className={`px-3 py-2 ${quantity === '25kg' ? 'text-prak-green font-bold' : 'font-medium'}`}>₹{getTablePrice(17.5)}</td>
                              <td className="px-3 py-2 text-green-600 font-bold text-[10px]">30%</td>
                           </tr>
                        </tbody>
                      </table>
                   </div>
                )}
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col relative">
               {/* Powder Surcharge Badge */}
               {form === 'powder' && hasMultipleForms && (
                  <div className="absolute -top-3.5 left-0 bg-orange-100 text-orange-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-orange-200 shadow-sm whitespace-nowrap z-10">
                    +15% Processing
                  </div>
               )}
              <span className={`text-2xl font-serif font-bold text-prak-dark transition-all ${form === 'powder' && hasMultipleForms ? 'mt-1.5' : ''}`}>
                 ₹{finalPrice.toLocaleString()}
              </span>
              {isSubscribed ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Recurring</span>
                  <span className="bg-prak-green text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-fade-in-up">
                    -10% Applied
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">One-time</span>
              )}
            </div>
            
            {/* Dynamic Button Logic: Request Quote vs Add to Cart */}
            <button
              onClick={handleAction}
              className={`group/btn text-white p-3.5 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                 isBulkOrder 
                  ? 'bg-prak-brown hover:bg-prak-gold shadow-prak-brown/20' 
                  : 'bg-prak-dark hover:bg-prak-green shadow-prak-dark/20'
              }`}
              title={isBulkOrder ? "Request Bulk Quote" : "Add to Cart"}
            >
              {isBulkOrder ? (
                 <FileText size={20} className="transition-transform group-hover/btn:scale-110" />
              ) : (
                 <ShoppingBag size={20} className="transition-transform group-hover/btn:scale-110" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
