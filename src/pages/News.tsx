import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, AlertCircle, Globe, ArrowRight } from "lucide-react";

const newsData = [
  {
    id: 1,
    title: "Nifty 50 Crosses 25,000 Mark on Strong FII Inflows",
    excerpt: "Indian equity markets rally as foreign institutional investors pump in ₹8,500 crore in the last week...",
    category: "Markets",
    time: "2 hours ago",
    source: "Economic Times",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
  },
  {
    id: 2,
    title: "RBI Holds Repo Rate Steady at 6.5%",
    excerpt: "Reserve Bank maintains status quo on interest rates, signals cautious approach on inflation...",
    category: "Policy",
    time: "4 hours ago",
    source: "Mint",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400",
  },
  {
    id: 3,
    title: "Top 5 Mutual Funds for Long-Term Wealth Creation in 2024",
    excerpt: "Fund managers recommend these schemes for investors looking to build substantial wealth over the next decade...",
    category: "Mutual Funds",
    time: "6 hours ago",
    source: "MoneyControl",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400",
  },
  {
    id: 4,
    title: "IT Sector Rallies 5% on Strong Q3 Earnings",
    excerpt: "Technology stocks lead market gains as major IT companies report better-than-expected quarterly results...",
    category: "Sectors",
    time: "8 hours ago",
    source: "Business Standard",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
  },
  {
    id: 5,
    title: "Gold Prices Surge to All-Time High",
    excerpt: "Precious metal reaches ₹72,000 per 10 grams amid global economic uncertainty...",
    category: "Commodities",
    time: "10 hours ago",
    source: "CNBC-TV18",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400",
  },
  {
    id: 6,
    title: "New Tax Benefits for Equity Mutual Funds Proposed",
    excerpt: "Government considers extending LTCG exemption limits to boost retail participation...",
    category: "Policy",
    time: "12 hours ago",
    source: "Economic Times",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400",
  },
  {
    id: 7,
    title: "Banking Stocks Under Pressure After NPA Concerns",
    excerpt: "Private sector banks see selloff as analysts raise concerns about asset quality...",
    category: "Markets",
    time: "14 hours ago",
    source: "Mint",
    image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400",
  },
  {
    id: 8,
    title: "ESG Funds See Record Inflows in Q4 2024",
    excerpt: "Environment-focused mutual funds attract ₹15,000 crore as sustainable investing gains momentum...",
    category: "Mutual Funds",
    time: "1 day ago",
    source: "MoneyControl",
    image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400",
  },
];

const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredNews = newsData.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || news.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", "markets", "mutual funds", "policy", "sectors", "commodities"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--hero-gradient-from))] via-[hsl(var(--hero-gradient-via))] to-[hsl(var(--hero-gradient-to))]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Market News & Updates</h1>
          <p className="text-muted-foreground">Stay informed with the latest market developments and insights</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured News */}
        {filteredNews.length > 0 && (
          <Card className="mb-6 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-64 md:h-auto">
                <img
                  src={filteredNews[0].image}
                  alt={filteredNews[0].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-center">
                <Badge className="w-fit mb-3">{filteredNews[0].category}</Badge>
                <h2 className="text-2xl font-bold mb-3">{filteredNews[0].title}</h2>
                <p className="text-muted-foreground mb-4">{filteredNews[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{filteredNews[0].source}</span>
                    <span>•</span>
                    <span>{filteredNews[0].time}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.slice(1).map((news) => (
            <Card key={news.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="h-48 overflow-hidden">
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{news.category}</Badge>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{news.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{news.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>{news.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No news found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default News;
