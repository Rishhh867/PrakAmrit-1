
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const API_KEY = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates a high-fidelity product image using *Gemini 2.5 Flash Image*.
 */
export const generateAIProductImage = async (product: Product): Promise<string | null> => {
  if (!API_KEY) {
    console.error("API Key missing");
    return null;
  }

  // Detect form for context
  const form = product.name.toLowerCase().includes('powder') ? 'fine powder' : 'raw, natural whole form';

  const prompt = `
    Hyper-realistic product photography of *${product.name}* (${product.botanicalName}).
    
    **Subject**: The product is shown in its *${form}*. Show rich texture and details.
    
    **Setting**: A nature-inspired Ayurvedic studio setting. Placed on a *rustic wooden table* with a folded *beige linen cloth* in the background. 
    
    **Props**: A small, earthy clay bowl nearby (optional) or raw ingredients scattered naturally.
    
    **Lighting**: Soft, warm *morning sunlight* casting gentle shadows. High dynamic range.
    
    **Camera**: 45-degree isometric view. Macro lens. 8k resolution.
    
    **Style**: Minimalist, organic, pure, pharmaceutical grade quality.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ],
      },
      config: {
        // Note: responseMimeType is not supported for image generation models
      },
    });

    // Extract Image from Response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

/**
 * Applies the *Milanà* watermark to an image using HTML5 Canvas.
 */
export const applyWatermark = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject("Could not get canvas context");
        return;
      }

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // 1. Draw Original Image
      ctx.drawImage(img, 0, 0);

      // 2. Configure Watermark Style
      const fontSize = Math.floor(img.width * 0.05); // Dynamic sizing (5% of width)
      ctx.font = `bold ${fontSize}px "Montserrat", sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"; // White with 60% opacity
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      
      // 3. Add Shadow for readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // 4. Draw Text *Milanà*
      const padding = Math.floor(img.width * 0.03);
      ctx.fillText("Milanà", canvas.width - padding, canvas.height - padding);

      // Return new Base64
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = (err) => reject(err);
  });
};
