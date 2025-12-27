
/**
 * PrakAmrit Notification Service
 * 
 * In a production environment, this file would be a Node.js backend controller 
 * interacting with the Twilio API or Meta WhatsApp Business API.
 * 
 * Current Implementation: Simulates API calls and logs the *quotation* logic to console.
 */

interface WhatsAppPayload {
  to: string;
  customerName: string;
  productName?: string;
  link?: string;
  type: 'REQ_RECEIVED' | 'QUOTE_READY';
}

export const sendWhatsAppNotification = async (payload: WhatsAppPayload): Promise<boolean> => {
  const { to, customerName, productName, link, type } = payload;

  console.log(`[WhatsApp API] Initializing connection to *Twilio* for: ${to}`);

  // Simulate Network Delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let messageBody = '';

  if (type === 'REQ_RECEIVED') {
    // Template 1: Acknowledgement
    messageBody = `Namaste ${customerName}! Thank you for choosing PrakAmrit. We have received your request for ${productName || 'Bulk Materials'}. Our team is preparing your *quotation*. You will receive a link here shortly to view and pay.`;
  } else if (type === 'QUOTE_READY') {
    // Template 2: Action Required
    messageBody = `Your PrakAmrit *quotation* is ready! Click here to view and complete your payment: ${link || 'https://prakamrit.com/pay/xyz'}`;
  }

  // --- MOCK API CALL ---
  // const client = require('twilio')(accountSid, authToken);
  // await client.messages.create({ body: messageBody, from: 'whatsapp:+14155238886', to: `whatsapp:${to}` });
  
  console.log(`%c[WhatsApp Sent] To: ${to}`, 'color: #25D366; font-weight: bold; font-size: 12px');
  console.log(`%cBody: ${messageBody}`, 'color: #555; font-style: italic');
  
  // Logic: Also trigger an internal email to Archana (Simulated)
  if (type === 'REQ_RECEIVED') {
    console.log(`[Internal Email] To: archana@irisstar.tech | Subject: New Bulk Inquiry from ${customerName}`);
  }

  return true;
};
