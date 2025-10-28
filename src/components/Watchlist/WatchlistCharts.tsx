import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { WatchlistItem } from "@/hooks/useWatchlist";

interface WatchlistChartsProps {
  watchlist: WatchlistItem[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--destructive))'];

export const WatchlistCharts = ({ watchlist }: WatchlistChartsProps) => {
  // Allocation Pie Chart Data
  const allocationData = watchlist.slice(0, 5).map((item, index) => ({
    name: item.scheme_name.substring(0, 15),
    value: Number(item.current_nav) * 100,
    color: COLORS[index % COLORS.length],
  }));

  // Return Chart Data
  const returnData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    returns: Math.random() * 20 - 5,
  }));

  // Heatmap Data
  const heatmapData = [
    { category: 'Equity', performance: 12.5 },
    { category: 'Debt', performance: 5.2 },
    { category: 'Hybrid', performance: 8.7 },
    { category: 'Liquid', performance: 3.1 },
    { category: 'Gold', performance: -2.3 },
  ];

  const vixValue = 14.2;
  const vixChange = -0.8;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border-t border-border">
      {/* Allocation Pie */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-2">Allocation</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Return Chart */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-2">Returns (1Y)</h3>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={returnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="returns" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heatmap */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-2">Category Heatmap</h3>
          <div className="space-y-2">
            {heatmapData.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <span className="text-xs">{item.category}</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-16 rounded ${
                      item.performance > 0 ? 'bg-success/20' : 'bg-destructive/20'
                    }`}
                    style={{
                      opacity: Math.abs(item.performance) / 15,
                    }}
                  />
                  <span className={`text-xs font-medium ${item.performance > 0 ? 'text-success' : 'text-destructive'}`}>
                    {item.performance > 0 ? '+' : ''}{item.performance.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* VIX */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold mb-2">Market Volatility</h3>
          <div className="flex flex-col items-center justify-center h-[120px]">
            <div className="text-3xl font-bold">{vixValue}</div>
            <div className="flex items-center gap-1 mt-2">
              {vixChange < 0 ? (
                <TrendingDown className="h-4 w-4 text-success" />
              ) : (
                <TrendingUp className="h-4 w-4 text-destructive" />
              )}
              <span className={`text-sm font-medium ${vixChange < 0 ? 'text-success' : 'text-destructive'}`}>
                {vixChange > 0 ? '+' : ''}{vixChange}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">VIX Index</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
