import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
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
