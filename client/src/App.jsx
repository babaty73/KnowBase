import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/documents";

function App() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchDocuments() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function createDocument(event) {
    event.preventDefault();

    if (!title.trim() || !content.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const newDocument = await response.json();

      setDocuments((current) => [newDocument, ...current]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteDocument(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setDocuments((current) =>
        current.filter((document) => document.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <main>
      <h1>RAG Learning Project</h1>
      <p>Stage 1: documents in PostgreSQL. RAG comes next.</p>

      <form onSubmit={createDocument}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Document title"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Document content"
          rows={8}
        />
        <button type="submit">Save document</button>
      </form>

      <section>
        <h2>Documents</h2>

        {loading ? (
          <p>Loading...</p>
        ) : documents.length === 0 ? (
          <p>No documents yet.</p>
        ) : (
          documents.map((document) => (
            <article key={document.id}>
              <h3>{document.title}</h3>
              <p>{document.content}</p>
              <button onClick={() => deleteDocument(document.id)}>
                Delete
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default App;
