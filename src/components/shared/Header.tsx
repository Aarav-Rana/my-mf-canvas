import { Button } from "@/components/ui/button";
import { Bell, User, LogOut, Sun, Moon, CreditCard } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KeyboardShortcuts } from "@/components/shared/KeyboardShortcuts";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/auth");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-[hsl(var(--header-bg))] shadow-lg border-b border-[hsl(var(--header-border))] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <h1 
              className="text-2xl font-bold text-[hsl(var(--header-text))] cursor-pointer"
              onClick={() => navigate("/")}
            >
              MutualFund Tracker
            </h1>
            <nav className="hidden md:flex space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")} 
                className={`text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10 ${isActive("/") ? "font-semibold" : ""}`}
              >
                Portfolio
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/watchlist")} 
                className={`text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10 ${isActive("/watchlist") ? "font-semibold" : ""}`}
              >
                Watchlist
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/markets")} 
                className={`text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10 ${isActive("/markets") ? "font-semibold" : ""}`}
              >
                Markets
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/news")} 
                className={`text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10 ${isActive("/news") ? "font-semibold" : ""}`}
              >
                News
              </Button>
            </nav>
          </div>
          <div className="flex items-center space-x-2">
            <KeyboardShortcuts />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {isLoggedIn ? (
              <>
                <Button 
                  variant="membership"
                  onClick={() => navigate("/membership")}
                >
                  Membership
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-[hsl(var(--header-text))] hover:bg-[hsl(var(--header-text))]/10">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button 
                className="bg-[hsl(var(--primary))] text-primary-foreground hover:bg-[hsl(var(--primary))]/90 shadow-lg"
                onClick={() => navigate("/auth")}
              >
                Sign In / Register
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
