import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PortfolioHolding } from "@/types/mutualfund";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PortfolioTableProps {
  holdings: PortfolioHolding[];
}

export const PortfolioTable = ({ holdings }: PortfolioTableProps) => {
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/20">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Your Holdings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Scheme Name</TableHead>
                <TableHead className="text-right font-semibold">Units</TableHead>
                <TableHead className="text-right font-semibold">Invested</TableHead>
                <TableHead className="text-right font-semibold">Current NAV</TableHead>
                <TableHead className="text-right font-semibold">Current Value</TableHead>
                <TableHead className="text-right font-semibold">Returns</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const isPositive = holding.returns >= 0;
                return (
                  <TableRow key={holding.schemeCode} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium max-w-xs">
                      <div className="truncate" title={holding.schemeName}>
                        {holding.schemeName}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{holding.units.toFixed(3)}</TableCell>
                    <TableCell className="text-right">
                      ₹{holding.investedAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-right">₹{holding.currentNAV.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{holding.currentValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`flex items-center justify-end gap-1 font-semibold ${
                        isPositive ? "text-accent" : "text-destructive"
                      }`}>
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span>
                          {isPositive ? "+" : ""}₹{holding.returns.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-xs ml-1">
                          ({isPositive ? "+" : ""}{holding.returnsPercentage.toFixed(2)}%)
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
