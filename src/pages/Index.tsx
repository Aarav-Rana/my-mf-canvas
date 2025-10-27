import { useState, useEffect } from "react";
import { PortfolioSummaryCards } from "@/components/Portfolio/PortfolioSummaryCards";
import { PortfolioPieChart } from "@/components/Portfolio/PortfolioPieChart";
import { PortfolioTable } from "@/components/Portfolio/PortfolioTable";
import { useMultipleFundDetails } from "@/hooks/useMutualFunds";
import { PortfolioHolding } from "@/types/mutualfund";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { TrendingUp, User, Bell, Twitter, Linkedin, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Sample portfolio holdings with popular Indian mutual funds
const SAMPLE_HOLDINGS = [
  { schemeCode: "120503", schemeName: "SBI Bluechip Fund", units: 100, avgNAV: 65.5 },
  { schemeCode: "118989", schemeName: "HDFC Top 100 Fund", units: 150, avgNAV: 850.0 },
  { schemeCode: "119551", schemeName: "ICICI Prudential Bluechip Fund", units: 80, avgNAV: 90.2 },
  { schemeCode: "120716", schemeName: "Axis Bluechip Fund", units: 120, avgNAV: 52.8 },
  { schemeCode: "135791", schemeName: "Mirae Asset Large Cap Fund", units: 200, avgNAV: 95.3 },
];

const Index = () => {
  const navigate = useNavigate();
  const [portfolioHoldings, setPortfolioHoldings] = useState<PortfolioHolding[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const schemeCodes = SAMPLE_HOLDINGS.map(h => h.schemeCode);
  const { data: fundsData, isLoading } = useMultipleFundDetails(schemeCodes);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setIsLoggedIn(true);
      }
    });

    // Listen for auth changes
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
      <header className="border-b border-border/20 bg-[hsl(var(--header-bg))] backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-[hsl(var(--header-text))]" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[hsl(var(--header-text))]">
                  FundTracker
                </h1>
                <p className="text-sm text-[hsl(var(--header-text))]/70">Indian Mutual Funds Portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10"
                onClick={() => navigate("/watchlist")}
              >
                Watchlist
              </Button>
              <Button 
                variant="ghost" 
                className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10"
                onClick={() => navigate("/markets")}
              >
                Markets
              </Button>
              <Button variant="ghost" className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10">
                News
              </Button>
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
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Portfolio Section */}
        <section className="bg-card rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-card-foreground mb-2">Portfolio Overview</h2>
            <p className="text-card-foreground/70">Track your mutual fund investments in real-time</p>
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

              <div className="mt-8">
                <PortfolioPieChart holdings={portfolioHoldings} />
              </div>

              <div className="mt-8">
                <PortfolioTable holdings={portfolioHoldings} />
              </div>
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[hsl(var(--footer-bg))] text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Us Section */}
            <div>
              <h3 className="font-bold text-lg mb-3">About Us</h3>
              <p className="text-sm leading-relaxed opacity-90">
                We help investors make informed decisions with comprehensive portfolio tracking and market insights.
              </p>
            </div>
            
            {/* Products Section */}
            <div>
              <h3 className="font-bold text-lg mb-3">Products</h3>
              <ul className="space-y-2 text-sm">
                <li className="hover:underline cursor-pointer opacity-90 hover:opacity-100">Portfolio Management</li>
                <li className="hover:underline cursor-pointer opacity-90 hover:opacity-100">Tracking</li>
                <li className="hover:underline cursor-pointer opacity-90 hover:opacity-100">Investment Advising</li>
              </ul>
            </div>
            
            {/* Contact Section */}
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p>Email: contact@fundtracker.com</p>
                <p>Phone: +91 98765 43210</p>
                <div className="flex gap-3 mt-3">
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-white/20 text-center text-sm opacity-75">
            <p>Data provided by MFAPI • Updated every 5 minutes</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
