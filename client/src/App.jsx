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
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">
            Know<span className="text-blue-500">Base</span>
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Your personal knowledge base powered by RAG
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Ask Question */}
        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-blue-400">
              ASK YOUR KNOWLEDGE BASE
            </p>

            <h2 className="text-2xl font-bold">
              What would you like to know?
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Ask a question and KnowBase will find relevant information from
              your documents.
            </p>
          </div>

          <form onSubmit={askQuestion} className="flex gap-3">
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="e.g. What type of database is PostgreSQL?"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              type="submit"
              disabled={asking}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {asking ? "Thinking..." : "Ask"}
            </button>
          </form>

          {answer && (
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-semibold text-emerald-400">
                  Answer
                </h3>
              </div>

              <p className="leading-7 text-slate-300">{answer}</p>
            </div>
          )}
        </section>

        {/* Add Document */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold">Add Knowledge</h2>
            <p className="mt-1 text-sm text-slate-400">
              Add a document to your knowledge base.
            </p>
          </div>

          <form
            onSubmit={createDocument}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Title
              </label>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Document title"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Content
              </label>

              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write or paste your document content here..."
                rows={8}
                className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white"
            >
              Save Document
            </button>
          </form>
        </section>

        {/* Documents */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold">Your Documents</h2>
              <p className="mt-1 text-sm text-slate-400">
                {documents.length}{" "}
                {documents.length === 1 ? "document" : "documents"} in your
                knowledge base
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
              <p className="font-medium text-slate-300">
                No documents yet
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Add your first document above to start building your knowledge
                base.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {documents.map((document) => (
                <article
                  key={document.id}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition duration-200 hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-slate-100">
                      {document.title}
                    </h3>

                    <button
                      onClick={() => deleteDocument(document.id)}
                      className="text-xs font-medium text-slate-500 transition hover:text-red-400"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="line-clamp-5 text-sm leading-6 text-slate-400">
                    {document.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;