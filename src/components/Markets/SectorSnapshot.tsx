import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";

const sectors = [
  { name: "IT", change: 2.45, color: "hsl(var(--accent))" },
  { name: "Banking", change: 1.87, color: "hsl(var(--accent))" },
  { name: "Pharma", change: 1.23, color: "hsl(var(--accent))" },
  { name: "Auto", change: 0.89, color: "hsl(var(--accent))" },
  { name: "FMCG", change: 0.45, color: "hsl(var(--accent))" },
  { name: "Metals", change: -0.67, color: "hsl(var(--destructive))" },
  { name: "Energy", change: -1.23, color: "hsl(var(--destructive))" },
  { name: "Realty", change: -1.89, color: "hsl(var(--destructive))" },
  { name: "Media", change: -2.34, color: "hsl(var(--destructive))" },
  { name: "PSU", change: -2.78, color: "hsl(var(--destructive))" },
];

export const SectorSnapshot = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Sector Snapshot & Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className="p-4 rounded-lg text-center hover:scale-105 transition-transform cursor-pointer"
              style={{
                backgroundColor: sector.change >= 0 
                  ? `hsl(var(--accent) / ${Math.abs(sector.change) * 0.15})` 
                  : `hsl(var(--destructive) / ${Math.abs(sector.change) * 0.15})`,
                borderLeft: `4px solid ${sector.color}`,
              }}
            >
              <div className="font-semibold text-sm mb-1">{sector.name}</div>
              <div 
                className="text-lg font-bold"
                style={{ color: sector.color }}
              >
                {sector.change >= 0 ? '+' : ''}{sector.change}%
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(var(--accent))" }}></div>
              <span>Positive Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(var(--destructive))" }}></div>
              <span>Negative Performance</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
