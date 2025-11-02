import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WatchlistItem } from "@/hooks/useWatchlist";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OverlapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  funds: WatchlistItem[];
}

export const OverlapDialog = ({ open, onOpenChange, funds }: OverlapDialogProps) => {
  // Mock overlap data
  const overlapData = [
    { stock: "Reliance Industries", overlap: 85, funds: ["Fund A", "Fund B"] },
    { stock: "HDFC Bank", overlap: 72, funds: ["Fund A", "Fund B"] },
    { stock: "Infosys", overlap: 68, funds: ["Fund A", "Fund B"] },
    { stock: "TCS", overlap: 65, funds: ["Fund A", "Fund B"] },
    { stock: "ICICI Bank", overlap: 58, funds: ["Fund A", "Fund B"] },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Portfolio Overlap Analysis</DialogTitle>
          <DialogDescription>
            Identify common holdings across your selected funds
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-primary">62%</div>
                <div className="text-sm text-muted-foreground">Average Overlap</div>
              </div>
              <Progress value={62} className="h-2" />
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Common Holdings</h3>
            {overlapData.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{item.stock}</span>
                    <span className="text-sm font-semibold text-primary">{item.overlap}%</span>
                  </div>
                  <Progress value={item.overlap} className="h-1.5 mb-2" />
                  <div className="text-xs text-muted-foreground">
                    Present in {item.funds.length} selected funds
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-accent/10">
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-2">Recommendation</h4>
              <p className="text-sm text-muted-foreground">
                Your selected funds have significant overlap. Consider diversifying by selecting funds 
                with different investment strategies or sectors to reduce concentration risk.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
