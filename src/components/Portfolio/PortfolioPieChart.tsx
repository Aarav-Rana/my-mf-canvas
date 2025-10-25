import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PortfolioHolding } from "@/types/mutualfund";

interface PortfolioPieChartProps {
  holdings: PortfolioHolding[];
}

const COLORS = [
  "hsl(231 55% 35%)",
  "hsl(158 64% 32%)",
  "hsl(38 85% 38%)",
  "hsl(271 75% 40%)",
  "hsl(12 76% 42%)",
  "hsl(197 65% 45%)",
];

export const PortfolioPieChart = ({ holdings }: PortfolioPieChartProps) => {
  const chartData = holdings.map((holding, index) => ({
    name: holding.schemeName.length > 30 
      ? holding.schemeName.substring(0, 30) + "..." 
      : holding.schemeName,
    value: holding.currentValue,
    fullName: holding.schemeName,
    percentage: 0, // Will be calculated
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  chartData.forEach(item => {
    item.percentage = (item.value / total) * 100;
  });

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Portfolio Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percentage }) => `${percentage.toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
