import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are an expert prompt engineer. Rewrite the following user prompt to be precise, detailed, and structured. 
Keep the original intent but remove ambiguity. 
If the prompt is very short, expand it with relevant context or structure.

CRITICAL FORMATTING RULES:
1. Output RAW TEXT only. Do NOT use Markdown (no **, #, -, etc).
2. Start every numbered item (1., 2.) on a NEW LINE.
3. Insert an empty line between major sections.
4. Do NOT group multiple items on the same line.
5. Output ONLY the rewritten prompt, no conversational filler.`;

export const optimizePrompt = async (apiKey: string, promptText: string): Promise<string> => {
    if (!apiKey || !promptText) return promptText;

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent([
            SYSTEM_PROMPT,
            `User Prompt: ${promptText}`,
            `Rewritten Prompt:`
        ]);

        const response = await result.response;
        const text = response.text();
        return text.trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
