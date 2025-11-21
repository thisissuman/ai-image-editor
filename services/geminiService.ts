import { GoogleGenAI, Modality } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data url prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 1. Couple Generator (Multi-modal: 2 Images + Text)
export const generateCoupleImage = async (
  image1Base64: string, 
  image2Base64: string, 
  prompt: string = "Generate a romantic couple photo featuring these two people, preserving their facial structures and features as much as possible."
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: image1Base64, mimeType: 'image/jpeg' } },
          { inlineData: { data: image2Base64, mimeType: 'image/jpeg' } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Couple Generation Error:", error);
    throw error;
  }
};

// 2. Brand Logo & 3. Ad Picture (Text -> Image)
export const generateCreativeImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Creative Generation Error:", error);
    throw error;
  }
};

// 4. Photo Editor (Image + Text -> Image)
export const editImage = async (imageBase64: string, prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Edit Image Error:", error);
    throw error;
  }
};
