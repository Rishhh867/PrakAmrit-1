
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../types';

/**
 * Generates a professional PDF quotation for *Bulk Orders*.
 * Uses jsPDF to construct the layout and autoTable for the itemized list.
 */
export const generateQuotationPDF = (order: Order): void => {
  const doc = new jsPDF();

  // --- Header ---
  // *Logo Placeholder* (Text for now)
  doc.setFontSize(24);
  doc.setTextColor(27, 67, 50); // PrakAmrit Green
  doc.setFont("helvetica", "bold");
  doc.text("PrakAmrit Ayurveda", 20, 25);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Raw Materials & Extracts", 20, 32);
  doc.text("contact@prakamrit.com | +91 98765 43210", 20, 37);

  // --- Document Title ---
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("PROFORMA QUOTATION", 140, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Ref No: ${order.id}`, 140, 32);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 37);
  doc.text(`Valid Until: ${new Date(Date.now() + 7 * 86400000).toLocaleDateString()}`, 140, 42);

  // --- Customer Details ---
  doc.setDrawColor(200);
  doc.line(20, 50, 190, 50);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Bill To:", 20, 60);
  
  doc.setFont("helvetica", "normal");
  doc.text(`Business Name: ${order.businessName || 'N/A'}`, 20, 66);
  doc.text(`Contact: ${order.customerName}`, 20, 72);
  doc.text(`Email: ${order.email}`, 20, 78);
  doc.text(`Phone: ${order.phone}`, 20, 84);

  // --- *Itemized Table* ---
  const tableColumn = ["Item Description", "Form", "Qty", "Market Rate", "Bulk Discount", "Total (INR)"];
  const tableRows: any[] = [];

  order.items.forEach(item => {
    // Logic: Reverse calculate discount for display
    // Note: The price stored in item.price is already the discounted total.
    // For the PDF, we want to show the calculation.
    
    // Check if bulk
    const isBulk = ['5kg', '10kg', '25kg', '50kg'].includes(item.quantity);
    let discountLabel = "0%";
    if (item.quantity === '5kg') discountLabel = "15%";
    if (item.quantity === '10kg') discountLabel = "25%";
    if (item.quantity === '25kg') discountLabel = "30%";
    if (item.quantity === '50kg') discountLabel = "35%";

    const rowData = [
      item.productName,
      item.form.toUpperCase(),
      item.quantity,
      "Dynamic", // Mocking market rate text
      discountLabel,
      item.price.toLocaleString()
    ];
    tableRows.push(rowData);
  });

  // @ts-ignore - jspdf-autotable types might not be perfectly resolved in this env
  autoTable(doc, {
    startY: 95,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [27, 67, 50], textColor: 255 },
    styles: { fontSize: 10, cellPadding: 3 },
  });

  // --- *Totals Calculation* ---
  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY || 150;
  
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total: INR ${order.totalAmount.toLocaleString()}`, 140, finalY + 15);

  // --- Terms & Footer ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Terms & Conditions:", 20, finalY + 30);
  
  doc.setFont("helvetica", "normal");
  doc.text("1. Rates are subject to market fluctuation. This quote is valid for 7 days.", 20, finalY + 36);
  doc.text("2. Payment Terms: *50% Advance* required to confirm bulk orders.", 20, finalY + 41);
  doc.text("3. Delivery timeline: 5-7 business days post payment.", 20, finalY + 46);

  // --- Save File ---
  doc.save(`PrakAmrit_Quote_${order.id}.pdf`);
};
