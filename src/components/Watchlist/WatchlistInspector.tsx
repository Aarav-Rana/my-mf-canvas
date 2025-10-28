import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatchlistItem } from "@/hooks/useWatchlist";

interface WatchlistInspectorProps {
  selectedItem: WatchlistItem | null;
  onClose: () => void;
}

export const WatchlistInspector = ({ selectedItem, onClose }: WatchlistInspectorProps) => {
  if (!selectedItem) {
    return (
      <Card className="w-80 h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            Inspector
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Hover over a fund to see details
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-80 h-fit shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm">{selectedItem.scheme_name.substring(0, 40)}</CardTitle>
            <Badge variant="outline" className="mt-2">{selectedItem.category}</Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* NAV Section */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs text-muted-foreground">Current NAV</span>
            <span className="text-2xl font-bold">₹{Number(selectedItem.current_nav).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-end gap-1">
            {Number(selectedItem.change) >= 0 ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span className={`text-sm font-medium ${Number(selectedItem.change) >= 0 ? 'text-success' : 'text-destructive'}`}>
              {Number(selectedItem.change) >= 0 ? '+' : ''}₹{Number(selectedItem.change).toFixed(2)}
            </span>
            <span className={`text-sm ${Number(selectedItem.change_percentage) >= 0 ? 'text-success' : 'text-destructive'}`}>
              ({Number(selectedItem.change_percentage).toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3 pt-3 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">1 Week</span>
            <span className="text-sm font-semibold text-success">+2.4%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">1 Month</span>
            <span className="text-sm font-semibold text-success">+5.8%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">3 Months</span>
            <span className="text-sm font-semibold text-success">+12.3%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">1 Year</span>
            <span className="text-sm font-semibold text-success">+18.7%</span>
          </div>
        </div>

        {/* Fund Details */}
        <div className="space-y-3 pt-3 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Expense Ratio</span>
            <span className="text-sm font-semibold">1.25%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Risk Level</span>
            <Badge variant="outline" className="text-xs">Moderate</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">AUM</span>
            <span className="text-sm font-semibold">₹2,450 Cr</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-border space-y-2">
          <Button className="w-full" size="sm">
            Add to Portfolio
          </Button>
          <Button variant="outline" className="w-full" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
