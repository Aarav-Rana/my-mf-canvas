import React from "react";
import { Link } from "react-router-dom";

export default function CanvasPage() {
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
