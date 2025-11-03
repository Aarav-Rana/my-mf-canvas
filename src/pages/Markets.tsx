import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/shared/Header";
import { HeroDashboard } from "@/components/Markets/HeroDashboard";
import { MarketMovers } from "@/components/Markets/MarketMovers";
import { SectorSnapshot } from "@/components/Markets/SectorSnapshot";
import { NewsAndData } from "@/components/Markets/NewsAndData";
import { InteractiveCharts } from "@/components/Markets/InteractiveCharts";
import { EconomicCalendar } from "@/components/Markets/EconomicCalendar";
import { MFComparison } from "@/components/Markets/MFComparison";
import { EducationalCards } from "@/components/Markets/EducationalCards";
import { BestInClassFilter } from "@/components/Markets/BestInClassFilter";

const Markets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bestInClassFilter, setBestInClassFilter] = useState(false);

  useEffect(() => {
    // Scroll to top gainers if coming from CTA
    if (location.state?.scrollTo === 'topGainers') {
      setTimeout(() => {
        document.getElementById('market-movers')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--hero-gradient-from))] via-[hsl(var(--hero-gradient-via))] to-[hsl(var(--hero-gradient-to))]">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Markets Dashboard</h1>
            <p className="text-muted-foreground">Real-time market data, insights, and investment opportunities</p>
          </div>
          <BestInClassFilter onFilterApply={setBestInClassFilter} />
        </div>

        <div className="space-y-8">
          {/* Hero Dashboard */}
          <HeroDashboard />

          {/* Market Movers & Sector Snapshot */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketMovers />
            <SectorSnapshot />
          </div>

          {/* News & Data */}
          <NewsAndData />

          {/* Interactive Charts */}
          <InteractiveCharts />

          {/* Economic Calendar */}
          <EconomicCalendar />

          {/* MF vs Market Comparison */}
          <MFComparison />

          {/* Educational Cards */}
          <EducationalCards />

          {/* CTA Section */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-accent/20 via-primary/20 to-accent-dark/20 border border-accent/30">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
              <p className="text-muted-foreground mb-6">
                Join thousands of investors who trust our platform for their mutual fund investments. 
                Start building your wealth today with our curated selection of top-performing funds.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => navigate("/markets", { state: { scrollTo: 'topGainers' } })}
                >
                  View Top Funds
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/watchlist")}
                >
                  Create Watchlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Markets;
