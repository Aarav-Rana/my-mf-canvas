import { useState, useEffect } from "react";
import { PortfolioSummaryCards } from "@/components/Portfolio/PortfolioSummaryCards";
import { PortfolioPieChart } from "@/components/Portfolio/PortfolioPieChart";
import { PortfolioTable } from "@/components/Portfolio/PortfolioTable";
import { useMultipleFundDetails } from "@/hooks/useMutualFunds";
import { PortfolioHolding } from "@/types/mutualfund";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Twitter, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/shared/Header";

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
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Portfolio Section */}
        <section>
          <div className="mb-8">
            <h1 className="text-[2.25rem] font-bold text-foreground mb-3 leading-tight">Portfolio Overview</h1>
            <p className="text-[0.95rem] text-muted-foreground">Track your mutual fund investments in real-time</p>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
              <Skeleton className="h-[500px] rounded-xl" />
              <Skeleton className="h-[400px] rounded-xl" />
            </div>
          ) : (
            <div className="space-y-8">
              <PortfolioSummaryCards
                totalInvestment={totalInvestment}
                currentValue={currentValue}
                totalReturns={totalReturns}
                returnsPercentage={returnsPercentage}
              />

              <PortfolioPieChart holdings={portfolioHoldings} />

              <PortfolioTable holdings={portfolioHoldings} />
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-[hsl(var(--footer-bg))] text-[hsl(var(--footer-text))] border-t border-[hsl(var(--footer-border))]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* About Us Section */}
            <div>
              <h3 className="font-bold text-[1.1rem] mb-4 text-foreground">About Us</h3>
              <p className="text-[0.9rem] leading-relaxed text-muted-foreground">
                We help investors make informed decisions with comprehensive portfolio tracking and market insights.
              </p>
            </div>
            
            {/* Products Section */}
            <div>
              <h3 className="font-bold text-[1.1rem] mb-4 text-foreground">Products</h3>
              <ul className="space-y-2.5 text-[0.9rem]">
                <li className="hover:text-primary hover:underline cursor-pointer transition-colors text-muted-foreground">
                  Portfolio Management
                </li>
                <li className="hover:text-primary hover:underline cursor-pointer transition-colors text-muted-foreground">
                  Tracking
                </li>
                <li className="hover:text-primary hover:underline cursor-pointer transition-colors text-muted-foreground">
                  Investment Advising
                </li>
              </ul>
            </div>
            
            {/* Contact Section */}
            <div>
              <h3 className="font-bold text-[1.1rem] mb-4 text-foreground">Contact</h3>
              <div className="space-y-2.5 text-[0.9rem]">
                <p className="text-muted-foreground">
                  Email: <a href="mailto:contact@fundtracker.com" className="text-primary hover:underline transition-colors">contact@fundtracker.com</a>
                </p>
                <p className="text-muted-foreground">
                  Phone: <a href="tel:+919876543210" className="text-primary hover:underline transition-colors">+91 98765 43210</a>
                </p>
                <div className="flex gap-4 mt-4">
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[hsl(var(--footer-border))] text-center">
            <p className="text-[0.75rem] italic text-muted-foreground">
              Data provided by MFAPI • Updated every 5 minutes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
