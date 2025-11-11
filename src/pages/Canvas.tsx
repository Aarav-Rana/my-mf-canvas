// src/pages/Canvas.tsx
import { useState, useEffect } from "react";
import { FundCard } from "@/components/FundCard";
import { FundForm } from "@/components/FundForm";
import { AlertCircle } from "lucide-react";

interface Fund {
  id: string;
  name: string;
  amount: number;
  risk: "Low" | "Medium" | "High";
  x: number;
  y: number;
}

const STORAGE_KEY = "mf-canvas-funds";

export default function Canvas() {
  const [funds, setFunds] = useState<Fund[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setFunds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(funds));
  }, [funds]);

  const addFund = ({ name, amount, risk }: { name: string; amount: number; risk: "Low" | "Medium" | "High" }) => {
    const newFund: Fund = {
      id: Date.now().toString(),
      name,
      amount,
      risk,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
    };
    setFunds((prev) => [...prev, newFund]);
  };

  const deleteFund = (id: string) => {
    setFunds((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFund = (id: string, x: number, y: number) => {
    setFunds((prev) =>
      prev.map((f) => (f.id === id ? { ...f, x, y } : f))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">
          Mutual Fund Canvas
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <FundForm onAdd={addFund} />
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 relative overflow-hidden min-h-96">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-indigo-600" />
              Drag Cards Anywhere
            </h2>
            <div className="relative w-full h-full border-2 border-dashed border-gray-300 rounded-lg min-h-96">
              {funds.length === 0 ? (
                <p className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Add a fund to start building your canvas
                </p>
              ) : (
                funds.map((fund) => (
                  <FundCard
                    key={fund.id}
                    fund={fund}
                    onDelete={deleteFund}
                    onDrag={moveFund}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}