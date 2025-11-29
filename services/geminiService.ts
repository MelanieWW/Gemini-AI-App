import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateDishImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key not found. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    // Using gemini-2.5-flash-image as the standard performant image generation model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        // While not strictly required for flash-image to function, we keep configs minimal
      }
    });

    // Extract image from response
    // The response for image generation usually contains inlineData in the parts
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
        const parts = candidates[0].content.parts;
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                 return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    
    throw new Error("No image data received from Gemini.");

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};