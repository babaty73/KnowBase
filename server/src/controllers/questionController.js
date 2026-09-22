import prisma from "../lib/prisma.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    // 1. Generate embedding for the question
    const result = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: question,
    });

    const embedding = result.embeddings[0].values;

    // 2. Convert embedding to PostgreSQL vector
    const queryVector = `[${embedding.join(",")}]`;

    // 3. Find the most similar chunks
    const results = await prisma.$queryRaw`
      SELECT
        id,
        content,
        embedding <=> ${queryVector}::vector AS distance
      FROM "Chunk"
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ${queryVector}::vector
      LIMIT 3;
    `;

    // 4. Combine retrieved chunks into context
    const context = results
      .map((chunk) => chunk.content)
      .join("\n\n");

    // 5. Give the context + question to Gemini
    const prompt = `
Answer the question using only the provided context.

Context:
${context}

Question:
${question}
`;

    const answer = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    // 6. Send answer back to frontend
    res.json({
      question,
      answer: answer.text,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to answer question",
    });
  }
}