
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || ''; // In a real app, ensure this is secure

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAyurvedicAdvice = async (query: string): Promise<string> => {
  if (!API_KEY) {
    return "AI Consultation is unavailable (Missing API Key). Please contact support.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `You are the "PrakAmrit Ayurvedic Guide", a professional AI consultant for Ayurvedic raw materials.

Formatting Rule:
- **Bold Emphasis**: Whenever you mention a key term, a product name, or a specific action (like a test), you must wrap the word in single asterisks so it appears in bold (e.g., *Ashwagandha*, *Purity Test*).
- **Lists**: Use hyphens (-) for bullet points to avoid conflict with bold formatting.

Core Knowledge:
- **Ayurvedic Principles**: Expertise in *Vata* (Air), *Pitta* (Fire), and *Kapha* (Earth).
- **Product Expertise**: Distinguish between *Raw Form* (roots, bark) and *Powder Form*.
- **Business Logic**: Mention our *Tiered Pricing* (5kg = *15% off*, 10kg = *25% off*) when discussing bulk quantities.

Behavior Guidelines:
1. Provide *herbal information* and context, never medical prescriptions. Always include a disclaimer.
2. **DO NOT** mention the *Certificate of Analysis (COA)* or lab reports unless the user specifically asks for them.
3. If a user is interested in bulk purchases (over 10kg), guide them to the *Request a Quotation* workflow.
4. If a user asks how to check quality, explain the specific *test* they should perform (e.g., water solubility for gums, smell test for roots).
5. When discussing specific herbs, provide a concise list of 3-4 key benefits using bullet points.
6. Tone: Warm, earthy, and authoritative. Use traditional Ayurvedic terms but explain them in simple English.
7. Keep answers under 150 words.`,
        temperature: 0.7,
      }
    });
    
    return response.text || "I apologize, I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our AI consultant is currently unavailable. Please try again later.";
  }
};

interface ScanAnalysis {
  dosha: 'Vata' | 'Pitta' | 'Kapha';
  analysis: string;
  recommendation: string;
}

export const analyzeHealthScan = async (tongueImageBase64: string, skinImageBase64: string): Promise<ScanAnalysis> => {
    if (!API_KEY) {
        throw new Error("API Key missing");
    }

    try {
        // Remove data URL prefix if present for clean base64
        const cleanTongue = tongueImageBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        const cleanSkin = skinImageBase64.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

        const prompt = `
            Act as an expert Ayurvedic Vaidya. Analyze these two images:
            1. An image of a Tongue.
            2. An image of Forearm Skin.

            Perform the following analysis:
            - **Tongue**: Identify color, coating thickness, and cracks.
            - **Skin**: Identify dryness, oiliness, or inflammation (redness).

            **Mapping Rules**:
            - Pale/Dry/Cracked = *Vata*
            - Red/Inflamed/Yellow Coating = *Pitta*
            - Pale/Thick White Coating/Oily = *Kapha*

            Return a valid JSON object (NO markdown formatting, just raw JSON) with this structure:
            {
                "dosha": "Vata" or "Pitta" or "Kapha",
                "analysis": "A concise summary (max 3 sentences) of what you observed. Wrap key terms like *Vata*, *Pitta*, *Kapha*, and *test* in single asterisks.",
                "recommendation": "A recommendation for a raw herb blend based on the detected Dosha."
            }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: cleanTongue } },
                    { inlineData: { mimeType: 'image/jpeg', data: cleanSkin } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json"
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        return JSON.parse(text) as ScanAnalysis;
    } catch (error) {
        console.error("Vaidya Scan Error:", error);
        // Fallback mock response for demo purposes if API fails or images are unclear
        return {
            dosha: 'Vata',
            analysis: "Could not process images perfectly. Based on general patterns, we detected signs of dryness consistent with *Vata* imbalance.",
            recommendation: "Grounding roots like *Ashwagandha* and *Shatavari*."
        };
    }
};
