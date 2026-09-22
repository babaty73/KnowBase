import "dotenv/config";
import prisma from "./lib/prisma.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const question = "What type of database is PostgreSQL?";

// Generate embedding for the user's question
const result = await ai.models.embedContent({
  model: "gemini-embedding-001",
  contents: question,
});

const embedding = result.embeddings[0].values;

console.log("Question:", question);
console.log("Vector dimensions:", embedding.length);

// Convert JavaScript array → PostgreSQL vector
const queryVector = `[${embedding.join(",")}]`;

// Similarity search
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

// Combine retrieved chunks into context
const context = results
  .map((chunk) => chunk.content)
  .join("\n\n");

// Create prompt using retrieved context
const prompt = `
Answer the question using only the provided context.

Context:
${context}

Question:
${question}
`;

// Generate answer using the retrieved context
const answer = await ai.models.generateContent({
  model: "gemini-3.6-flash",
  contents: prompt,
});

console.log("\nAnswer:");
console.log(answer.text);

console.log("\nContext:");
console.log(context);

console.log("\nRetrieved chunks:");
console.log(results);

await prisma.$disconnect();
