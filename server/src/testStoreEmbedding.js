import "dotenv/config";
import prisma from "./lib/prisma.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const chunkId = 3;

// 1. Get the chunk from PostgreSQL
const chunk = await prisma.chunk.findUnique({
  where: { id: chunkId },
});

if (!chunk) {
  throw new Error("Chunk not found");
}

console.log("Chunk:", chunk.content);

// 2. Generate embedding
const result = await ai.models.embedContent({
  model: "gemini-embedding-001",
  contents: chunk.content,
});

const embedding = result.embeddings[0].values;

console.log("Vector dimensions:", embedding.length);

// 3. Convert the JavaScript array into PostgreSQL vector syntax
const vector = `[${embedding.join(",")}]`;

// 4. Store the vector in PostgreSQL
await prisma.$executeRaw`
  UPDATE "Chunk"
  SET embedding = ${vector}::vector
  WHERE id = ${chunkId}
`;

console.log("Embedding stored successfully!");

await prisma.$disconnect();