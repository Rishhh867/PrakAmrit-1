
/**
 * Milanà Payment Gateway Integration Service
 * Supports: UPI Intent (GPay, PhonePe, BHIM), Razorpay Simulation, and Webhook Verification.
 */

interface PaymentIntent {
  orderId: string;
  amount: number;
  currency: string;
  upiLink: string;
  qrCodeUrl: string;
}

// Simulated Secret for HMAC verification
const RAZORPAY_SECRET = "milana_secret_live_key_123";

/**
 * Generates a UPI Intent Link and QR Code URL for a given order.
 * In production, this would call the Razorpay/Cashfree Orders API.
 */
export const createPaymentIntent = async (orderId: string, amount: number): Promise<PaymentIntent> => {
  // Simulate API Latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const pa = "milana@icici"; // Merchant VPA
  const pn = "Milana Ayurveda"; // Merchant Name
  const tr = orderId; // Transaction Ref
  const am = amount.toFixed(2); // Amount
  const cu = "INR"; // Currency

  // UPI Intent URI standard format
  const upiLink = `upi://pay?pa=${pa}&pn=${encodeURIComponent(pn)}&tr=${tr}&am=${am}&cu=${cu}&mc=5499`;

  // Generate a Static QR Code using a public API for visualization (simulating a dynamic QR from gateway)
  // In a real app, the gateway provides the QR payload.
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}&color=1a3c34`;

  return {
    orderId,
    amount,
    currency: cu,
    upiLink,
    qrCodeUrl
  };
};

/**
 * Simulates a Node.js Webhook Handler to verify payment signatures.
 * This prevents "ghost orders" where client-side success is spoofed.
 */
export const verifyPaymentSignature = (
  orderId: string, 
  paymentId: string, 
  signature: string
): boolean => {
  // In a real Node.js environment, we would use 'crypto' module:
  // const hmac = crypto.createHmac('sha256', RAZORPAY_SECRET);
  // hmac.update(orderId + "|" + paymentId);
  // const generatedSignature = hmac.digest('hex');
  // return generatedSignature === signature;

  console.log(`[Security] Verifying signature for Order: ${orderId}`);
  
  // For client-side simulation, we assume valid if signature matches our mock pattern
  const mockExpectedSignature = `sig_${orderId}_${paymentId}`;
  return signature === mockExpectedSignature;
};

/**
 * Helper to determine bulk discount from cart items.
 * Logic pulls from QUANTITY_MULTIPLIERS indirectly via price comparison or explict rules.
 */
export const calculateCartSavings = (subtotal: number, items: any[]): number => {
    // This is a visual helper to show "Inclusive of Discount"
    // Since individual item prices already have discounts baked in, 
    // we might estimate the 'market price' vs 'our price' for display.
    let marketPrice = 0;
    items.forEach(item => {
        // Reverse engineer base price approx
        const unitPrice = item.price; // Discounted
        // Heuristic: If it's a bulk item, assuming 15-30% off
        if (item.quantity === '5kg') marketPrice += unitPrice * 1.17; // ~15% off reverse
        else if (item.quantity === '10kg') marketPrice += unitPrice * 1.25;
        else if (item.quantity === '25kg') marketPrice += unitPrice * 1.42;
        else marketPrice += unitPrice;
    });
    
    return Math.round(marketPrice - subtotal);
};
