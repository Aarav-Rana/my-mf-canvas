import { Header } from "@/components/shared/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, TrendingUp, TrendingDown, AlertCircle, Info, CheckCircle, X } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "alert",
    title: "Price Alert: Axis Bluechip Fund",
    message: "Fund NAV reached your target price of ₹45.20",
    time: "2 hours ago",
    read: false,
    icon: TrendingUp,
    color: "text-green-500",
  },
  {
    id: 2,
    type: "alert",
    title: "Portfolio Alert",
    message: "Your portfolio is down 2.3% today",
    time: "5 hours ago",
    read: false,
    icon: TrendingDown,
    color: "text-red-500",
  },
  {
    id: 3,
    type: "info",
    title: "Market Update",
    message: "Nifty 50 crosses 25,000 mark for the first time",
    time: "1 day ago",
    read: true,
    icon: Info,
    color: "text-blue-500",
  },
  {
    id: 4,
    type: "success",
    title: "Goal Milestone Reached",
    message: "You've reached 75% of your retirement goal!",
    time: "2 days ago",
    read: true,
    icon: CheckCircle,
    color: "text-green-500",
  },
  {
    id: 5,
    type: "warning",
    title: "Rebalancing Recommended",
    message: "Your equity allocation is 5% higher than target",
    time: "3 days ago",
    read: true,
    icon: AlertCircle,
    color: "text-yellow-500",
  },
  {
    id: 6,
    type: "info",
    title: "New Feature Available",
    message: "Check out our new AI-powered fund recommendation tool",
    time: "1 week ago",
    read: true,
    icon: Info,
    color: "text-blue-500",
  },
];

const Notifications = () => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--hero-gradient-from))] via-[hsl(var(--hero-gradient-via))] to-[hsl(var(--hero-gradient-to))]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with alerts and important updates
              {unreadCount > 0 && (
                <Badge className="ml-2" variant="destructive">
                  {unreadCount} new
                </Badge>
              )}
            </p>
          </div>
          <Button variant="outline">Mark all as read</Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  className={`${
                    !notification.read ? "border-primary/50 bg-primary/5" : ""
                  } hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full bg-background ${notification.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold mb-1">{notification.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.time}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4 mt-6">
            {notifications
              .filter((n) => !n.read)
              .map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card key={notification.id} className="border-primary/50 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full bg-background ${notification.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4 mt-6">
            {notifications
              .filter((n) => n.type === "alert")
              .map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card key={notification.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full bg-background ${notification.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>

          <TabsContent value="info" className="space-y-4 mt-6">
            {notifications
              .filter((n) => n.type === "info")
              .map((notification) => {
                const Icon = notification.icon;
                return (
                  <Card key={notification.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full bg-background ${notification.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Notifications;
