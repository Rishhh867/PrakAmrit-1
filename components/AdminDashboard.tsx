
import React, { useState, useEffect } from 'react';
import { FileText, Send, LogOut, Package, Check, Download, MessageCircle } from 'lucide-react';
import { Order } from '../types';
import { getOrders, updateOrder } from '../services/storageService';
import { generateQuotationPDF } from '../services/pdfService';
import { sendWhatsAppNotification } from '../services/notificationService';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, orderId: string) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadingForId(orderId);
    }
  };

  const handleSendQuotation = async (order: Order) => {
    if (!selectedFile && !order.quotationFile) return;
    setProcessingId(order.id);
    
    // Simulate updating the order status and "sending" the email
    const updatedOrder: Order = {
      ...order,
      status: 'Quotation Sent',
      quotationFile: selectedFile ? selectedFile.name : order.quotationFile
    };

    updateOrder(updatedOrder);

    // Trigger *WhatsApp* Notification (Quote Ready)
    if (order.whatsapp) {
        await sendWhatsAppNotification({
            to: order.whatsapp,
            customerName: order.customerName,
            type: 'QUOTE_READY',
            link: `https://prakamrit.com/quote/${order.id}`
        });
    }

    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    setSelectedFile(null);
    setUploadingForId(null);
    setProcessingId(null);

    alert(`*Quotation* sent to ${order.email} & WhatsApp (${order.whatsapp}) successfully!`);
  };

  // *Market Rate* Approval Logic
  const handleApproveAndSend = async (order: Order) => {
    setProcessingId(order.id);

    // 1. Generate PDF (Simulates backend generation)
    generateQuotationPDF(order);

    // 2. Update Status
    const updatedOrder: Order = {
      ...order,
      status: 'Quotation Sent',
      quotationFile: `Generated_${order.id}.pdf`
    };
    
    updateOrder(updatedOrder);

    // 3. Trigger *WhatsApp* Notification (Quote Ready)
    if (order.whatsapp) {
        await sendWhatsAppNotification({
            to: order.whatsapp,
            customerName: order.customerName,
            type: 'QUOTE_READY',
            link: `https://prakamrit.com/quote/${order.id}`
        });
    }

    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    setProcessingId(null);
    
    // 4. Simulation Feedback
    alert(`[AUTOMATION] *Quotation* PDF Generated & Sent to ${order.email} and WhatsApp.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-prak-green text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-serif font-bold">PrakAmrit Admin</h1>
        <button onClick={onLogout} className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
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
                    <th className="px-6 py-4 font-semibold text-gray-600 text-sm">Order ID / Date</th>
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
                          <p className="text-xs text-gray-400">{order.email}</p>
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
                            Val: ₹{order.totalAmount.toLocaleString()}
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
                          
                          {/* Case 1: Manual Quote Upload (Legacy) */}
                          {order.status === 'Pending' && (
                            <>
                              <label className="flex items-center justify-center gap-2 cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md text-xs transition-colors">
                                <FileText size={14} />
                                {uploadingForId === order.id && selectedFile ? selectedFile.name.substring(0, 15) + '...' : 'Attach PDF'}
                                <input 
                                  type="file" 
                                  accept=".pdf" 
                                  className="hidden" 
                                  onChange={(e) => handleFileChange(e, order.id)} 
                                />
                              </label>
                              <button
                                onClick={() => handleSendQuotation(order)}
                                disabled={uploadingForId !== order.id || !selectedFile || processingId === order.id}
                                className="flex items-center justify-center gap-2 bg-prak-green hover:bg-prak-lightGreen text-white px-3 py-1.5 rounded-md text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {processingId === order.id ? 'Sending...' : <><Send size={14} /> Send Quote</>}
                              </button>
                            </>
                          )}

                          {/* Case 2: Automated B2B Quote Approval */}
                          {order.status === 'Quote Requested' && (
                            <button
                                onClick={() => handleApproveAndSend(order)}
                                disabled={processingId === order.id}
                                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs transition-colors shadow-sm disabled:opacity-70"
                              >
                                {processingId === order.id ? 'Processing...' : <><Check size={14} /> Approve & Send</>}
                              </button>
                          )}

                          {/* Case 3: Completed */}
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
      </main>
    </div>
  );
};

export default AdminDashboard;
