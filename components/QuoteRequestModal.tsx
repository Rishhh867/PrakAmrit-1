
import React, { useState } from 'react';
import { X, FileText, Briefcase, Mail, Phone, User, CheckCircle, MessageCircle } from 'lucide-react';
import { CartItem, Order } from '../types';
import { saveOrder } from '../services/storageService';
import { sendWhatsAppNotification } from '../services/notificationService';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CartItem; // The bulk item being requested
}

const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ isOpen, onClose, item }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create the *Order Record* with 'Quote Requested' status
    const newOrder: Order = {
      id: `QUOTE-${Date.now()}`,
      customerName: formData.contactName,
      businessName: formData.businessName,
      email: formData.email,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone, // Fallback to phone if same
      address: formData.address,
      items: [item], // Single item quote for now
      totalAmount: item.price,
      status: 'Quote Requested',
      date: new Date().toISOString()
    };

    // 1. Save to Database (Local Storage)
    saveOrder(newOrder);

    // 2. Trigger *WhatsApp Notification* (Simulated Backend)
    await sendWhatsAppNotification({
      to: newOrder.whatsapp || newOrder.phone,
      customerName: newOrder.customerName,
      productName: item.productName,
      type: 'REQ_RECEIVED'
    });

    setIsSubmitting(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-prak-dark p-6 text-white flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
              <FileText className="text-prak-gold" />
              Request {React.createElement('span', { className: 'font-bold' }, '*Quotation*')}
            </h2>
            <p className="text-white/60 text-sm mt-1">For Bulk Order: {item.quantity} of {item.productName}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Business Details</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    required 
                    placeholder="Company / Business Name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-prak-green/30 outline-none transition-all"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Contact Person</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                      required 
                      placeholder="Full Name"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-prak-green/30 outline-none transition-all"
                      value={formData.contactName}
                      onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Mobile No.</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                    <input 
                      required 
                      type="tel"
                      placeholder="+91 98765..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-prak-green/30 outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* NEW: WhatsApp Field */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-green-600 uppercase flex items-center gap-1">
                   <MessageCircle size={12} /> WhatsApp for Updates
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3.5 text-green-500">
                     <MessageCircle size={16} />
                  </div>
                  <input 
                    required 
                    type="tel"
                    placeholder="WhatsApp Number (e.g. +91...)"
                    className="w-full bg-green-50 border border-green-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-green-500/30 outline-none transition-all placeholder-green-700/30 text-green-800 font-medium"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  />
                </div>
                <p className="text-[10px] text-gray-400 pl-1">We will send your *quotation* link here.</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Official Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                  <input 
                    required 
                    type="email"
                    placeholder="name@company.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-prak-green/30 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 border border-gray-100">
                <div className="flex justify-between mb-2">
                   <span>Estimated Cost:</span>
                   <span className="font-bold">₹{item.price.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400">*Final *quotation* may vary based on daily market rates. A PDF will be sent to your email & WhatsApp.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-prak-green text-white py-4 rounded-xl font-bold hover:bg-prak-lightGreen shadow-lg shadow-prak-green/20 transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing...' : 'Submit Request'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-prak-dark mb-2">Request Received</h3>
              <p className="text-gray-500 mb-8">
                Our team will review your bulk requirement for <span className="font-bold text-gray-700">{item.quantity}</span> of <span className="font-bold text-gray-700">{item.productName}</span>.
                <br/>You will receive a PDF *quotation* at <strong>{formData.whatsapp}</strong> shortly.
              </p>
              <button onClick={onClose} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
                Back to Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestModal;
