
import React, { useState } from 'react';
import { X, Trash2, CreditCard, CheckCircle, ChevronLeft, ShoppingBag } from 'lucide-react';
import { CartItem, Order } from '../types';
import { saveOrder } from '../services/storageService';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, cart, onRemoveItem, onClearCart }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      items: [...cart],
      totalAmount,
      status: 'Pending',
      date: new Date().toISOString()
    };

    saveOrder(newOrder);
    
    // Simulate Email to Owner
    console.log(`[EMAIL SIMULATION] To: owner@milana.com | Subject: New Order ${newOrder.id}`);
    console.log(`Body: Customer ${newOrder.customerName} placed an order for ₹${newOrder.totalAmount}.`);

    setIsProcessing(false);
    setStep('success');
    onClearCart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out h-full flex flex-col glass-panel border-l border-white/40 shadow-2xl bg-white/95">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-2xl font-serif font-bold text-prak-dark flex items-center gap-2">
               {step === 'cart' && <ShoppingBag className="text-prak-green" size={24} />}
               {step === 'details' && 'Checkout'}
               {step === 'success' && 'Confirmed'}
               {step === 'cart' && 'Your Basket'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white/50 to-white/90">
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                       <ShoppingBag size={40} className="opacity-50" />
                    </div>
                    <p className="text-lg font-medium">Your basket is empty.</p>
                    <button onClick={onClose} className="text-prak-green font-bold hover:underline">Start Shopping</button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in-up">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                           {/* Placeholder image logic or just color block */}
                           <div className="w-full h-full bg-prak-green/10 flex items-center justify-center text-prak-green font-serif font-bold text-xl">
                              {item.productName.charAt(0)}
                           </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-prak-dark text-lg">{item.productName}</h4>
                            <button onClick={() => onRemoveItem(idx)} className="text-gray-300 hover:text-red-400 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">{item.form} &bull; {item.quantity}</p>
                          <p className="text-prak-green font-bold mt-2">₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {step === 'details' && (
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6 animate-fade-in-up">
                <div className="space-y-4">
                   <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Contact Info</h3>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <label className="text-xs font-semibold text-gray-600">Full Name</label>
                       <input required name="name" type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-prak-green/30 outline-none transition-all" onChange={handleInputChange} />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-semibold text-gray-600">Phone</label>
                       <input required name="phone" type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-prak-green/30 outline-none transition-all" onChange={handleInputChange} />
                     </div>
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-600">Email Address</label>
                     <input required name="email" type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-prak-green/30 outline-none transition-all" onChange={handleInputChange} />
                   </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Shipping</h3>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Delivery Address</label>
                    <textarea required name="address" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-prak-green/30 outline-none transition-all resize-none" onChange={handleInputChange}></textarea>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                     <CreditCard size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">Secure Payment Gateway</h4>
                    <p className="text-xs text-blue-700/70 mt-1 leading-relaxed">Encrypted processing. This is a demo; no actual charge will be made.</p>
                  </div>
                </div>
              </form>
            )}

            {step === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-float">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-prak-dark mb-4">Order Confirmed!</h3>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">We've received your order. A confirmation email has been sent to <span className="text-prak-dark font-medium">{formData.email}</span>.</p>
                <button onClick={onClose} className="bg-prak-dark text-white px-8 py-3 rounded-full font-bold hover:bg-prak-green transition-colors shadow-lg">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {step !== 'success' && (
            <div className="p-6 border-t border-gray-100 bg-white/80 backdrop-blur-md">
              <div className="flex justify-between items-end mb-6">
                <span className="text-gray-500 font-medium">Total</span>
                <span className="text-3xl font-serif font-bold text-prak-dark">₹{totalAmount.toLocaleString()}</span>
              </div>
              
              {step === 'cart' && (
                <button 
                  onClick={() => setStep('details')} 
                  disabled={cart.length === 0}
                  className="w-full bg-prak-dark hover:bg-prak-green text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Proceed to Checkout
                </button>
              )}

              {step === 'details' && (
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep('cart')}
                    className="px-6 py-4 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    form="checkout-form"
                    type="submit"
                    disabled={isProcessing}
                    className="flex-1 bg-prak-dark hover:bg-prak-green text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : 'Place Order'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
