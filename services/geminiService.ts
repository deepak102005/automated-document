
import { GoogleGenAI, Type } from "@google/genai";
import { DocumentType, QAItem, Summary } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getKeywordsPrompt = (docType: DocumentType) => {
  if (docType === 'legal') {
    return {
      type: Type.ARRAY,
      description: "List the key clauses, legal terms, and obligations from the document.",
      items: { type: Type.STRING }
    };
  }
  return {
    type: Type.ARRAY,
    description: "List the main characters, plot events, key themes, and moral lessons from the text.",
    items: { type: Type.STRING }
  };
};

export const analyzeDocument = async (documentText: string, documentType: DocumentType): Promise<{ summary: Summary, keywords: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following ${documentType} document:\n\n---\n\n${documentText}\n\n---\n\nProvide a short, medium, and detailed summary, along with the key elements as specified in the JSON schema.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shortSummary: {
              type: Type.STRING,
              description: 'A concise summary of 1-2 sentences.'
            },
            mediumSummary: {
              type: Type.STRING,
              description: 'A paragraph-long summary.'
            },
            detailedSummary: {
              type: Type.STRING,
              description: 'A detailed, section-by-section summary of the document.'
            },
            keywords: getKeywordsPrompt(documentType)
          },
          required: ["shortSummary", "mediumSummary", "detailedSummary", "keywords"],
        }
      }
    });

    const jsonText = response.text;
    const parsed = JSON.parse(jsonText);
    
    return {
      summary: {
        short: parsed.shortSummary,
        medium: parsed.mediumSummary,
        detailed: parsed.detailedSummary,
      },
      keywords: parsed.keywords,
    };

  } catch (error) {
    console.error("Error analyzing document:", error);
    throw new Error("The Gemini API call failed. This could be due to a network issue or an invalid API key.");
  }
};

export const askQuestion = async (documentText: string, question: string, history: QAItem[]): Promise<string> => {
  try {
     const chatHistory = history.map(item => `User: ${item.question}\nAI: ${item.answer}`).join('\n\n');

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based *only* on the document provided, answer the user's question. If the answer cannot be found in the document, state that clearly. Do not use outside knowledge.\n\nDOCUMENT:\n---\n${documentText}\n---\n\nCHAT HISTORY:\n---\n${chatHistory}\n---\n\nQUESTION: ${question}`,
    });

    return response.text;
  } catch (error) {
    console.error("Error asking question:", error);
    throw new Error("The Gemini API call failed for Q&A.");
  }
};
