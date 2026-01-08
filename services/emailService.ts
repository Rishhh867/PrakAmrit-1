
import { Order } from '../types';
import { PRODUCTS } from '../constants';

/**
 * Milanà Email Notification Service
 * 
 * Handles generation of premium HTML email templates for transactional messaging.
 * Simulates backend rendering logic (like Handlebars/EJS) within the frontend client.
 */

// --- Helper: Get Product Image ---
const getProductImage = (productId: string): string => {
  const product = PRODUCTS.find(p => p.id === productId);
  return product ? product.image : 'https://via.placeholder.com/100x100?text=Milana';
};

// --- Helper: Date Formatter ---
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Generates the *Customer Receipt Email* HTML.
 * Style: Modern Ayurvedic Luxury.
 */
export const generateCustomerReceiptHTML = (order: Order): string => {
  
  // 1. Calculate Financials for Display
  const subtotal = order.totalAmount; // Assuming stored price is final
  // Mocking shipping for display purposes (Free for high value)
  const shipping = order.totalAmount > 5000 ? 0 : 150; 
  const total = subtotal + shipping;

  // 2. Generate *Item Rows*
  const itemsHtml = order.items.map(item => {
    const imageUrl = getProductImage(item.productId);
    return `
      <tr>
        <td width="20%" style="padding: 15px 0; border-bottom: 1px solid #eeeeee;">
           <img src="${imageUrl}" alt="${item.productName}" width="64" height="64" style="display: block; border-radius: 8px; object-fit: cover;" />
        </td>
        <td width="50%" style="padding: 15px 10px; border-bottom: 1px solid #eeeeee; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333; vertical-align: middle;">
          <strong style="font-size: 15px; color: #013220; font-family: 'Playfair Display', serif; letter-spacing: 0.5px;">${item.productName}</strong><br />
          <span style="font-size: 12px; color: #777;">Form: ${item.form.toUpperCase()} | Qty: ${item.quantity}</span>
        </td>
        <td width="30%" style="padding: 15px 0; border-bottom: 1px solid #eeeeee; text-align: right; font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: bold; color: #333333; vertical-align: middle;">
          ₹${item.price.toLocaleString()}
        </td>
      </tr>
    `;
  }).join('');

  // 3. Return Complete *HTML Template*
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Milanà Order Confirmation</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
        
        /* Mobile Resets */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; }
        
        /* Responsive */
        @media screen and (max-width: 600px) {
          .container { width: 100% !important; }
          .mobile-center { text-align: center !important; }
          .mobile-stack { display: block !important; width: 100% !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F9F9F9; font-family: 'Helvetica Neue', Arial, sans-serif;">
      
      <!-- Main Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F9F9F9;">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            
            <!-- Email Wrapper -->
            <table border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
              
              <!-- Header -->
              <tr>
                <td align="center" style="background-color: #013220; padding: 40px 0;">
                  <h1 style="margin: 0; font-family: 'Playfair Display', serif; font-size: 32px; color: #D4AF37; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Milanà</h1>
                  <p style="margin: 5px 0 0; color: #a8c5b5; font-size: 10px; text-transform: uppercase; letter-spacing: 3px;">Modern Ayurvedic Luxury</p>
                </td>
              </tr>

              <!-- Greeting Section -->
              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <h2 style="margin: 0 0 20px; font-family: 'Playfair Display', serif; font-size: 24px; color: #013220; font-weight: 400;">
                    Thank you for bringing Milanà into your home, ${order.customerName}.
                  </h2>
                  <p style="margin: 0 0 20px; font-size: 14px; line-height: 24px; color: #555555;">
                    We are honored to support your wellness journey. Your order <strong style="color: #013220;">#${order.id}</strong> has been successfully confirmed and is being prepared with the utmost care at our heritage warehouse.
                  </p>
                  
                  <!-- Info Grid -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F9F9F9; border-radius: 8px; margin-bottom: 20px;">
                    <tr>
                      <td width="50%" style="padding: 15px; font-size: 12px; color: #777; border-right: 1px solid #eeeeee;">
                        <strong style="display: block; color: #333; text-transform: uppercase; margin-bottom: 4px;">Order Date</strong>
                        ${formatDate(order.date)}
                      </td>
                      <td width="50%" style="padding: 15px; font-size: 12px; color: #777;">
                        <strong style="display: block; color: #333; text-transform: uppercase; margin-bottom: 4px;">Payment Method</strong>
                        Verified Online Payment
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Order Summary Table -->
              <tr>
                <td style="padding: 0 40px;">
                  <h3 style="margin: 0 0 15px; font-family: 'Playfair Display', serif; font-size: 18px; color: #013220; border-bottom: 2px solid #D4AF37; display: inline-block; padding-bottom: 5px;">Order Summary</h3>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    ${itemsHtml}
                  </table>
                </td>
              </tr>

              <!-- Financial Breakdown -->
              <tr>
                <td style="padding: 20px 40px 40px 40px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="right" style="padding-top: 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="200">
                          <tr>
                            <td style="padding: 5px 0; color: #777; font-size: 14px;">Subtotal</td>
                            <td align="right" style="padding: 5px 0; color: #333; font-size: 14px; font-weight: bold;">₹${subtotal.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td style="padding: 5px 0; color: #777; font-size: 14px;">Shipping</td>
                            <td align="right" style="padding: 5px 0; color: #333; font-size: 14px; font-weight: bold;">${shipping === 0 ? 'Free' : '₹' + shipping}</td>
                          </tr>
                          <tr>
                            <td style="padding: 15px 0 5px 0; color: #013220; font-size: 16px; font-weight: bold; border-top: 1px solid #eee;">Grand Total</td>
                            <td align="right" style="padding: 15px 0 5px 0; color: #013220; font-size: 18px; font-weight: bold; border-top: 1px solid #eee;">₹${total.toLocaleString()}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Shipping Address -->
              <tr>
                <td style="background-color: #F5F7F6; padding: 30px 40px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td valign="top">
                        <h4 style="margin: 0 0 10px; color: #013220; font-size: 14px; text-transform: uppercase;">Delivery Address</h4>
                        <p style="margin: 0; color: #555; font-size: 14px; line-height: 22px;">
                          ${order.customerName}<br>
                          ${order.address}<br>
                          Phone: ${order.phone}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="background-color: #013220; padding: 40px;">
                  <p style="margin: 0 0 10px; color: #D4AF37; font-family: 'Playfair Display', serif; font-size: 16px; font-style: italic;">
                    "Purity in every grain."
                  </p>
                  <p style="margin: 0 0 20px; color: #a8c5b5; font-size: 12px; line-height: 20px;">
                    Milanà Ayurveda | Jaipur, Rajasthan, India<br>
                    <a href="mailto:support@milana.com" style="color: #ffffff; text-decoration: none;">support@milana.com</a>
                  </p>
                  <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                     <a href="#" style="color: #ffffff; text-decoration: none; font-size: 12px; margin: 0 10px;">Instagram</a>
                     <a href="#" style="color: #ffffff; text-decoration: none; font-size: 12px; margin: 0 10px;">Website</a>
                  </div>
                </td>
              </tr>

            </table>
            <!-- End Email Wrapper -->
            
            <p style="text-align: center; color: #999; font-size: 11px; margin-top: 20px;">
              &copy; ${new Date().getFullYear()} Milanà Ayurveda. All rights reserved.
            </p>

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// --- 2. Admin Alert Logic ---

const generateAdminAlertText = (order: Order): string => {
  const bulkItems = order.items.filter(i => ['10kg', '25kg', '50kg'].includes(i.quantity));
  const hasBulk = bulkItems.length > 0;
  
  return `
    [URGENT] NEW ORDER BOOKED: #${order.id}
    --------------------------------------------------
    Customer: ${order.customerName}
    Phone: ${order.phone}
    Address: ${order.address}
    
    Order Summary:
    Total Items: ${order.items.length}
    Total Value: ₹${order.totalAmount.toLocaleString()}
    
    ${hasBulk ? `*** BULK ALERT: WAREHOUSE ACTION REQUIRED ***\nThis order contains bulk quantities:\n${bulkItems.map(i => `- ${i.productName} (${i.quantity})`).join('\n')}` : ''}
    
    Payment Status: VERIFIED (Razorpay/UPI)
  `;
};

// --- 3. Transport Logic (Simulated Node.js) ---

export const sendOrderEmails = async (order: Order): Promise<void> => {
  console.group('%c[Backend Node.js Logic] Email Service Triggered', 'color: #c5a059; font-weight: bold; font-size: 12px;');
  
  // Simulate SMTP Connection
  console.log('1. *Initializing SMTP Transport* (host: smtp.milana.com, port: 587)...');
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('2. *SMTP Connection Established*. Secure (TLS).');

  // --- Send Email 1: Customer Receipt ---
  const customerHtml = generateCustomerReceiptHTML(order);
  console.log(`3. *Triggering Customer Email* to: ${order.email}`);
  console.log(`   Subject: Order Confirmation - #${order.id}`);
  
  // DEBUG: Log the full HTML to console for verification if needed
  // console.log(customerHtml);

  // --- Send Email 2: Admin Alert ---
  const adminText = generateAdminAlertText(order);
  console.log(`4. *Triggering Admin Alert* to: admin@milana.com`);
  console.log(`   Subject: NEW ORDER: ${order.id}`);

  if (order.items.some(i => ['25kg', '50kg'].includes(i.quantity))) {
    console.log(`   %c[Warning] High priority flag set for Logistics Team (Bulk Item Detected).`, 'color: red;');
  }

  console.log('5. *All Emails Dispatched Successfully*.');
  console.groupEnd();
};
