import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, User, Bell, ArrowLeft, X, Plus, Twitter, Linkedin, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { useWatchlist } from "@/hooks/useWatchlist";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


const Watchlist = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchemeCode, setSelectedSchemeCode] = useState<string | null>(null);

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
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
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
              <Button 
                variant="ghost" 
                onClick={handleSignOut}
                className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Watchlist Section */}
        <section className="bg-card rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-card-foreground mb-2">My Watchlist</h2>
              <p className="text-card-foreground/70">Track mutual funds you're interested in</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[hsl(var(--accent))] text-accent-foreground hover:bg-[hsl(var(--accent))]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fund
                </Button>
              </DialogTrigger>
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
                    className="bg-[hsl(var(--accent))] text-accent-foreground hover:bg-[hsl(var(--accent))]/90"
                  >
                    {isLoadingDetails ? "Loading..." : "Add to Watchlist"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {isLoadingWatchlist ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Loading watchlist...</p>
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">Your watchlist is empty</p>
              <p className="text-muted-foreground/70 mb-6">Start adding mutual funds to track their performance</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[hsl(var(--accent))] text-accent-foreground hover:bg-[hsl(var(--accent))]/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Fund
                  </Button>
                </DialogTrigger>
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
                      className="bg-[hsl(var(--accent))] text-accent-foreground hover:bg-[hsl(var(--accent))]/90"
                    >
                      {isLoadingDetails ? "Loading..." : "Add to Watchlist"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-card-foreground font-semibold">Scheme Name</TableHead>
                    <TableHead className="text-card-foreground font-semibold">Category</TableHead>
                    <TableHead className="text-card-foreground font-semibold text-right">Current NAV</TableHead>
                    <TableHead className="text-card-foreground font-semibold text-right">Change</TableHead>
                    <TableHead className="text-card-foreground font-semibold text-right">Change %</TableHead>
                    <TableHead className="text-card-foreground font-semibold text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {watchlist.map((fund) => (
                    <TableRow key={fund.id} className="border-border/30 hover:bg-secondary/30">
                      <TableCell className="font-medium text-card-foreground">
                        <div>
                          <div className="font-semibold">{fund.scheme_name}</div>
                          <div className="text-xs text-muted-foreground">Code: {fund.scheme_code}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {fund.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-card-foreground">
                        ₹{Number(fund.current_nav).toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${Number(fund.change) >= 0 ? "text-accent" : "text-destructive"}`}>
                        {Number(fund.change) >= 0 ? "+" : ""}₹{Number(fund.change).toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${Number(fund.change_percentage) >= 0 ? "text-accent" : "text-destructive"}`}>
                        {Number(fund.change_percentage) >= 0 ? "+" : ""}{Number(fund.change_percentage).toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWatchlist(fund.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>

        {/* Info Card */}
        <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Track Performance & Get Smart Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-card-foreground/70">
              Monitor NAV changes and performance metrics of your watchlisted funds in real-time
            </p>
            <p className="text-sm text-card-foreground/70">
              Get notified when your watchlisted funds reach target NAV or show significant changes
            </p>
          </CardContent>
        </Card>
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

export default Watchlist;
