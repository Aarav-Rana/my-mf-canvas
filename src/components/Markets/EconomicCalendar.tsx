import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

const events = [
  {
    date: "Nov 28",
    time: "11:00 AM",
    event: "RBI Monetary Policy Decision",
    impact: "high",
    previous: "6.50%",
    forecast: "6.50%",
  },
  {
    date: "Nov 29",
    time: "5:30 PM",
    event: "GDP Growth Rate (Q2)",
    impact: "high",
    previous: "7.8%",
    forecast: "7.2%",
  },
  {
    date: "Nov 30",
    time: "12:00 PM",
    event: "Manufacturing PMI",
    impact: "medium",
    previous: "57.5",
    forecast: "58.0",
  },
  {
    date: "Dec 01",
    time: "5:30 PM",
    event: "Infrastructure Output",
    impact: "medium",
    previous: "12.3%",
    forecast: "11.8%",
  },
  {
    date: "Dec 02",
    time: "11:00 AM",
    event: "Services PMI",
    impact: "medium",
    previous: "58.4",
    forecast: "59.1",
  },
  {
    date: "Dec 05",
    time: "5:30 PM",
    event: "Foreign Exchange Reserves",
    impact: "low",
    previous: "$645.6B",
    forecast: "$647.2B",
  },
];

export const EconomicCalendar = () => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Economic Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getImpactColor(event.impact)} className="text-xs">
                      {event.impact.toUpperCase()}
                    </Badge>
                    <span className="text-sm font-medium text-muted-foreground">
                      {event.date} • {event.time}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-2">{event.event}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Previous: </span>
                      <span className="font-medium">{event.previous}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Forecast: </span>
                      <span className="font-medium">{event.forecast}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
