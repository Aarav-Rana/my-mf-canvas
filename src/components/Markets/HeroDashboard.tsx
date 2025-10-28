import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp } from "lucide-react";

const indices = [
  { name: "NIFTY 50", value: "24,857.30", change: "+123.45", percent: "+0.50%", positive: true },
  { name: "SENSEX", value: "81,765.86", change: "+456.78", percent: "+0.56%", positive: true },
  { name: "NIFTY Bank", value: "53,234.15", change: "-234.56", percent: "-0.44%", positive: false },
  { name: "NIFTY IT", value: "41,234.50", change: "+567.89", percent: "+1.40%", positive: true },
];

const global = [
  { name: "S&P 500", value: "5,918.25", change: "+12.34", percent: "+0.21%", positive: true },
  { name: "Nasdaq", value: "19,565.48", change: "-23.45", percent: "-0.12%", positive: false },
  { name: "FTSE 100", value: "8,234.67", change: "+45.67", percent: "+0.56%", positive: true },
];

const commodities = [
  { name: "Gold", value: "₹72,345", change: "+234", percent: "+0.32%", positive: true },
  { name: "Silver", value: "₹86,234", change: "-567", percent: "-0.65%", positive: false },
  { name: "Crude Oil", value: "$78.45", change: "+1.23", percent: "+1.59%", positive: true },
];

export const HeroDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index) => (
          <Card key={index.name} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {index.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{index.value}</div>
              <div className={`flex items-center gap-1 text-sm font-medium ${index.positive ? 'text-accent' : 'text-destructive'}`}>
                {index.positive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                {index.change} ({index.percent})
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Markets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {global.map((market) => (
              <div key={market.name} className="flex justify-between items-center">
                <span className="font-medium">{market.name}</span>
                <div className="text-right">
                  <div className="font-semibold">{market.value}</div>
                  <div className={`text-sm ${market.positive ? 'text-accent' : 'text-destructive'}`}>
                    {market.change} ({market.percent})
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commodities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commodities.map((commodity) => (
              <div key={commodity.name} className="flex justify-between items-center">
                <span className="font-medium">{commodity.name}</span>
                <div className="text-right">
                  <div className="font-semibold">{commodity.value}</div>
                  <div className={`text-sm ${commodity.positive ? 'text-accent' : 'text-destructive'}`}>
                    {commodity.change} ({commodity.percent})
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
