import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { BarChart3 } from "lucide-react";

const niftyData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  value: 24500 + Math.random() * 500 - 250,
}));

const sectorData = Array.from({ length: 30 }, (_, i) => ({
  date: `Day ${i + 1}`,
  it: 40000 + Math.random() * 2000 - 1000,
  banking: 52000 + Math.random() * 2000 - 1000,
  pharma: 18000 + Math.random() * 1000 - 500,
}));

const chartConfig = {
  nifty: {
    label: "NIFTY 50",
    color: "hsl(var(--primary))",
  },
  it: {
    label: "IT Sector",
    color: "hsl(var(--accent))",
  },
  banking: {
    label: "Banking",
    color: "hsl(var(--chart-2))",
  },
  pharma: {
    label: "Pharma",
    color: "hsl(var(--chart-3))",
  },
};

export const InteractiveCharts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Interactive Charts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nifty" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nifty">NIFTY 50 Trend</TabsTrigger>
            <TabsTrigger value="sectors">Sector Comparison</TabsTrigger>
          </TabsList>
          <TabsContent value="nifty" className="h-80">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={niftyData}>
                  <defs>
                    <linearGradient id="colorNifty" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#colorNifty)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="sectors" className="h-80">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="it" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="banking" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pharma" 
                    stroke="hsl(var(--chart-3))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
