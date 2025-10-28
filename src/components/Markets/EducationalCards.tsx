import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb, Target, Shield } from "lucide-react";

const tips = [
  {
    icon: Target,
    title: "Diversification is Key",
    description: "Spread your investments across different sectors and asset classes to minimize risk and maximize potential returns.",
  },
  {
    icon: Lightbulb,
    title: "Long-term Investment",
    description: "Mutual funds work best with a long-term investment horizon. Stay invested for at least 5-7 years to see optimal results.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Understand your risk tolerance and invest accordingly. Equity funds for growth, debt funds for stability.",
  },
  {
    icon: BookOpen,
    title: "Regular Monitoring",
    description: "Review your portfolio quarterly but avoid making frequent changes. Stay patient and let your investments grow.",
  },
];

export const EducationalCards = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Investment Tips & Insights</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">{tip.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
