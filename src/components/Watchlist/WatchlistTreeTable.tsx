import { useState } from "react";
import { TrendingUp, TrendingDown, ChevronRight, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WatchlistItem } from "@/hooks/useWatchlist";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WatchlistTreeTableProps {
  watchlist: WatchlistItem[];
  onRemove: (id: string) => void;
  onHover: (item: WatchlistItem | null) => void;
}

export const WatchlistTreeTable = ({ watchlist, onRemove, onHover }: WatchlistTreeTableProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const generateSparklineData = () => {
    return Array.from({ length: 12 }, () => Math.random() * 100);
  };

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 80;
    const height = 24;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={data[data.length - 1] > data[0] ? 'text-success' : 'text-destructive'}
        />
      </svg>
    );
  };

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr className="text-xs text-muted-foreground">
            <th className="text-left p-3 font-medium">Scheme</th>
            <th className="text-right p-3 font-medium">NAV</th>
            <th className="text-right p-3 font-medium">1D</th>
            <th className="text-right p-3 font-medium">1Y</th>
            <th className="text-right p-3 font-medium">Value</th>
            <th className="text-center p-3 font-medium">Trend</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <tr
                    className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer transition-colors"
                    onMouseEnter={() => onHover(item)}
                    onMouseLeave={() => onHover(null)}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {expandedItems.has(item.id) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                        <div>
                          <div className="font-medium text-sm">{item.scheme_name.substring(0, 30)}...</div>
                          <Badge variant="outline" className="text-xs mt-1">{item.category}</Badge>
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-3 font-semibold">
                      ₹{Number(item.current_nav).toFixed(2)}
                    </td>
                    <td className={`text-right p-3 font-medium ${Number(item.change_percentage) >= 0 ? 'text-success' : 'text-destructive'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {Number(item.change_percentage) >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(Number(item.change_percentage)).toFixed(1)}%
                      </div>
                    </td>
                    <td className={`text-right p-3 font-medium ${Number(item.change_percentage) * 12 >= 0 ? 'text-success' : 'text-destructive'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {Number(item.change_percentage) * 12 >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {Math.abs(Number(item.change_percentage) * 12).toFixed(1)}%
                      </div>
                    </td>
                    <td className="text-right p-3 font-semibold">
                      ₹{((Number(item.current_nav) * 1000) / 100000).toFixed(1)}L
                    </td>
                    <td className="text-center p-3">
                      <Sparkline data={generateSparklineData()} />
                    </td>
                  </tr>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-semibold">{item.scheme_name}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">NAV</p>
                        <p className="font-semibold">₹{Number(item.current_nav).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Change</p>
                        <p className={Number(item.change) >= 0 ? 'text-success' : 'text-destructive'}>
                          {Number(item.change) >= 0 ? '+' : ''}₹{Number(item.change).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </tbody>
      </table>
    </div>
  );
};
