import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PersonalityReport, UserDetails } from "../types";

// Define the schema for structured output
const personalitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    personality_type: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
      },
      required: ["title", "description"],
    },
    strengths: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name", "description"],
      },
    },
    career_suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING },
          why_fit: { type: Type.STRING },
        },
        required: ["role", "why_fit"],
      },
    },
    fictional_match: {
      type: Type.OBJECT,
      properties: {
        character: { type: Type.STRING },
        universe: { type: Type.STRING },
        reason: { type: Type.STRING },
      },
      required: ["character", "universe", "reason"],
    },
  },
  required: ["personality_type", "strengths", "career_suggestions", "fictional_match"],
};

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiClient;
};

export const generateReport = async (
  userAnswers: { question: string; answer: string }[],
  userDetails: UserDetails
): Promise<PersonalityReport> => {
  try {
    const ai = getAiClient();
    
    const promptContext = `
      USER PROFILE:
      Name: ${userDetails.name}
      Age: ${userDetails.age}
      Gender: ${userDetails.gender}

      QUIZ RESPONSES:
      ${userAnswers.map((ua, index) => `Q${index + 1}: ${ua.question}\nA: ${ua.answer}`).join("\n")}
    `;

    const systemInstruction = `
      You are an expert personality analyst and career psychologist.
      Your job is to generate a personalized personality report based on a user's answers to a quiz and their demographic details.
      
      TONE & STYLE:
      Friendly, motivational, modern, and easy to understand.
      Address the user by name occasionally.
      Tailor the career advice and personality description specifically for a ${userDetails.age}-year-old ${userDetails.gender}.
      Avoid technical jargon.
      
      Analyze the user responses to determine their personality type, strengths, ideal careers, and a fictional character match.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: promptContext }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: personalitySchema,
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    const data = JSON.parse(response.text) as PersonalityReport;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};