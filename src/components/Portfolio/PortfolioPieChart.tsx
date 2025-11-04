import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PortfolioHolding } from "@/types/mutualfund";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PortfolioPieChartProps {
  holdings: PortfolioHolding[];
}

const COLORS = ["#1565c0", "#2e7d32", "#f9a825", "#6a1b9a", "#c62828"];

export const PortfolioPieChart = ({ holdings }: PortfolioPieChartProps) => {
  const chartData = holdings.map((holding, index) => ({
    name: holding.schemeName,
    value: holding.currentValue,
    percentage: ((holding.currentValue / holdings.reduce((sum, h) => sum + h.currentValue, 0)) * 100).toFixed(1),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-card-foreground">Portfolio Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percentage }) => `${percentage}%`}
              outerRadius={140}
              innerRadius={0}
              fill="#8884d8"
              dataKey="value"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                cursor: 'pointer'
              }}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  style={{
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                padding: '12px',
                boxShadow: 'var(--shadow-md)'
              }}
              formatter={(value: number, name: string, props: any) => [
                `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                props.payload.name
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={60}
              iconType="square"
              iconSize={12}
              wrapperStyle={{
                paddingTop: '20px'
              }}
              formatter={(value, entry: any) => {
                const truncatedName = value.length > 30 ? value.substring(0, 30) + '...' : value;
                return (
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-card-foreground cursor-pointer hover:text-primary transition-colors">
                          {truncatedName}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{value}</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
