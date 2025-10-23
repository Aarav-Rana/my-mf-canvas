import { useState, useEffect } from "react";
import { PortfolioSummaryCards } from "@/components/Portfolio/PortfolioSummaryCards";
import { PortfolioPieChart } from "@/components/Portfolio/PortfolioPieChart";
import { PortfolioTable } from "@/components/Portfolio/PortfolioTable";
import { useMultipleFundDetails } from "@/hooks/useMutualFunds";
import { PortfolioHolding } from "@/types/mutualfund";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp, User, Bell } from "lucide-react";

// Sample portfolio holdings with popular Indian mutual funds
const SAMPLE_HOLDINGS = [
  { schemeCode: "120503", schemeName: "SBI Bluechip Fund", units: 100, avgNAV: 65.5 },
  { schemeCode: "118989", schemeName: "HDFC Top 100 Fund", units: 150, avgNAV: 850.0 },
  { schemeCode: "119551", schemeName: "ICICI Prudential Bluechip Fund", units: 80, avgNAV: 90.2 },
  { schemeCode: "120716", schemeName: "Axis Bluechip Fund", units: 120, avgNAV: 52.8 },
  { schemeCode: "135791", schemeName: "Mirae Asset Large Cap Fund", units: 200, avgNAV: 95.3 },
];

const Index = () => {
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>([]);
  
  const schemeCodes = SAMPLE_HOLDINGS.map(h => h.schemeCode);
  const { data: fundsData, isLoading } = useMultipleFundDetails(schemeCodes);

  useEffect(() => {
    if (fundsData && fundsData.length > 0) {
      const holdings: PortfolioHolding[] = SAMPLE_HOLDINGS.map((holding, index) => {
        const fundData = fundsData[index];
        const currentNAV = fundData?.data?.[0]?.nav ? parseFloat(fundData.data[0].nav) : holding.avgNAV;
        const investedAmount = holding.units * holding.avgNAV;
        const currentValue = holding.units * currentNAV;
        const returns = currentValue - investedAmount;
        const returnsPercentage = (returns / investedAmount) * 100;

        return {
          schemeCode: holding.schemeCode,
          schemeName: fundData?.meta?.scheme_name || holding.schemeName,
          units: holding.units,
          investedAmount,
          currentNAV,
          currentValue,
          returns,
          returnsPercentage,
        };
      });

      setPortfolioHoldings(holdings);
    }
  }, [fundsData]);

  const totalInvestment = portfolioHoldings.reduce((sum, h) => sum + h.investedAmount, 0);
  const currentValue = portfolioHoldings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalReturns = currentValue - totalInvestment;
  const returnsPercentage = totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="border-b border-border/20 bg-[hsl(0,0%,0%)] backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  FundTracker
                </h1>
                <p className="text-sm text-white/70">Indian Mutual Funds Portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Watchlist
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Markets
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                News
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">My Profile</span>
              </Button>
              <Button className="bg-[hsl(var(--accent-dark))] text-accent-dark-foreground hover:bg-[hsl(var(--accent-dark))]/90">
                Membership
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Portfolio Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">Portfolio Overview</h2>
            <p className="text-muted-foreground">Track your mutual fund investments in real-time</p>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-96 rounded-xl" />
            </div>
          ) : (
            <>
              <PortfolioSummaryCards
                totalInvestment={totalInvestment}
                currentValue={currentValue}
                totalReturns={totalReturns}
                returnsPercentage={returnsPercentage}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <PortfolioPieChart holdings={portfolioHoldings} />
                <div className="flex flex-col justify-center space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Live Data</h3>
                    <p className="text-sm text-muted-foreground">
                      All NAV values are fetched in real-time from MFAPI and updated every 5 minutes
                    </p>
                  </div>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Portfolio Health</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Your portfolio is showing {totalReturns >= 0 ? "positive" : "negative"} returns
                    </p>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${totalReturns >= 0 ? "bg-accent" : "bg-destructive"} transition-all duration-500`}
                        style={{ width: `${Math.min(Math.abs(returnsPercentage) * 2, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <PortfolioTable holdings={portfolioHoldings} />
              </div>
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 py-6 bg-card/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Data provided by MFAPI • Updated every 5 minutes</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
