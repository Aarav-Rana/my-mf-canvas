// src/components/FundCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Fund {
  id: string;
  name: string;
  amount: number;
  risk: "Low" | "Medium" | "High";
  x: number;
  y: number;
}

interface FundCardProps {
  fund: Fund;
  onDelete: (id: string) => void;
  onDrag: (id: string, x: number, y: number) => void;
}

/** Draggable card */
export function FundCard({ fund, onDelete, onDrag }: FundCardProps) {
  const riskColor = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
  }[fund.risk];

  return (
    <div
      className="absolute cursor-move select-none"
      style={{ left: fund.x, top: fund.y }}
      onMouseDown={(e) => {
        e.preventDefault();
        const startX = e.clientX - fund.x;
        const startY = e.clientY - fund.y;

        const move = (e: MouseEvent) => {
          onDrag(fund.id, e.clientX - startX, e.clientY - startY);
        };
        const up = () => {
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
        };

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      }}
    >
      <Card className="w-64 shadow-lg hover:shadow-xl transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{fund.name}</CardTitle>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => onDelete(fund.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">₹{fund.amount.toLocaleString()}</p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${riskColor}`}
          >
            {fund.risk} Risk
          </span>
        </CardContent>
      </Card>
    </div>
  );
}