import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, TrendingUp, Award } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LeaderboardEntry {
  rank: number;
  name: string;
  returns: number;
  portfolioValue: number;
}

export const CommunityLeaderboard = () => {
  // Mock data - would come from database in production
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "Rajesh Kumar", returns: 28.5, portfolioValue: 2500000 },
    { rank: 2, name: "Priya Sharma", returns: 24.8, portfolioValue: 1800000 },
    { rank: 3, name: "Amit Patel", returns: 22.3, portfolioValue: 3200000 },
    { rank: 4, name: "Sneha Reddy", returns: 20.1, portfolioValue: 1500000 },
    { rank: 5, name: "Vikram Singh", returns: 19.7, portfolioValue: 2100000 },
  ];

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
  };

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Community Leaderboard
        </CardTitle>
        <CardDescription>
          Top performers this month (anonymized)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-md hover-scale ${
                entry.rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-accent/5' : 'bg-card'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 flex justify-center">
                  {getMedalIcon(entry.rank)}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{entry.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{(entry.portfolioValue / 100000).toFixed(1)}L
                  </p>
                </div>
              </div>
              <Badge variant="default" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +{entry.returns}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
