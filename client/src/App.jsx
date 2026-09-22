import { useEffect, useState } from "react";

const DOCUMENT_API = "http://localhost:5000/api/documents";
const QUESTION_API = "http://localhost:5000/api/questions";

function App() {
  const [documents, setDocuments] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [asking, setAsking] = useState(false);

  async function fetchDocuments() {
    try {
      const response = await fetch(DOCUMENT_API);
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
      const response = await fetch(DOCUMENT_API, {
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
      await fetch(`${DOCUMENT_API}/${id}`, {
        method: "DELETE",
      });

      setDocuments((current) =>
        current.filter((document) => document.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  }

  async function askQuestion(event) {
    event.preventDefault();

    if (!question.trim()) return;

    setAsking(true);
    setAnswer("");

    try {
      const response = await fetch(QUESTION_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
      setAnswer("Failed to get an answer.");
    } finally {
      setAsking(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <main>
      <h1>KnowBase</h1>
      <p>Store documents and ask questions about your knowledge base.</p>

      <section>
        <h2>Add Document</h2>

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
      </section>

      <section>
        <h2>Ask KnowBase</h2>

        <form onSubmit={askQuestion}>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask a question..."
          />

          <button type="submit" disabled={asking}>
            {asking ? "Thinking..." : "Ask"}
          </button>
        </form>

        {answer && (
          <div>
            <h3>Answer</h3>
            <p>{answer}</p>
          </div>
        )}
      </section>

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