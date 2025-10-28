import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BarChart3, Target } from "lucide-react";

export const WatchlistTools = () => {
  return (
    <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/20">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Compare
          <Badge variant="secondary" className="ml-2">2</Badge>
        </Button>
        
        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Overlap Analysis
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-warning" />
        <span className="text-sm font-medium">Goal Gap:</span>
        <span className="text-sm font-bold text-destructive">₹8L short</span>
        <span className="text-xs text-muted-foreground">in 7Y</span>
      </div>
    </div>
  );
};
