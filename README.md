# RAG Learning Starter

A deliberately small RAG learning project.

We will build the RAG pipeline step by step instead of hiding it behind a framework.

## Stage 1
Documents are stored in PostgreSQL through Prisma.

Later stages:
1. Chunk documents
2. Generate embeddings
3. Store vectors with pgvector
4. Semantic similarity search
5. Retrieve relevant chunks
6. Send context to an LLM
7. Build the React chat UI

## Setup

### Server
cd server
npm install

Create `server/.env`:

DATABASE_URL="your-neon-postgresql-connection-string"
PORT=5000

Then:

npx prisma migrate dev --name init
npm run dev

### Client
cd client
npm install
npm run dev

Client: http://localhost:5173
API: http://localhost:5000

Important: use `prisma migrate dev` for our normal schema-first workflow. Do not use `prisma db pull` unless we specifically want to introspect an existing database.
