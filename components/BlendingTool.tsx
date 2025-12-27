
import React, { useState, useEffect } from 'react';
import { Beaker, Calculator, ShoppingBag, ArrowRight, Sparkles, SlidersHorizontal, Leaf, Layers, ClipboardCheck, FileText, AlertCircle, Plus, Minus } from 'lucide-react';
import { PRODUCTS, BLEND_RECIPES } from '../constants';
import { CartItem, ProductForm, Quantity } from '../types';

interface BlendingToolProps {
  onAddBundleToCart: (items: CartItem[]) => void;
  onRequestQuote: (item: CartItem) => void;
}

interface CalculatedIngredient {
  productId: string;
  name: string;
  weight: number;
  price: number;
  form: ProductForm;
  unitPrice: number;
}

const BlendingTool: React.FC<BlendingToolProps> = ({ onAddBundleToCart, onRequestQuote }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false); // Default minimized
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [totalWeight, setTotalWeight] = useState<number>(500); // Default 500g
  const [selectedForm, setSelectedForm] = useState<ProductForm>('raw');
  const [results, setResults] = useState<CalculatedIngredient[] | null>(null);
  const [discountApplied, setDiscountApplied] = useState<{ label: string, amount: number } | null>(null);
  
  // Logic: >5000g triggers a different view instead of an error
  const isBulkMode = totalWeight > 5000;
  // Logic: <500g triggers a warning
  const isLowWeight = totalWeight > 0 && totalWeight < 500;

  // Helper to parse formatting (single asterisks for bold)
  const renderText = (text: string) => {
    const parts = text.split('*');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold text-prak-green">{part}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Logic: Recalculate results whenever inputs change
  useEffect(() => {
    // Basic Validation
    if (!selectedGoal || totalWeight <= 0) {
      setResults(null);
      setDiscountApplied(null);
      return;
    }

    // Minimum Weight Check (Hard Stop)
    if (totalWeight < 500) {
      setResults(null);
      setDiscountApplied(null);
      return;
    }

    // Pivot: If bulk mode, clear standard results so we render the Bulk Inquiry UI
    if (isBulkMode) {
      setResults(null);
      setDiscountApplied(null);
      return;
    }

    const recipe = BLEND_RECIPES[selectedGoal];
    if (!recipe) return;

    const calculated: CalculatedIngredient[] = [];
    let subtotal = 0;

    Object.entries(recipe.ratios).forEach(([productId, ratio]) => {
      const product = PRODUCTS.find(p => p.id === productId);
      if (product) {
        const weight = totalWeight * ratio;
        const pricePerKg = selectedForm === 'raw' ? product.basePrice : product.powderPrice;
        
        // Price Calculation: (WeightInGrams / 1000) * PricePerKg
        const linePrice = (weight / 1000) * pricePerKg;
        
        subtotal += linePrice;

        calculated.push({
          productId: product.id,
          name: product.name,
          weight,
          price: linePrice,
          form: selectedForm,
          unitPrice: pricePerKg
        });
      }
    });

    // Bulk Discount Logic for < 5kg
    // 5kg = 15% off (Max for auto-cart is 5000g)
    let discountFactor = 0;
    let discountLabel = '';

    if (totalWeight === 5000) {
      discountFactor = 0.15;
      discountLabel = '15% Bulk Savings';
    }

    if (discountFactor > 0) {
      setDiscountApplied({
        label: discountLabel,
        amount: subtotal * discountFactor
      });
    } else {
      setDiscountApplied(null);
    }

    setResults(calculated);
  }, [selectedGoal, totalWeight, selectedForm, isBulkMode, isLowWeight]);

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setTotalWeight(val);
  };

  const handleAddToCart = () => {
    if (!results) return;

    // Apply the discount to each item price individually for the cart
    const discountFactor = discountApplied ? (discountApplied.amount / results.reduce((a, b) => a + b.price, 0)) : 0;

    const bundleItems: CartItem[] = results.map(res => {
      return {
        productId: res.productId,
        productName: res.name,
        form: res.form,
        quantity: '1kg', // Fallback type
        customWeight: res.weight,
        price: Math.round(res.price * (1 - discountFactor)), // Discounted price per item
        isSubscribed: false
      };
    });

    onAddBundleToCart(bundleItems);
    
    // Reset after adding
    setResults(null);
    setSelectedGoal('');
    setTotalWeight(500);
    alert("Custom blend ingredients added to your cart!");
  };

  const handleBulkInquiry = () => {
    const bundleItem: CartItem = {
      productId: 'custom-blend-bulk',
      productName: `${BLEND_RECIPES[selectedGoal]?.title || 'Custom Blend'} (${selectedForm})`,
      form: selectedForm,
      quantity: `${totalWeight}g` as Quantity, // Dynamic string cast allowed by updated type
      customWeight: totalWeight,
      price: 0, // TBD by quote
      isSubscribed: false
    };
    onRequestQuote(bundleItem);
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 px-4">
      <div className={`relative glass-panel rounded-3xl overflow-hidden shadow-xl border border-white/60 transition-all duration-500 hover:shadow-2xl ${isOpen ? 'ring-1 ring-prak-green/20' : ''}`}>
        
        {/* Background Accents - Persist subtly */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-prak-green/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-prak-gold/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        {/* --- Interactive Header (Trigger) --- */}
        <button 
           onClick={() => setIsOpen(!isOpen)}
           className="w-full relative z-20 flex items-center justify-between p-6 md:px-10 md:py-8 bg-white/40 hover:bg-white/70 transition-colors text-left group outline-none cursor-pointer"
        >
            <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${isOpen ? 'bg-prak-green text-white rotate-0 shadow-lg' : 'bg-white text-prak-green -rotate-6 group-hover:rotate-0'}`}>
                   <Beaker size={28} />
                </div>
                <div>
                    <h2 className="text-xl md:text-3xl font-serif font-bold text-prak-dark group-hover:text-prak-green transition-colors">
                      Advanced {renderText('*Formulation* Engine')}
                    </h2>
                    <p className={`text-gray-500 text-sm mt-1 font-medium transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-80'}`}>
                       {isOpen 
                         ? 'Customize your perfect Ayurvedic blend with real-time pricing.' 
                         : 'Click to expand calculation tools & bulk pricing.'}
                    </p>
                </div>
            </div>

            {/* Dynamic Icon */}
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-prak-green border-prak-green text-white rotate-180' : 'bg-white border-gray-200 text-gray-400 group-hover:border-prak-green group-hover:text-prak-green'}`}>
                {isOpen ? <Minus size={20} /> : <Plus size={20} />}
            </div>
        </button>

        {/* --- Collapsible Content --- */}
        <div className={`relative z-10 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-8 md:p-10 pt-2 border-t border-white/50">
            <div className="grid lg:grid-cols-12 gap-10 items-start">
              
              {/* Input Section */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Goal Selector */}
                <div className="bg-white/60 p-6 rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md hover:bg-white/80">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    <Sparkles size={16} className="text-prak-gold" />
                    1. {renderText('Select *Health Goal*')}
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedGoal}
                      onChange={(e) => setSelectedGoal(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-prak-green/30 transition-all cursor-pointer"
                    >
                      <option value="" disabled>-- Choose a Benefit --</option>
                      <option value="stress">Stress Relief & Relaxation</option>
                      <option value="immunity">Immunity Boost</option>
                      <option value="digestion">Digestive Health</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Form Selector */}
                <div className="bg-white/60 p-6 rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md hover:bg-white/80">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    <Layers size={16} className="text-prak-gold" />
                    2. {renderText('Select *Material Form*')}
                  </label>
                  <div className="flex bg-gray-100 p-1.5 rounded-xl">
                      <button
                        onClick={() => setSelectedForm('raw')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                          selectedForm === 'raw' 
                            ? 'bg-white text-prak-green shadow-sm' 
                            : 'text-gray-500 hover:text-prak-dark'
                        }`}
                      >
                        <Leaf size={14} /> Raw Roots
                      </button>
                      <button
                        onClick={() => setSelectedForm('powder')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                          selectedForm === 'powder' 
                            ? 'bg-white text-prak-green shadow-sm' 
                            : 'text-gray-500 hover:text-prak-dark'
                        }`}
                      >
                        <Beaker size={14} /> Fine Powder
                      </button>
                  </div>
                </div>

                {/* Weight Input */}
                <div className={`bg-white/60 p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md hover:bg-white/80 ${isBulkMode ? 'border-yellow-200 bg-yellow-50/20' : (isLowWeight ? 'border-amber-200 bg-amber-50/20' : 'border-white/50')}`}>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    <SlidersHorizontal size={16} className="text-prak-gold" />
                    3. {renderText('Total *Weight* (grams)')}
                  </label>
                  <div className="relative">
                    <input 
                      type="number" 
                      value={totalWeight}
                      onChange={handleWeightChange}
                      className={`w-full bg-white border rounded-xl px-4 py-3.5 text-gray-700 font-medium focus:outline-none focus:ring-2 transition-all ${isBulkMode ? 'border-yellow-300 focus:ring-yellow-200 text-yellow-800' : (isLowWeight ? 'border-amber-300 focus:ring-amber-200 text-amber-800' : 'border-gray-200 focus:ring-prak-green/30')}`}
                      min="500"
                      step="50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-bold">grams</span>
                  </div>
                  
                  {/* Low Weight Warning */}
                  {isLowWeight && (
                    <div className="mt-3 animate-fade-in-up">
                      <p className="text-sm text-amber-700 font-medium flex items-start gap-2 leading-tight">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        {renderText('Custom blends start at a minimum of *500g* to ensure the purity and accuracy of the ratios.')}
                      </p>
                      <p className="text-xs text-amber-800/70 mt-2 pl-6">
                        Looking for smaller quantities? <a href="#shop" className="underline font-bold hover:text-prak-green transition-colors">Browse our Pre-packed Raw Materials</a> for 250g options.
                      </p>
                    </div>
                  )}

                  {/* Tip */}
                  {!isBulkMode && !isLowWeight && totalWeight < 5000 && (
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      Tip: Reach 5000g for 15% Bulk Discount.
                    </p>
                  )}
                </div>
              </div>

              {/* Results Section / Bulk Pivot */}
              <div className={`lg:col-span-7 transition-all duration-500 ${results || isBulkMode ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 h-full flex flex-col">
                  <div className="bg-prak-green/5 p-5 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calculator className="text-prak-green" size={20} />
                      <span className="font-serif font-bold text-prak-dark text-lg">{renderText('Live *Quote*')}</span>
                    </div>
                    {selectedGoal && BLEND_RECIPES[selectedGoal] && !isBulkMode && !isLowWeight && (
                      <span className="text-xs font-bold bg-white text-prak-green px-3 py-1.5 rounded-full shadow-sm border border-green-100 flex items-center gap-1">
                        {BLEND_RECIPES[selectedGoal].title}
                      </span>
                    )}
                  </div>

                  {/* --- PIVOT UI: Bulk Order Inquiry --- */}
                  {isBulkMode ? (
                    <div className="p-8 flex flex-col items-center text-center animate-fade-in-up h-full justify-center">
                      <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-yellow-100">
                        <ClipboardCheck size={40} className="text-yellow-600" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold text-prak-dark mb-3">
                        {renderText('*Bulk Order* Inquiry')}
                      </h3>
                      <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
                        For orders exceeding {renderText('*5000g*')}, we offer specialized wholesale pricing and custom fulfillment. Our experts will generate a manual quote for you within 24 hours.
                      </p>
                      
                      <button 
                        onClick={handleBulkInquiry}
                        disabled={!selectedGoal}
                        className="w-full max-w-sm bg-yellow-500 hover:bg-yellow-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-yellow-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FileText size={20} />
                        {renderText('Request Professional *Quotation* for 5kg+')}
                      </button>
                      {!selectedGoal && <p className="text-xs text-red-400 mt-3 font-medium">Please select a health goal first.</p>}
                    </div>
                  ) : results ? (
                    <div className="p-0 flex-1 flex flex-col">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                            <tr>
                              <th className="px-5 py-4">Ingredient</th>
                              <th className="px-5 py-4 text-right">Weight</th>
                              <th className="px-5 py-4 text-center">Form</th>
                              <th className="px-5 py-4 text-right">Unit Rate</th>
                              <th className="px-5 py-4 text-right">Line Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {results.map((item, idx) => (
                              <tr key={idx} className="hover:bg-green-50/30 transition-colors group">
                                <td className="px-5 py-3 font-medium text-gray-700">{item.name}</td>
                                <td className="px-5 py-3 text-right text-gray-600 font-mono">{item.weight}g</td>
                                <td className="px-5 py-3 text-center">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                      item.form === 'raw' ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-600'
                                  }`}>
                                    {item.form}
                                  </span>
                                </td>
                                <td className="px-5 py-3 text-right text-gray-400 text-xs">₹{item.unitPrice}/kg</td>
                                <td className="px-5 py-3 text-right font-bold text-gray-800">₹{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Summary Footer */}
                      <div className="bg-gray-50 p-6 space-y-3 border-t border-gray-100">
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Subtotal</span>
                          <span>₹{results.reduce((a, b) => a + b.price, 0).toLocaleString()}</span>
                        </div>
                        
                        {discountApplied && (
                          <div className="flex justify-between items-center text-sm font-bold text-prak-green animate-pulse">
                            <span>{renderText(`*${discountApplied.label}* Applied`)}</span>
                            <span>-₹{discountApplied.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-end pt-3 border-t border-gray-200">
                          <span className="font-serif font-bold text-xl text-prak-dark">Total</span>
                          <span className="font-serif font-bold text-2xl text-prak-dark">
                            ₹{(results.reduce((a, b) => a + b.price, 0) - (discountApplied?.amount || 0)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </div>

                        <button 
                          onClick={handleAddToCart}
                          className="w-full mt-4 bg-prak-green hover:bg-prak-lightGreen text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={20} />
                          {renderText('Add *Entire Blend* to Cart')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400 min-h-[300px]">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Sparkles size={24} className="opacity-40" />
                      </div>
                      <p className="max-w-xs">Select a goal, choose your preferred material form, and enter a weight to generate a live quote.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlendingTool;
