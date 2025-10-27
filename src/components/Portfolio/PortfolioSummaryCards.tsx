import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, IndianRupee } from "lucide-react";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Investment
          </CardTitle>
          <Wallet className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ₹{totalInvestment.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Value
          </CardTitle>
          <IndianRupee className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ₹{currentValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Returns
          </CardTitle>
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-accent" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? "text-accent" : "text-destructive"}`}>
            {isPositive ? "+" : ""}₹{totalReturns.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Returns %
          </CardTitle>
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-accent" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? "text-accent" : "text-destructive"}`}>
            {isPositive ? "+" : ""}{returnsPercentage.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
