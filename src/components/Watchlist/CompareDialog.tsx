import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WatchlistItem } from "@/hooks/useWatchlist";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funds: WatchlistItem[];
}

export const CompareDialog = ({ open, onOpenChange, funds }: CompareDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Mutual Funds</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4">
          {funds.map((fund) => (
            <Card key={fund.id}>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-sm mb-1">{fund.scheme_name}</h3>
                  <Badge variant="secondary" className="text-xs">{fund.category}</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current NAV</span>
                    <span className="font-semibold">₹{fund.current_nav.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">1D Change</span>
                    <div className={`flex items-center gap-1 ${fund.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {fund.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      <span className="font-semibold text-sm">
                        {fund.change_percentage >= 0 ? '+' : ''}{fund.change_percentage.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground mb-1">Performance Metrics</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>1 Year Return</span>
                        <span className="text-green-600">+12.5%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>3 Year Return</span>
                        <span className="text-green-600">+15.2%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Expense Ratio</span>
                        <span>0.85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
