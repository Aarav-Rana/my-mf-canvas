import { Button } from "@/components/ui/button";
import { Eye, Plus, Download, RefreshCw, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WatchlistHeaderProps {
  portfolioName: string;
  totalValue: number;
  totalReturns: number;
  returnsPercentage: number;
  onAddNew: () => void;
  onExport: () => void;
  onRefresh: () => void;
}

export const WatchlistHeader = ({
  portfolioName,
  totalValue,
  totalReturns,
  returnsPercentage,
  onAddNew,
  onExport,
  onRefresh,
}: WatchlistHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <Eye className="h-5 w-5 text-primary" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="font-semibold text-lg px-2 hover:bg-secondary">
              {portfolioName}
              <span className="ml-2 text-muted-foreground">
                ₹{(totalValue / 100000).toFixed(1)}L
              </span>
              <span className={`ml-2 text-sm ${returnsPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                ({returnsPercentage >= 0 ? '+' : ''}{returnsPercentage.toFixed(1)}%)
              </span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>Equity Master</DropdownMenuItem>
            <DropdownMenuItem>Debt Portfolio</DropdownMenuItem>
            <DropdownMenuItem>+ Create New Watchlist</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onAddNew}>
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
