
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
 * Branding: Elegant Minimalist Serif, 40% Opacity.
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

      // 2. Configure Watermark Style (Milanà Branding)
      // Elegant Serif Font, Muted White
      const fontSize = Math.floor(img.width * 0.06); // Slightly larger for impact
      ctx.font = `italic 600 ${fontSize}px "Playfair Display", serif`;
      
      // 3. Opacity 40%
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; 
      
      // Alignment
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // 4. Subtle Drop Shadow for visibility on light/dark textures
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // 5. Draw Text *Milanà* in the center or bottom right?
      // "Overlay" implies typically center or subtle corner. 
      // Prompt says "Elegant, minimalist". Center looks too stock-photo-ish.
      // Bottom Center or Bottom Right is standard luxury.
      
      const paddingX = canvas.width - (canvas.width * 0.1);
      const paddingY = canvas.height - (canvas.height * 0.08);

      ctx.fillText("Milanà", paddingX, paddingY);

      // Return new Base64
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };

    img.onerror = (err) => reject(err);
  });
};
