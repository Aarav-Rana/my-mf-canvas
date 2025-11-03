import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, TrendingDown, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TaxLossOpportunity {
  fundName: string;
  loss: number;
  lossPercentage: number;
}

export const TaxLossHarvestingAlert = () => {
  // Mock data - would come from actual portfolio analysis
  const opportunities: TaxLossOpportunity[] = [
    { fundName: "HDFC Small Cap Fund", loss: 15000, lossPercentage: 8.5 },
    { fundName: "Axis Bluechip Fund", loss: 22000, lossPercentage: 5.2 },
  ];

  if (opportunities.length === 0) {
    return (
      <Card className="hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Tax-Loss Harvesting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              No tax-loss harvesting opportunities found. Your portfolio is performing well!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-warning/50 hover-scale animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Tax-Loss Harvesting Opportunities
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="default" className="border-warning/50 bg-warning/5">
          <AlertDescription className="text-sm">
            Consider selling these funds before March 31st to offset capital gains tax.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          {opportunities.map((opp, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border bg-card space-y-2 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{opp.fundName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="destructive" className="text-xs">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {opp.lossPercentage}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Loss: ₹{opp.loss.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="hover-scale">
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          * Consult with a tax advisor before making investment decisions
        </p>
      </CardContent>
    </Card>
  );
};
