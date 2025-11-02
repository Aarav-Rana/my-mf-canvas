import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Star } from "lucide-react";

const Membership = () => {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      icon: Star,
      features: [
        "Track up to 10 mutual funds",
        "Basic portfolio analytics",
        "Market news and updates",
        "Email support",
      ],
      current: true,
    },
    {
      name: "Premium",
      price: "₹499",
      period: "/month",
      icon: Zap,
      features: [
        "Unlimited fund tracking",
        "Advanced analytics & insights",
        "Real-time price alerts",
        "Priority customer support",
        "Export portfolio reports",
        "Goal tracking tools",
      ],
      popular: true,
    },
    {
      name: "Elite",
      price: "₹999",
      period: "/month",
      icon: Crown,
      features: [
        "Everything in Premium",
        "AI-powered fund recommendations",
        "Tax optimization tools",
        "Dedicated account manager",
        "Early access to new features",
        "Exclusive market research",
        "Portfolio rebalancing alerts",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--hero-gradient-from))] via-[hsl(var(--hero-gradient-via))] to-[hsl(var(--hero-gradient-to))]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg">
            Unlock powerful features to supercharge your investment journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? "border-primary shadow-lg scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                {plan.current && (
                  <Badge variant="secondary" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Current Plan
                  </Badge>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold mb-2">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.period}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    disabled={plan.current}
                  >
                    {plan.current ? "Current Plan" : "Upgrade Now"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Why Upgrade?</CardTitle>
            <CardDescription>
              Premium features designed to help you make better investment decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto mb-3 p-3 rounded-full bg-accent/10 w-fit">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant alerts and updates on your portfolio performance
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 p-3 rounded-full bg-accent/10 w-fit">
                  <Star className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Deep dive into your investments with comprehensive reports
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 p-3 rounded-full bg-accent/10 w-fit">
                  <Crown className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Priority Support</h3>
                <p className="text-sm text-muted-foreground">
                  Get expert help whenever you need it with our premium support
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Membership;
