import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { code, fromLanguage, toLanguage } = await req.json();

    if (!code || !fromLanguage || !toLanguage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert programmer. Translate the following ${fromLanguage} code to ${toLanguage}.
Only respond with the translated code without any additional explanation or markdown formatting.
Here's the code to translate:

${code}`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedCode = response.text();

    return NextResponse.json({ translatedCode });
  } catch (error) {
    console.error("Translation error:", error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid or missing API key" },
          { status: 401 }
        );
      }
      if (error.message.includes("quota")) {
        return NextResponse.json(
          { error: "API quota exceeded" },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to translate code" },
      { status: 500 }
    );
  }
}
