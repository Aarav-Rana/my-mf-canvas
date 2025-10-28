import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HeroDashboard } from "@/components/Markets/HeroDashboard";
import { MarketMovers } from "@/components/Markets/MarketMovers";
import { SectorSnapshot } from "@/components/Markets/SectorSnapshot";
import { NewsAndData } from "@/components/Markets/NewsAndData";
import { InteractiveCharts } from "@/components/Markets/InteractiveCharts";
import { EconomicCalendar } from "@/components/Markets/EconomicCalendar";
import { MFComparison } from "@/components/Markets/MFComparison";
import { EducationalCards } from "@/components/Markets/EducationalCards";

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Markets Dashboard</h1>
          <p className="text-muted-foreground">Real-time market data, insights, and investment opportunities</p>
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
                  onClick={() => navigate("/")}
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
