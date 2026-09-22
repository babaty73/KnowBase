import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const response = await ai.models.embedContent({
  model: "gemini-embedding-2",
  contents: "PostgreSQL stores data in relational tables.",
});

const vector = response.embeddings[0].values;

console.log(vector);
console.log("Vector dimensions:", vector.length);