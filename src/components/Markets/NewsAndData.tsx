import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, TrendingUp, AlertTriangle } from "lucide-react";

const news = [
  {
    title: "RBI keeps repo rate unchanged at 6.5%, maintains 'withdrawal of accommodation' stance",
    time: "2 hours ago",
    category: "Policy",
  },
  {
    title: "FIIs turn net buyers after 5 months, pump in ₹12,450 crore in November",
    time: "4 hours ago",
    category: "Markets",
  },
  {
    title: "Nifty 50 hits all-time high, crosses 25,000 mark on strong global cues",
    time: "6 hours ago",
    category: "Indices",
  },
  {
    title: "IT sector outlook positive as US Fed signals rate cut pause",
    time: "8 hours ago",
    category: "Sectors",
  },
];

export const NewsAndData = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Market News
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {news.map((item, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-2 line-clamp-2">{item.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{item.category}</Badge>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4" />
              FII/DII Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">FII Net</div>
              <div className="text-xl font-bold text-accent">₹2,345 Cr</div>
              <div className="text-xs text-muted-foreground">Buyers</div>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">DII Net</div>
              <div className="text-xl font-bold text-accent">₹1,876 Cr</div>
              <div className="text-xs text-muted-foreground">Buyers</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" />
              India VIX
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-destructive/10 rounded-lg text-center">
              <div className="text-3xl font-bold text-destructive mb-1">13.45</div>
              <div className="text-sm text-muted-foreground mb-2">Volatility Index</div>
              <div className="text-xs text-destructive">↓ -0.87 (-6.08%)</div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Lower VIX indicates lower market volatility and higher investor confidence
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
