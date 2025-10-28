import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

const comparisonData = Array.from({ length: 12 }, (_, i) => ({
  month: `M${i + 1}`,
  mf: 100 + (i * 2.5) + Math.random() * 3,
  nifty: 100 + (i * 2.0) + Math.random() * 2.5,
  sensex: 100 + (i * 1.8) + Math.random() * 2,
}));

const chartConfig = {
  mf: {
    label: "Top MF Portfolio",
    color: "hsl(var(--accent))",
  },
  nifty: {
    label: "NIFTY 50",
    color: "hsl(var(--primary))",
  },
  sensex: {
    label: "SENSEX",
    color: "hsl(var(--chart-2))",
  },
};

export const MFComparison = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Mutual Funds vs Market Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-accent/10 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Top MF Portfolio</div>
            <div className="text-2xl font-bold text-accent">+32.5%</div>
            <div className="text-xs text-muted-foreground">1 Year Return</div>
          </div>
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">NIFTY 50</div>
            <div className="text-2xl font-bold text-primary">+24.8%</div>
            <div className="text-xs text-muted-foreground">1 Year Return</div>
          </div>
          <div className="text-center p-4 bg-secondary rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">SENSEX</div>
            <div className="text-2xl font-bold">+22.3%</div>
            <div className="text-xs text-muted-foreground">1 Year Return</div>
          </div>
        </div>
        
        <div className="h-80">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="mf" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="nifty" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="sensex" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="mt-4 text-sm text-muted-foreground text-center">
          Data shows average performance of top-performing mutual funds vs market indices over 1 year
        </div>
      </CardContent>
    </Card>
  );
};
