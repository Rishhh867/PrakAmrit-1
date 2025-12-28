
import React, { useState, useEffect } from 'react';
import { FileText, Send, LogOut, Package, Check, Download, MessageCircle, Image as ImageIcon, Sparkles, RefreshCw, Layers, Leaf } from 'lucide-react';
import { Order, Product } from '../types';
import { PRODUCTS } from '../constants';
import { getOrders, updateOrder } from '../services/storageService';
import { generateQuotationPDF } from '../services/pdfService';
import { sendWhatsAppNotification } from '../services/notificationService';
import { generateAIProductImage, applyWatermark } from '../services/imageService';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'orders' | 'brand-studio';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Orders State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Brand Studio State
  const [generatingProductId, setGeneratingProductId] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({}); // ProductID -> Base64 URL

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  // --- Order Management Functions ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadingForId(orderId);
    }
  };

  const handleSendQuotation = async (order: Order) => {
    if (!selectedFile && !order.quotationFile) return;
    setProcessingId(order.id);
    
    const updatedOrder: Order = {
      ...order,
      status: 'Quotation Sent',
      quotationFile: selectedFile ? selectedFile.name : order.quotationFile
    };

    updateOrder(updatedOrder);

    if (order.whatsapp) {
        await sendWhatsAppNotification({
            to: order.whatsapp,
            customerName: order.customerName,
            type: 'QUOTE_READY',
            link: `https://milana.com/quote/${order.id}`
        });
    }

    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    setSelectedFile(null);
    setUploadingForId(null);
    setProcessingId(null);

    alert(`*Quotation* sent to ${order.email} & WhatsApp (${order.whatsapp}) successfully!`);
  };

  const handleApproveAndSend = async (order: Order) => {
    setProcessingId(order.id);
    generateQuotationPDF(order);

    const updatedOrder: Order = {
      ...order,
      status: 'Quotation Sent',
      quotationFile: `Generated_${order.id}.pdf`
    };
    
    updateOrder(updatedOrder);

    if (order.whatsapp) {
        await sendWhatsAppNotification({
            to: order.whatsapp,
            customerName: order.customerName,
            type: 'QUOTE_READY',
            link: `https://milana.com/quote/${order.id}`
        });
    }

    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    setProcessingId(null);
    alert(`[AUTOMATION] *Quotation* PDF Generated & Sent to ${order.email} and WhatsApp.`);
  };

  // --- Brand Studio Functions ---
  const handleGenerateImage = async (product: Product) => {
    setGeneratingProductId(product.id);
    
    // 1. Generate Raw Image
    const rawImage = await generateAIProductImage(product);
    
    if (rawImage) {
        // 2. Apply Watermark
        const watermarked = await applyWatermark(rawImage);
        setGeneratedImages(prev => ({...prev, [product.id]: watermarked}));
    } else {
        alert("Failed to generate image. Please check API Key or try again.");
    }

    setGeneratingProductId(null);
  };

  const handleDownloadImage = (productId: string, productName: string) => {
    const link = document.createElement('a');
    link.href = generatedImages[productId];
    link.download = `Milana_${productName.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-prak-green text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
            <h1 className="text-xl font-serif font-bold flex items-center gap-2">
                <Leaf className="text-prak-gold" />
                Milanà Admin
            </h1>
            <div className="flex gap-2 bg-white/10 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-prak-green shadow-sm' : 'hover:bg-white/10 text-white/80'}`}
                >
                    Orders
                </button>
                <button 
                  onClick={() => setActiveTab('brand-studio')}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'brand-studio' ? 'bg-white text-prak-green shadow-sm' : 'hover:bg-white/10 text-white/80'}`}
                >
                    <ImageIcon size={16} /> Brand Studio
                </button>
            </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-sm">
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        
        {/* --- ORDERS TAB --- */}
        {activeTab === 'orders' && (
            <div className="animate-fade-in-up">
                <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-600">
                    Total Orders: <span className="font-bold text-prak-green">{orders.length}</span>
                </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {orders.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No pending requests found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Order ID</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Customer</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Items</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Action</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                                <span className="font-medium text-gray-900 block">{order.id}</span>
                                <span className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm">
                                <p className="font-medium">{order.customerName}</p>
                                {order.businessName && <p className="text-xs font-bold text-prak-green">{order.businessName}</p>}
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                    <MessageCircle size={12} className={order.whatsapp ? "text-green-500" : "text-gray-300"} />
                                    {order.whatsapp || order.phone}
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <ul className="text-sm text-gray-600 space-y-1">
                                {order.items.map((item, idx) => (
                                    <li key={idx}>
                                    {item.quantity} {item.form} {item.productName}
                                    </li>
                                ))}
                                <li className="pt-1 font-bold text-prak-brown border-t mt-1">
                                    Total: ₹{order.totalAmount.toLocaleString()}
                                </li>
                                </ul>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'Pending' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : order.status === 'Quote Requested'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-2">
                                {order.status === 'Pending' && (
                                    <>
                                    <label className="flex items-center justify-center gap-2 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs transition-colors">
                                        <FileText size={14} />
                                        Upload PDF
                                        <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileChange(e, order.id)} />
                                    </label>
                                    <button
                                        onClick={() => handleSendQuotation(order)}
                                        disabled={uploadingForId !== order.id || !selectedFile || processingId === order.id}
                                        className="flex items-center justify-center gap-2 bg-prak-green hover:bg-prak-lightGreen text-white px-3 py-1.5 rounded-md text-xs disabled:opacity-50 transition-colors"
                                    >
                                        {processingId === order.id ? 'Sending...' : <><Send size={14} /> Send Quote</>}
                                    </button>
                                    </>
                                )}

                                {order.status === 'Quote Requested' && (
                                    <button
                                        onClick={() => handleApproveAndSend(order)}
                                        disabled={processingId === order.id}
                                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs transition-colors shadow-sm disabled:opacity-70"
                                    >
                                        {processingId === order.id ? 'Processing...' : <><Check size={14} /> Approve & Send</>}
                                    </button>
                                )}

                                {order.status === 'Quotation Sent' && (
                                    <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <Check size={16} /> Sent
                                    </div>
                                )}
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                )}
                </div>
            </div>
        )}

        {/* --- BRAND STUDIO TAB --- */}
        {activeTab === 'brand-studio' && (
            <div className="animate-fade-in-up">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Sparkles className="text-prak-gold" /> 
                            Product Image Engine
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Auto-generate branded assets with *Milanà* watermark.</p>
                    </div>
                    <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100">
                        <Layers size={14} />
                        Model: gemini-2.5-flash-image
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PRODUCTS.map(product => (
                        <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col group">
                            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                {generatedImages[product.id] ? (
                                    <img 
                                        src={generatedImages[product.id]} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center flex-col gap-3 text-gray-400">
                                        <ImageIcon size={32} />
                                        <span className="text-xs font-medium">No Asset Generated</span>
                                    </div>
                                )}

                                {/* Loading Overlay */}
                                {generatingProductId === product.id && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center flex-col gap-3 text-white z-10">
                                        <RefreshCw size={24} className="animate-spin" />
                                        <span className="text-xs font-bold animate-pulse">Rendering 8k Texture...</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <div className="mb-4">
                                    <h3 className="font-serif font-bold text-prak-dark">{product.name}</h3>
                                    <p className="text-xs text-gray-500 italic">{product.botanicalName}</p>
                                </div>
                                
                                <div className="mt-auto flex gap-2">
                                    <button 
                                        onClick={() => handleGenerateImage(product)}
                                        disabled={generatingProductId === product.id}
                                        className="flex-1 bg-prak-dark hover:bg-prak-green text-white py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Sparkles size={14} />
                                        {generatedImages[product.id] ? 'Regenerate' : 'Generate AI'}
                                    </button>
                                    
                                    {generatedImages[product.id] && (
                                        <button 
                                            onClick={() => handleDownloadImage(product.id, product.name)}
                                            className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                            title="Download Watermarked"
                                        >
                                            <Download size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
