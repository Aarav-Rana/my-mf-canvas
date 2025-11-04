import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PortfolioHolding } from "@/types/mutualfund";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PortfolioTableProps {
  holdings: PortfolioHolding[];
}

export const PortfolioTable = ({ holdings }: PortfolioTableProps) => {
  return (
    <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-card-foreground">Your Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[hsl(var(--table-header-bg))] hover:bg-[hsl(var(--table-header-bg))]">
                <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Scheme Name</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Units</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Invested</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Current NAV</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Current Value</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-muted-foreground">Returns</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding, index) => {
                const isPositive = holding.returns >= 0;
                const truncatedName = holding.schemeName.length > 40 
                  ? holding.schemeName.substring(0, 40) + '...' 
                  : holding.schemeName;
                
                return (
                  <TableRow 
                    key={holding.schemeCode} 
                    className={`
                      ${index % 2 === 0 ? 'bg-[hsl(var(--table-row-alt))]' : 'bg-card'}
                      hover:bg-[hsl(var(--table-row-hover))] 
                      transition-colors 
                      cursor-pointer
                      border-b border-border
                    `}
                  >
                    <TableCell className="font-medium text-card-foreground py-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-pointer hover:text-primary transition-colors">
                              {truncatedName}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{holding.schemeName}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right font-medium py-4">{holding.units.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium py-4">
                      ₹{holding.investedAmount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-right font-medium py-4">₹{holding.currentNAV.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium py-4">
                      ₹{holding.currentValue.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className={`flex items-center justify-end gap-2 font-bold text-base ${isPositive ? "text-success" : "text-destructive"}`}>
                        {isPositive ? (
                          <TrendingUp className="h-5 w-5 fill-success" />
                        ) : (
                          <TrendingDown className="h-5 w-5 fill-destructive" />
                        )}
                        <div className="flex flex-col items-end">
                          <span>
                            {isPositive ? "+" : "-"}₹{Math.abs(holding.returns).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                          </span>
                          <span className="text-sm font-semibold">
                            ({isPositive ? "+" : ""}{holding.returnsPercentage.toFixed(2)}%)
                          </span>
                        </div>
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
