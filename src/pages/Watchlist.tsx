import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Bell, ArrowLeft, LogOut, Search, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutualFundsList, useMutualFundDetails } from "@/hooks/useMutualFunds";
import { useWatchlist, WatchlistItem } from "@/hooks/useWatchlist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WatchlistHeader } from "@/components/Watchlist/WatchlistHeader";
import { WatchlistTreeTable } from "@/components/Watchlist/WatchlistTreeTable";
import { WatchlistCharts } from "@/components/Watchlist/WatchlistCharts";
import { WatchlistTools } from "@/components/Watchlist/WatchlistTools";
import { WatchlistInspector } from "@/components/Watchlist/WatchlistInspector";


const Watchlist = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<WatchlistItem | null>(null);

  const { data: mutualFundsList, isLoading: isLoadingList } = useMutualFundsList();
  const { data: fundDetails, isLoading: isLoadingDetails } = useMutualFundDetails(selectedSchemeCode || "");
  const { watchlist, isLoading: isLoadingWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist(userId);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session) {
        setUserId(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const filteredFunds = mutualFundsList?.filter((fund) =>
    fund.schemeName.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const handleAddToWatchlist = () => {
    if (!fundDetails || !selectedSchemeCode) return;

    const latestNAV = parseFloat(fundDetails.data[0]?.nav || "0");
    const previousNAV = parseFloat(fundDetails.data[1]?.nav || "0");
    const change = latestNAV - previousNAV;
    const changePercentage = previousNAV > 0 ? (change / previousNAV) * 100 : 0;

    addToWatchlist({
      scheme_code: fundDetails.meta.scheme_code,
      scheme_name: fundDetails.meta.scheme_name,
      current_nav: latestNAV,
      change: change,
      change_percentage: changePercentage,
      category: fundDetails.meta.scheme_category,
    });

    setIsDialogOpen(false);
    setSearchQuery("");
    setSelectedSchemeCode(null);
  };

  const totalValue = 1240000; // ₹12.4L
  const totalReturns = 225000;
  const returnsPercentage = 18.2;

  const handleExport = () => {
    toast.success("Exporting watchlist data...");
  };

  const handleRefresh = () => {
    toast.success("Refreshing data...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">FundTracker</h1>
                <p className="text-sm text-muted-foreground">Indian Mutual Funds Portfolio</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" onClick={() => navigate("/markets")}>
                Markets
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="flex gap-4">
          {/* Left: Watchlist Panel */}
          <div className="flex-1">
            <div className="bg-card rounded-lg border border-border shadow-lg overflow-hidden">
              <WatchlistHeader
                portfolioName="Equity Master"
                totalValue={totalValue}
                totalReturns={totalReturns}
                returnsPercentage={returnsPercentage}
                onAddNew={() => setIsDialogOpen(true)}
                onExport={handleExport}
                onRefresh={handleRefresh}
              />

              {isLoadingWatchlist ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Loading watchlist...</p>
                </div>
              ) : watchlist.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">Your watchlist is empty</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Fund
                  </Button>
                </div>
              ) : (
                <>
                  <WatchlistTreeTable
                    watchlist={watchlist}
                    onRemove={removeFromWatchlist}
                    onHover={setHoveredItem}
                  />
                  <WatchlistCharts watchlist={watchlist} />
                  <WatchlistTools />
                </>
              )}
            </div>
          </div>

          {/* Right: Inspector Panel */}
          <div className="w-80 sticky top-20 h-fit">
            <WatchlistInspector
              selectedItem={hoveredItem}
              onClose={() => setHoveredItem(null)}
            />
          </div>
        </div>
      </main>

      {/* Add Fund Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Fund to Watchlist</DialogTitle>
            <DialogDescription>
              Search and select a mutual fund to add to your watchlist
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mutual funds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {isLoadingList ? (
                <p className="text-center text-muted-foreground py-4">Loading funds...</p>
              ) : filteredFunds && filteredFunds.length > 0 ? (
                filteredFunds.map((fund) => (
                  <div
                    key={fund.schemeCode}
                    onClick={() => setSelectedSchemeCode(fund.schemeCode)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSchemeCode === fund.schemeCode
                        ? "bg-primary/10 border-primary"
                        : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <p className="font-medium text-sm">{fund.schemeName}</p>
                    <p className="text-xs text-muted-foreground">Code: {fund.schemeCode}</p>
                  </div>
                ))
              ) : searchQuery ? (
                <p className="text-center text-muted-foreground py-4">No funds found</p>
              ) : (
                <p className="text-center text-muted-foreground py-4">Start typing to search funds</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddToWatchlist}
              disabled={!selectedSchemeCode || isLoadingDetails}
            >
              {isLoadingDetails ? "Loading..." : "Add to Watchlist"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Watchlist;
