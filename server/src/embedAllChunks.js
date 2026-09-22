import "dotenv/config";
import prisma from "./lib/prisma.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Get chunks that don't have embeddings yet
const chunks = await prisma.$queryRaw`
  SELECT id, content
  FROM "Chunk"
  WHERE embedding IS NULL
  ORDER BY id;
`;

console.log(`Found ${chunks.length} chunks without embeddings.`);

for (const chunk of chunks) {
  console.log(`Embedding chunk ${chunk.id}...`);

  // Generate embedding
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: chunk.content,
  });

  const embedding = result.embeddings[0].values;

  console.log(`  Dimensions: ${embedding.length}`);

  // Convert JavaScript array → PostgreSQL vector
  const vector = `[${embedding.join(",")}]`;

  // Store embedding
  await prisma.$executeRaw`
    UPDATE "Chunk"
    SET embedding = ${vector}::vector
    WHERE id = ${chunk.id}
  `;

  console.log(`  ✓ Stored embedding for chunk ${chunk.id}`);
}

await prisma.$disconnect();

console.log("All embeddings generated successfully!");