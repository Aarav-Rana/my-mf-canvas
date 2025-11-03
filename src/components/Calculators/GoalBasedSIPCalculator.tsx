import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Target } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export const GoalBasedSIPCalculator = () => {
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [monthlySIP, setMonthlySIP] = useState(0);

  const calculateSIP = () => {
    const monthlyRate = expectedReturn / 12 / 100;
    const months = years * 12;
    const sip = goalAmount * monthlyRate / ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate));
    setMonthlySIP(Math.round(sip));
  };

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Goal-Based SIP Calculator
        </CardTitle>
        <CardDescription>
          Calculate monthly SIP required to achieve your financial goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="goal">Goal Amount (₹)</Label>
          <Input
            id="goal"
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(Number(e.target.value))}
            className="transition-all focus:scale-105"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Time Period</Label>
            <span className="text-sm font-semibold">{years} years</span>
          </div>
          <Slider
            value={[years]}
            onValueChange={(value) => setYears(value[0])}
            min={1}
            max={30}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Expected Annual Return</Label>
            <span className="text-sm font-semibold">{expectedReturn}%</span>
          </div>
          <Slider
            value={[expectedReturn]}
            onValueChange={(value) => setExpectedReturn(value[0])}
            min={8}
            max={20}
            step={0.5}
          />
        </div>

        <Button onClick={calculateSIP} className="w-full hover-scale">
          <Calculator className="h-4 w-4 mr-2" />
          Calculate
        </Button>

        {monthlySIP > 0 && (
          <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 animate-fade-in">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Monthly SIP Required</p>
              <p className="text-3xl font-bold text-primary">₹{monthlySIP.toLocaleString('en-IN')}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Invest consistently to reach ₹{goalAmount.toLocaleString('en-IN')} in {years} years
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
