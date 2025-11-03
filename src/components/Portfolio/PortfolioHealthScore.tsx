import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

interface HealthScoreProps {
  score: number;
  diversification: number;
  riskLevel: "low" | "medium" | "high";
  totalReturn: number;
}

export const PortfolioHealthScore = ({ score, diversification, riskLevel, totalReturn }: HealthScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Portfolio Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score)} animate-fade-in`}>
            {score}
          </div>
          <Badge className="mt-2" variant={score >= 60 ? "default" : "destructive"}>
            {getScoreLabel(score)}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Diversification</span>
              <span className="font-semibold">{diversification}%</span>
            </div>
            <Progress value={diversification} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Risk Level</span>
              <Badge variant={riskLevel === "low" ? "default" : riskLevel === "medium" ? "secondary" : "destructive"}>
                {riskLevel.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Return</span>
              <span className={`font-semibold flex items-center gap-1 ${totalReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
                {totalReturn >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {totalReturn >= 0 ? '+' : ''}{totalReturn}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
