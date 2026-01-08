
import React, { useState, useEffect } from 'react';
import { X, Trash2, CreditCard, CheckCircle, ChevronLeft, ShoppingBag, ShieldCheck, Smartphone, QrCode, ArrowRight } from 'lucide-react';
import { CartItem, Order } from '../types';
import { saveOrder } from '../services/storageService';
import { createPaymentIntent, verifyPaymentSignature, calculateCartSavings } from '../services/paymentService';
import { sendOrderEmails } from '../services/emailService';

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
  const [step, setStep] = useState<'cart' | 'details' | 'payment' | 'success'>('cart');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<{ upiLink: string, qrCodeUrl: string } | null>(null);
  
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const estimatedSavings = calculateCartSavings(totalAmount, cart);

  useEffect(() => {
    if (isOpen && step === 'success') {
       // Reset on reopen if needed, or handle cleanup
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const initPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // 1. Generate Payment Intent (UPI/QR)
    const intent = await createPaymentIntent(`ORD-${Date.now()}`, totalAmount);
    setPaymentData({ upiLink: intent.upiLink, qrCodeUrl: intent.qrCodeUrl });
    
    setIsProcessing(false);
    setStep('payment');
  };

  const handleFinalizeOrder = async () => {
    setIsProcessing(true);

    // Simulate Payment Gateway Success Callback
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Verify Signature (Mock)
    const mockOrderId = `ORD-${Date.now()}`;
    const mockPaymentId = `PAY-${Date.now()}`;
    const mockSig = `sig_${mockOrderId}_${mockPaymentId}`;
    
    const isValid = verifyPaymentSignature(mockOrderId, mockPaymentId, mockSig);
    
    if (isValid) {
        const newOrder: Order = {
            id: mockOrderId,
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            items: [...cart],
            totalAmount,
            status: 'Pending', // In real app, 'Paid'
            date: new Date().toISOString()
        };

        saveOrder(newOrder);
        
        // --- TRIGGER EMAIL NOTIFICATIONS ---
        // Fire and forget (in a real app, this might be a webhook response)
        sendOrderEmails(newOrder).catch(err => console.error("Email simulation failed", err));
        
        setStep('success');
        onClearCart();
    } else {
        alert("Payment Verification Failed. Please contact support.");
    }
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-milana-dark/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform duration-500 ease-in-out h-full flex flex-col glass-panel border-l border-white/20 shadow-2xl bg-milana-cream/95">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-milana-gold/20 bg-white/50 backdrop-blur-md sticky top-0 z-10">
            <h2 className="text-xl font-serif font-bold text-milana-green flex items-center gap-2">
               {step === 'cart' && <ShoppingBag className="text-milana-gold" size={24} />}
               {step === 'details' && 'Shipping Details'}
               {step === 'payment' && 'Secure Checkout'}
               {step === 'success' && 'Order Confirmed'}
               {step === 'cart' && 'Your Basket'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white/50 to-white/90">
            
            {/* --- STEP 1: CART --- */}
            {step === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                       <ShoppingBag size={40} className="opacity-50" />
                    </div>
                    <p className="text-lg font-medium">Your basket is empty.</p>
                    <button onClick={onClose} className="text-milana-green font-bold hover:underline">Start Shopping</button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in-up">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 rounded-xl bg-milana-cream overflow-hidden flex-shrink-0 border border-gray-100">
                           <div className="w-full h-full bg-milana-green/5 flex items-center justify-center text-milana-green font-serif font-bold text-xl">
                              {item.productName.charAt(0)}
                           </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-milana-dark text-lg">{item.productName}</h4>
                            <button onClick={() => onRemoveItem(idx)} className="text-gray-300 hover:text-red-400 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">{item.form} &bull; {item.quantity}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <p className="text-milana-green font-bold">₹{item.price.toLocaleString()}</p>
                             {['5kg', '10kg', '25kg', '50kg'].includes(item.quantity) && (
                                <span className="text-[10px] bg-milana-gold/20 text-milana-dark px-1.5 py-0.5 rounded-md font-bold">
                                   *Bulk Discount Applied*
                                </span>
                             )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {estimatedSavings > 0 && (
                        <div className="bg-green-50 p-3 rounded-xl text-center text-green-700 text-sm font-bold border border-green-100">
                            You are saving ₹{estimatedSavings.toLocaleString()} on this order!
                        </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* --- STEP 2: DETAILS --- */}
            {step === 'details' && (
              <form id="checkout-form" onSubmit={initPayment} className="space-y-6 animate-fade-in-up">
                <div className="space-y-4">
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Contact Info</h3>
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <label className="text-xs font-semibold text-gray-600">Full Name</label>
                       <input required name="name" type="text" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-milana-green/30 outline-none transition-all" onChange={handleInputChange} />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-semibold text-gray-600">Phone</label>
                       <input required name="phone" type="tel" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-milana-green/30 outline-none transition-all" onChange={handleInputChange} />
                     </div>
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-semibold text-gray-600">Email Address</label>
                     <input required name="email" type="email" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-milana-green/30 outline-none transition-all" onChange={handleInputChange} />
                   </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Shipping</h3>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Delivery Address</label>
                    <textarea required name="address" rows={3} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-milana-green/30 outline-none transition-all resize-none" onChange={handleInputChange}></textarea>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-milana-green/5 to-milana-gold/5 p-4 rounded-xl border border-milana-green/10 flex items-center gap-3">
                  <ShieldCheck className="text-milana-green" size={20} />
                  <p className="text-xs text-milana-dark opacity-70">
                      Processing via *Milanà Gateway*. Encrypted & Secure.
                  </p>
                </div>
              </form>
            )}

            {/* --- STEP 3: PAYMENT GATEWAY --- */}
            {step === 'payment' && paymentData && (
                <div className="animate-fade-in-up space-y-6 text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 inline-block">
                        <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Scan to Pay</h3>
                        <div className="relative group cursor-pointer">
                            <img src={paymentData.qrCodeUrl} alt="UPI QR" className="w-48 h-48 mx-auto mix-blend-multiply" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/80">
                                <QrCode className="text-milana-green" size={32} />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Supports BHIM, PhonePe, GPay</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2 justify-center opacity-70 mb-2">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-4" />
                             <span className="text-xs text-gray-400">|</span>
                             <span className="text-xs font-bold text-blue-800">Razorpay</span>
                        </div>

                        <a 
                           href={paymentData.upiLink} 
                           className="w-full bg-milana-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-milana-lightGreen transition-colors shadow-lg shadow-milana-green/20"
                        >
                            <Smartphone size={20} />
                            Pay ₹{totalAmount.toLocaleString()} via UPI App
                        </a>
                        
                        <button 
                            onClick={handleFinalizeOrder} 
                            disabled={isProcessing}
                            className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors text-sm"
                        >
                            {isProcessing ? 'Verifying Payment...' : 'I have completed the payment'}
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-green-600 font-bold bg-green-50 py-2 rounded-lg">
                        <CheckCircle size={12} />
                        Price inclusive of *Bulk Discount*
                    </div>
                </div>
            )}

            {/* --- STEP 4: SUCCESS --- */}
            {step === 'success' && (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up">
                <div className="w-24 h-24 bg-milana-green/10 rounded-full flex items-center justify-center text-milana-green mb-6 animate-float">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-milana-dark mb-4">Order Confirmed!</h3>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">We've received your payment. A confirmation for <span className="font-bold text-milana-dark">{formData.name}</span> has been sent.</p>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 w-full mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Amount Paid</span>
                        <span className="font-bold text-milana-dark">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Payment ID</span>
                        <span className="font-mono text-xs text-gray-400">PAY-{Date.now().toString().slice(-6)}</span>
                    </div>
                </div>
                <button onClick={onClose} className="bg-milana-dark text-white px-8 py-3 rounded-full font-bold hover:bg-milana-green transition-colors shadow-lg">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {step !== 'success' && step !== 'payment' && (
            <div className="p-6 border-t border-milana-gold/10 bg-white/80 backdrop-blur-md">
              <div className="flex justify-between items-end mb-6">
                <span className="text-gray-500 font-medium">Total</span>
                <span className="text-3xl font-serif font-bold text-milana-dark">₹{totalAmount.toLocaleString()}</span>
              </div>
              
              {step === 'cart' && (
                <button 
                  onClick={() => setStep('details')} 
                  disabled={cart.length === 0}
                  className="w-full bg-milana-dark hover:bg-milana-green text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={20} />
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
                    className="flex-1 bg-milana-dark hover:bg-milana-green text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : 'Secure Checkout by *Milanà*'}
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
