import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const gainers = [
  { name: "Reliance Industries", price: "₹2,856.30", change: "+5.67%", volume: "12.5M" },
  { name: "HDFC Bank", price: "₹1,645.80", change: "+4.32%", volume: "8.9M" },
  { name: "Infosys", price: "₹1,834.25", change: "+3.89%", volume: "6.7M" },
  { name: "TCS", price: "₹4,123.60", change: "+3.45%", volume: "4.2M" },
  { name: "ICICI Bank", price: "₹1,234.90", change: "+2.98%", volume: "9.1M" },
];

const losers = [
  { name: "Adani Enterprises", price: "₹2,345.60", change: "-4.23%", volume: "15.3M" },
  { name: "Bajaj Finance", price: "₹6,789.45", change: "-3.78%", volume: "7.8M" },
  { name: "Asian Paints", price: "₹2,567.30", change: "-3.12%", volume: "5.6M" },
  { name: "Titan Company", price: "₹3,456.80", change: "-2.87%", volume: "6.4M" },
  { name: "Maruti Suzuki", price: "₹12,345.70", change: "-2.45%", volume: "3.9M" },
];

const volumeLeaders = [
  { name: "Reliance Industries", price: "₹2,856.30", change: "+5.67%", volume: "45.8M" },
  { name: "State Bank of India", price: "₹789.45", change: "+1.23%", volume: "38.2M" },
  { name: "Tata Motors", price: "₹1,023.60", change: "-0.56%", volume: "32.7M" },
  { name: "HDFC Bank", price: "₹1,645.80", change: "+4.32%", volume: "29.5M" },
  { name: "Bharti Airtel", price: "₹1,567.90", change: "+2.14%", volume: "24.3M" },
];

export const MarketMovers = () => {
  const renderStockList = (stocks: typeof gainers, type: 'gain' | 'loss' | 'volume') => (
    <div className="space-y-3">
      {stocks.map((stock, index) => (
        <div key={stock.name} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg hover:bg-secondary/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-sm font-semibold">
              {index + 1}
            </div>
            <div>
              <div className="font-medium">{stock.name}</div>
              <div className="text-sm text-muted-foreground">{stock.price}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-semibold ${type === 'gain' ? 'text-accent' : type === 'loss' ? 'text-destructive' : 'text-foreground'}`}>
              {stock.change}
            </div>
            <div className="text-sm text-muted-foreground">{stock.volume}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card id="market-movers">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Market Movers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gainers" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Top Losers
            </TabsTrigger>
            <TabsTrigger value="volume" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              By Volume
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gainers" className="mt-4">
            {renderStockList(gainers, 'gain')}
          </TabsContent>
          <TabsContent value="losers" className="mt-4">
            {renderStockList(losers, 'loss')}
          </TabsContent>
          <TabsContent value="volume" className="mt-4">
            {renderStockList(volumeLeaders, 'volume')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
