import type React from "react";
import { useState, useRef, useEffect } from "react";

// This is the correct base URL for Ollama - we'll use different endpoints for checking vs. chat
const OLLAMA_BASE_URL = "http://localhost:11434";
const OLLAMA_API_CHAT = `${OLLAMA_BASE_URL}/api/chat`;
const OLLAMA_API_LIST = `${OLLAMA_BASE_URL}/api/tags`;

interface Message {
  sender: "user" | "ai";
  text: string;
}

const MODEL_NAME = "llama3.2:3b";

const LearnPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ollamaAvailable, setOllamaAvailable] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Scroll chat to newest message
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Function to check Ollama availability
  const checkOllamaAvailability = async () => {
    try {
      // Use the /api/tags endpoint which is simpler than the chat endpoint
      const res = await fetch(OLLAMA_API_LIST, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        setOllamaAvailable(true);
        setError(null);
        return true;
      } else {
        setOllamaAvailable(false);
        setError("Ollama server responded with an error.");
        return false;
      }
    } catch (err) {
      setOllamaAvailable(false);
      setError("Ollama is not running or unavailable.");
      return false;
    }
  };

  // Check Ollama API availability on mount with retry
  useEffect(() => {
    checkOllamaAvailability();

    // Set up periodic checks every 5 seconds if Ollama is unavailable
    const intervalId = setInterval(() => {
      if (!ollamaAvailable && retryCount < 5) {
        checkOllamaAvailability();
        setRetryCount(prev => prev + 1);
      } else if (ollamaAvailable) {
        clearInterval(intervalId);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [ollamaAvailable, retryCount]);

  // Manual retry button handler
  const handleRetry = () => {
    setRetryCount(0);
    setError("Checking Ollama availability...");
    checkOllamaAvailability();
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !ollamaAvailable) return;
    setError(null);
    const userMsg: Message = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    try {
      const resp = await fetch(OLLAMA_API_CHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            ...messages.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: input }
          ],
          stream: false
        })
      });

      if (!resp.ok) {
        // If chat fails, also check if Ollama is still available
        const isAvailable = await checkOllamaAvailability();
        if (!isAvailable) {
          setMessages(msgs => [...msgs, { sender: "ai", text: "AI under maintenance. Please try again later." }]);
        } else {
          // Ollama is running but the model might not be loaded
          setMessages(msgs => [...msgs, {
            sender: "ai",
            text: "There was an error getting a response.  model might not be loaded."
          }]);
        }
      } else {
        const data = await resp.json();
        const aiResponse = data.message?.content || "No answer from AI.";
        setMessages(msgs => [...msgs, { sender: "ai", text: aiResponse }]);
      }
    } catch (err) {
      // Connection error - check Ollama availability again
      await checkOllamaAvailability();
      setMessages(msgs => [...msgs, { sender: "ai", text: "AI under maintenance. Please try again later." }]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 my-6 bg-white shadow-md rounded-lg min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-6 text-green-700 text-center">Ingredient & Food Knowledge Chat (Local AI)</h1>
      {!ollamaAvailable && (
        <div className="bg-yellow-100 text-yellow-900 rounded p-4 mb-4 text-center font-semibold border border-yellow-300">
          <span>AI Chat is currently <b>under maintenance</b> or unavailable.<br/>
          Please ensure Ollama is running locally with the gemma3:1b model installed.</span>
          <div className="mt-2">
            <button
              onClick={handleRetry}
              className="px-3 py-1 bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded text-sm"
            >
              Check Again
            </button>
          </div>
          <div className="mt-2 text-xs text-yellow-800">
            <p>Run these commands in your terminal:</p>
            <code className="block bg-yellow-50 p-2 mt-1 text-left rounded">
              $ ollama run gemma3:1b
            </code>
            <p className="mt-1">or first pull the model if not yet downloaded:</p>
            <code className="block bg-yellow-50 p-2 mt-1 text-left rounded">
              $ ollama pull gemma3:1b
            </code>
          </div>
        </div>
      )}
      <div ref={chatRef} className="overflow-y-auto h-96 px-2 mb-4 border rounded bg-gray-50">
        {messages.length === 0 && (
          <div className="text-gray-400 text-center my-12">Ask ingredient questions (e.g., "What is maltodextrin?")</div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block px-4 py-2 m-1 rounded-lg ${
                msg.sender === "user"
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 text-left inline-block animate-pulse m-1">AI is typing...</div>
        )}
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-green-500"
          placeholder="Type ingredient question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading || !ollamaAvailable}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded disabled:bg-green-300"
          disabled={loading || !input.trim() || !ollamaAvailable}
        >
          Send
        </button>
      </form>
      {error && <div className="text-red-600 mt-2 text-sm text-center">{error}</div>}
      <p className="mt-8 text-xs text-gray-400 text-center">
        Powered by SFIA unoffical AI. Answers are for reference purpose only.
      </p>
    </div>
  );
};

export default LearnPage;
