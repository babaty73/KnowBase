import prisma from "../lib/prisma.js";
import { chunkText } from "../utils/chunkText.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function getDocuments(req, res) {
  try {
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
}

export async function getDocument(req, res) {
  try {
    const id = Number(req.params.id);

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        chunks: { orderBy: { chunkIndex: "asc" } },
      },
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch document" });
  }
}

export async function createDocument(req, res) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    // 1. Chunk the document
    const chunks = chunkText(content);

    // 2. Create the document and chunks
    const document = await prisma.document.create({
      data: {
        title,
        content,

        chunks: {
          create: chunks.map((chunk, index) => ({
            content: chunk,
            chunkIndex: index,
          })),
        },
      },

      include: {
        chunks: true,
      },
    });

    // 3. Generate and store an embedding for every chunk
    for (const chunk of document.chunks) {
      const result = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: chunk.content,
      });

      const embedding = result.embeddings[0].values;
      const vector = `[${embedding.join(",")}]`;

      await prisma.$executeRaw`
        UPDATE "Chunk"
        SET embedding = ${vector}::vector
        WHERE id = ${chunk.id}
      `;
    }

    res.status(201).json(document);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create document",
    });
  }
}
export async function deleteDocument(req, res) {
  try {
    const id = Number(req.params.id);

    const document = await prisma.document.delete({
      where: { id },
    });

    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete document" });
  }
}
