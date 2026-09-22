# KnowBase

**KnowBase** is a small knowledge-base application built to learn how **Retrieval-Augmented Generation (RAG)** works from the ground up.

Instead of using a ready-made RAG framework and hiding the important parts, this project is built step by step so each stage of the pipeline can be understood:

**documents → chunks → embeddings → vector search → retrieval → LLM → answer**

The goal is not just to build a RAG application, but to understand what happens behind the scenes.

---

## What I'm Learning

This project is mainly a learning journey around:

* PostgreSQL
* Prisma ORM
* Database schema design
* Database relationships
* SQL and how ORMs translate application code into SQL
* Migrations
* Document storage
* Text chunking
* Embeddings
* Vector databases and `pgvector`
* Semantic similarity search
* Retrieval-Augmented Generation (RAG)
* LLM context and prompting
* Building RAG APIs
* Connecting a RAG backend to React

---

## Tech Stack

### Frontend

* React
* Vite

### Backend

* Node.js
* Express.js
* Prisma

### Database

* PostgreSQL
* Neon
* `pgvector` — introduced later in the project

### AI

* Embedding model — introduced later
* LLM — introduced later

---

## How KnowBase Will Work

The final system will follow this general flow:

```text
                 KNOWBASE

                 Documents
                     │
                     ▼
              Text Extraction
                     │
                     ▼
                Chunking
                     │
                     ▼
               Embeddings
                     │
                     ▼
          PostgreSQL + pgvector
                     │
                     │
User Question ──────┤
       │             │
       ▼             ▼
Question          Similarity
Embedding           Search
       │             │
       └──────┬──────┘
              ▼
       Relevant Chunks
              │
              ▼
       LLM + Retrieved
            Context
              │
              ▼
          Final Answer
```

---

## Current Project Stage

The project intentionally starts simple.

### Stage 1 — Documents

Currently KnowBase can:

* Create documents
* Store documents in PostgreSQL
* Read documents
* Delete documents
* Store document chunks
* Understand the relationship between documents and chunks

At this stage, there are **no embeddings or AI-generated answers yet**.

This is intentional.

We'll introduce each new RAG concept only after understanding why it is necessary.

---

## Learning Roadmap

### 1. PostgreSQL Foundation

Understand:

* Tables
* Rows
* Columns
* Primary keys
* Foreign keys
* Relationships
* Indexes
* SQL queries
* PostgreSQL extensions

---

### 2. Prisma

Understand:

* Prisma schema
* Prisma Client
* Models
* Relations
* CRUD operations
* How Prisma translates JavaScript operations into SQL
* Migrations
* Schema-first database development

Example:

```js
await prisma.document.findMany()
```

and understand that this eventually becomes a database query rather than treating Prisma as magic.

---

### 3. Document Chunking

Large documents are not normally sent to an embedding model as one huge piece of text.

We'll learn how to divide:

```text
Document
   │
   ├── Chunk 1
   ├── Chunk 2
   ├── Chunk 3
   └── Chunk 4
```

and understand:

* Why chunking is necessary
* Chunk size
* Overlap
* How chunking affects retrieval quality

---

### 4. Embeddings

Learn what an embedding actually is.

For example:

```text
"How do I reset my password?"
              │
              ▼
       Embedding Model
              │
              ▼
[0.021, -0.183, 0.742, ...]
```

We'll understand why text can be represented as vectors and how those vectors allow us to compare meaning.

---

### 5. pgvector

Add vector support to PostgreSQL.

We'll learn how PostgreSQL can store something like:

```text
document
    ↓
chunk
    ↓
embedding vector
```

and perform similarity searches.

---

### 6. Semantic Search

Instead of searching only for exact words:

```text
"password reset"
```

we'll be able to search by meaning.

For example:

> "I forgot my login credentials. How can I get back into my account?"

can retrieve information about:

> "To reset your password, visit..."

even though the wording is different.

---

### 7. Retrieval

We'll build the retrieval part of RAG:

```text
Question
   ↓
Question Embedding
   ↓
Vector Search
   ↓
Top Relevant Chunks
```

We'll understand concepts such as:

* Similarity
* Distance
* Top-K results
* Retrieval quality

---

### 8. Generation

Finally, we'll introduce an LLM.

The LLM will receive:

```text
User Question
+
Retrieved Context
```

and generate an answer based on the retrieved information.

This is where the complete RAG pipeline comes together.

---

### 9. React Interface

Once the backend pipeline is understood, we'll connect it to React and build a simple interface where a user can:

* Add knowledge
* View documents
* Ask questions
* See AI-generated answers

---

## Project Structure

```text
knowbase/
│
├── client/
│   └── React application
│
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── controllers/
│       ├── routes/
│       ├── lib/
│       └── server.js
│
└── README.md
```

The architecture will evolve as new RAG components are introduced.

---

## Setup

### 1. Clone the project

```bash
git clone <repository-url>
cd knowbase
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Configure PostgreSQL

Create a `.env` file inside `server`:

```env
DATABASE_URL="your-neon-postgresql-connection-string"
PORT=5000
```

### 4. Run the database migration

```bash
npx prisma migrate dev --name init
```

This creates the PostgreSQL tables defined by `schema.prisma`.

### 5. Start the backend

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

### 6. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## Database Model

The initial database contains two related models:

```text
Document
   │
   │ 1
   │
   │
   │ *
   ▼
Chunk
```

One document can contain many chunks.

This relationship will become important when we begin building the retrieval system.

---

## Important Development Principle

This project is intentionally built **from the fundamentals upward**.

I don't want the RAG pipeline to become:

```text
install framework
↓
copy code
↓
it works
```

Instead, the goal is:

```text
Understand the problem
        ↓
Understand the concept
        ↓
Design the data
        ↓
Implement it
        ↓
Test it
        ↓
Understand what happened
```

Every major technology introduced into KnowBase should answer a question:

> **Why do we need this?**

---

## Learning Progress

* [x] PostgreSQL basics
* [x] Neon
* [x] Prisma setup
* [x] Prisma schema
* [x] Database migrations
* [x] CRUD
* [x] Document model
* [x] Document → Chunk relationship
* [ ] Chunking strategy
* [ ] Embeddings
* [ ] pgvector
* [ ] Vector similarity search
* [ ] Retrieval
* [ ] LLM integration
* [ ] Complete RAG pipeline
* [ ] React RAG interface

---

## Final Goal

By the end of KnowBase, the goal is to be able to look at a RAG system and understand **what every major component is doing and why it exists**, rather than treating RAG as a black box.
