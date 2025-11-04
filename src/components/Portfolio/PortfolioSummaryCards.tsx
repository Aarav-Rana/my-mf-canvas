import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, DollarSign } from "lucide-react";

interface PortfolioSummaryCardsProps {
  totalInvestment: number;
  currentValue: number;
  totalReturns: number;
  returnsPercentage: number;
}

export const PortfolioSummaryCards = ({
  totalInvestment,
  currentValue,
  totalReturns,
  returnsPercentage,
}: PortfolioSummaryCardsProps) => {
  const isPositive = totalReturns >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Investment Card */}
      <Card className="hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Investment</p>
            <Wallet className="h-5 w-5 text-primary/70" />
          </div>
          <p className="text-[1.75rem] font-bold text-card-foreground text-right leading-tight">
            ₹{totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </CardContent>
      </Card>

      {/* Current Value Card */}
      <Card className="hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Value</p>
            <DollarSign className="h-5 w-5 text-primary/70" />
          </div>
          <p className="text-[1.75rem] font-bold text-card-foreground text-right leading-tight">
            ₹{currentValue.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </CardContent>
      </Card>

      {/* Total Returns Card */}
      <Card className="hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Returns</p>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-success fill-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive fill-destructive" />
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <p className={`text-[1.75rem] font-bold ${isPositive ? "text-success" : "text-destructive"} text-right leading-tight`}>
              {isPositive ? "+" : "-"}₹{Math.abs(totalReturns).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Returns Percentage Card */}
      <Card className="hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Returns %</p>
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-success fill-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive fill-destructive" />
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <p className={`text-[1.75rem] font-bold ${isPositive ? "text-success" : "text-destructive"} text-right leading-tight`}>
              {isPositive ? "+" : ""}{returnsPercentage.toFixed(2)}%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
