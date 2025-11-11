import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "../index.css";

// --- Dummy Canvas Page ---
function CanvasPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">🎨 Canvas Page</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        This is your main drawing or workspace area.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-accent transition"
      >
        ⬅ Back to Home
      </Link>
    </div>
  );
}

// --- Home Page ---
function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-6">Welcome to My MF Canvas 🖌️</h1>
      <p className="mb-6 text-lg text-muted-foreground">
        Click below to start creating your masterpiece.
      </p>
      <Link
        to="/canvas"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:scale-105 transition-transform"
      >
        Go to Canvas
      </Link>
    </div>
  );
}

// --- App Router ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/canvas" element={<CanvasPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// --- Render App ---
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
