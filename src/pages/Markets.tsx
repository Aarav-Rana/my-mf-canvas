import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMultipleFundDetails } from "@/hooks/useMutualFunds";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// Sample funds - High performers (good returns, low expense ratio, moderate risk)
const HIGH_PERFORMERS = [
  { schemeCode: "118989", name: "Axis Bluechip Fund" },
  { schemeCode: "120503", name: "Mirae Asset Large Cap Fund" },
  { schemeCode: "119551", name: "Parag Parikh Flexi Cap Fund" },
  { schemeCode: "118834", name: "ICICI Prudential Bluechip Fund" },
  { schemeCode: "120505", name: "SBI Bluechip Fund" },
];

// Sample funds - Low performers
const LOW_PERFORMERS = [
  { schemeCode: "100492", name: "HDFC Top 100 Fund" },
  { schemeCode: "101305", name: "Reliance Large Cap Fund" },
  { schemeCode: "102885", name: "Birla Sun Life Frontline Equity Fund" },
  { schemeCode: "103006", name: "UTI Opportunities Fund" },
  { schemeCode: "100474", name: "Franklin India Bluechip Fund" },
];

const Markets = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setIsLoggedIn(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setIsLoggedIn(false);
        navigate("/auth");
      } else if (session) {
        setIsLoggedIn(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const highPerformerCodes = HIGH_PERFORMERS.map(f => f.schemeCode);
  const lowPerformerCodes = LOW_PERFORMERS.map(f => f.schemeCode);
  
  const { data: highPerformersData, isLoading: highLoading } = useMultipleFundDetails(highPerformerCodes);
  const { data: lowPerformersData, isLoading: lowLoading } = useMultipleFundDetails(lowPerformerCodes);

  const calculateReturns = (data: any[]) => {
    if (!data || data.length < 2) return { oneYear: 0, threeYear: 0, fiveYear: 0 };
    
    const latest = parseFloat(data[0].nav);
    const oneYearAgo = data[Math.min(252, data.length - 1)]; // ~252 trading days
    const threeYearsAgo = data[Math.min(756, data.length - 1)];
    const fiveYearsAgo = data[Math.min(1260, data.length - 1)];

    return {
      oneYear: oneYearAgo ? ((latest - parseFloat(oneYearAgo.nav)) / parseFloat(oneYearAgo.nav) * 100) : 0,
      threeYear: threeYearsAgo ? ((latest - parseFloat(threeYearsAgo.nav)) / parseFloat(threeYearsAgo.nav) * 100) : 0,
      fiveYear: fiveYearsAgo ? ((latest - parseFloat(fiveYearsAgo.nav)) / parseFloat(fiveYearsAgo.nav) * 100) : 0,
    };
  };

  const calculateStandardDeviation = (data: any[]) => {
    if (!data || data.length < 2) return 0;
    
    const returns = [];
    for (let i = 0; i < Math.min(252, data.length - 1); i++) {
      const currentNav = parseFloat(data[i].nav);
      const prevNav = parseFloat(data[i + 1].nav);
      returns.push((currentNav - prevNav) / prevNav);
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
    return Math.sqrt(variance) * Math.sqrt(252) * 100; // Annualized
  };

  const getChartData = (data: any[], period: number) => {
    if (!data || data.length === 0) return [];
    
    const slicedData = data.slice(0, Math.min(period, data.length)).reverse();
    return slicedData.map((item, index) => ({
      index,
      date: item.date,
      nav: parseFloat(item.nav),
    }));
  };

  const renderFundCard = (fundData: any, fundInfo: any, type: "high" | "low") => {
    if (!fundData || !fundData.data) return null;

    const returns = calculateReturns(fundData.data);
    const stdDev = calculateStandardDeviation(fundData.data);
    const currentNav = fundData.data[0] ? parseFloat(fundData.data[0].nav) : 0;
    
    // Mock expense ratio (in reality would come from another API)
    const expenseRatio = type === "high" ? (Math.random() * 0.5 + 0.5).toFixed(2) : (Math.random() * 1 + 1.5).toFixed(2);

    const chartConfig = {
      nav: {
        label: "NAV",
        color: "hsl(var(--primary))",
      },
    };

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{fundData.meta.scheme_name}</CardTitle>
              <CardDescription>{fundData.meta.scheme_category}</CardDescription>
            </div>
            <Badge variant={type === "high" ? "default" : "destructive"}>
              {type === "high" ? "High Performer" : "Low Performer"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Metrics */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current NAV</p>
                <p className="text-2xl font-bold">₹{currentNav.toFixed(2)}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">1Y Return</p>
                  <p className={`font-semibold ${returns.oneYear >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {returns.oneYear.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">3Y Return</p>
                  <p className={`font-semibold ${returns.threeYear >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {returns.threeYear.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">5Y Return</p>
                  <p className={`font-semibold ${returns.fiveYear >= 0 ? 'text-accent' : 'text-destructive'}`}>
                    {returns.fiveYear.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Expense Ratio</p>
                  <p className="font-semibold">{expenseRatio}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk (Std Dev)</p>
                  <p className="font-semibold">{stdDev.toFixed(2)}%</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fund Type</p>
                <p className="font-semibold">{fundData.meta.scheme_type}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="space-y-2">
              <Tabs defaultValue="1year" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="1year">1 Year</TabsTrigger>
                  <TabsTrigger value="3year">3 Years</TabsTrigger>
                  <TabsTrigger value="5year">5 Years</TabsTrigger>
                </TabsList>
                <TabsContent value="1year" className="h-48">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getChartData(fundData.data, 252)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" hide />
                        <YAxis domain={['auto', 'auto']} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="nav" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </TabsContent>
                <TabsContent value="3year" className="h-48">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getChartData(fundData.data, 756)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" hide />
                        <YAxis domain={['auto', 'auto']} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="nav" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </TabsContent>
                <TabsContent value="5year" className="h-48">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getChartData(fundData.data, 1260)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" hide />
                        <YAxis domain={['auto', 'auto']} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="nav" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const calculateMarketAverage = () => {
    if (!highPerformersData || !lowPerformersData) return null;

    const allFunds = [...(highPerformersData || []), ...(lowPerformersData || [])];
    const avgReturns = allFunds.reduce((acc, fund) => {
      const returns = calculateReturns(fund.data);
      return {
        oneYear: acc.oneYear + returns.oneYear,
        threeYear: acc.threeYear + returns.threeYear,
        fiveYear: acc.fiveYear + returns.fiveYear,
      };
    }, { oneYear: 0, threeYear: 0, fiveYear: 0 });

    return {
      oneYear: (avgReturns.oneYear / allFunds.length).toFixed(2),
      threeYear: (avgReturns.threeYear / allFunds.length).toFixed(2),
      fiveYear: (avgReturns.fiveYear / allFunds.length).toFixed(2),
    };
  };

  const marketAvg = calculateMarketAverage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--hero-gradient-from))] via-[hsl(var(--hero-gradient-via))] to-[hsl(var(--hero-gradient-to))]">
      {/* Header */}
      <header className="bg-[hsl(var(--header-bg))] shadow-lg border-b border-[hsl(var(--header-border))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-[hsl(var(--header-text))]">MutualFund Tracker</h1>
              <nav className="hidden md:flex space-x-4">
                <Button variant="ghost" onClick={() => navigate("/")} className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10">
                  Portfolio
                </Button>
                <Button variant="ghost" onClick={() => navigate("/watchlist")} className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10">
                  Watchlist
                </Button>
                <Button variant="ghost" className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10 font-semibold">
                  Markets
                </Button>
              </nav>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10">
                <Bell className="h-4 w-4" />
              </Button>
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">My Profile</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </Button>
                </>
              ) : (
                <Button 
                  className="bg-[hsl(var(--primary))] text-primary-foreground hover:bg-[hsl(var(--primary))]/90 shadow-lg"
                  onClick={() => navigate("/auth")}
                >
                  Sign In / Register
                </Button>
              )}
              <Button className="bg-[hsl(var(--accent-dark))] text-accent-dark-foreground hover:bg-[hsl(var(--accent-dark))]/90">
                Membership
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Markets Overview</h1>
          <p className="text-muted-foreground">Analyze top performing and underperforming mutual funds</p>
        </div>

        <Tabs defaultValue="high" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="high">High Performers</TabsTrigger>
            <TabsTrigger value="low">Low Performers</TabsTrigger>
            <TabsTrigger value="average">Market Average</TabsTrigger>
          </TabsList>

          <TabsContent value="high" className="space-y-4">
            {highLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-48 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              highPerformersData?.map((fund, index) => 
                renderFundCard(fund, HIGH_PERFORMERS[index], "high")
              )
            )}
          </TabsContent>

          <TabsContent value="low" className="space-y-4">
            {lowLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-48 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              lowPerformersData?.map((fund, index) => 
                renderFundCard(fund, LOW_PERFORMERS[index], "low")
              )
            )}
          </TabsContent>

          <TabsContent value="average">
            <Card>
              <CardHeader>
                <CardTitle>Market Average Performance</CardTitle>
                <CardDescription>Average returns across all tracked funds</CardDescription>
              </CardHeader>
              <CardContent>
                {marketAvg ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">1 Year Average</p>
                      <p className="text-4xl font-bold text-accent">{marketAvg.oneYear}%</p>
                    </div>
                    <div className="text-center p-6 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">3 Year Average</p>
                      <p className="text-4xl font-bold text-accent">{marketAvg.threeYear}%</p>
                    </div>
                    <div className="text-center p-6 bg-accent/10 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">5 Year Average</p>
                      <p className="text-4xl font-bold text-accent">{marketAvg.fiveYear}%</p>
                    </div>
                  </div>
                ) : (
                  <Skeleton className="h-32 w-full" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Markets;
