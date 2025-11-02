import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BarChart3, Target } from "lucide-react";

interface WatchlistToolsProps {
  onCompare: () => void;
  onOverlap: () => void;
  selectedCount: number;
}

export const WatchlistTools = ({ onCompare, onOverlap, selectedCount }: WatchlistToolsProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/20">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCompare}
          disabled={selectedCount < 2}
        >
          <Search className="h-4 w-4 mr-2" />
          Compare
          {selectedCount > 0 && (
            <Badge variant="secondary" className="ml-2">{selectedCount}</Badge>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onOverlap}
          disabled={selectedCount < 2}
        >
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
