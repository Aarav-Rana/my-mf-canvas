// src/FundForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FundFormProps {
  onAdd: (fund: { name: string; amount: number; risk: "Low" | "Medium" | "High" }) => void;
}

export function FundForm({ onAdd }: FundFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [risk, setRisk] = useState<"Low" | "Medium" | "High">("Medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    onAdd({
      name,
      amount: Number(amount),
      risk,
    });

    setName("");
    setAmount("");
    setRisk("Medium");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add Mutual Fund</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Fund Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., HDFC Mid-Cap"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
            />
          </div>
          <div className="space-y-2">
            <Label>Risk Level</Label>
            <div className="flex gap-2">
              {(["Low", "Medium", "High"] as const).map((r) => (
                <Button
                  key={r}
                  type="button"
                  variant={risk === r ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRisk(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add to Canvas
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}