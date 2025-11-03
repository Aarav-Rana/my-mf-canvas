import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Keyboard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const KeyboardShortcuts = () => {
  const shortcuts = [
    { keys: ["Ctrl", "K"], description: "Open search" },
    { keys: ["G", "H"], description: "Go to Home (Portfolio)" },
    { keys: ["G", "W"], description: "Go to Watchlist" },
    { keys: ["G", "M"], description: "Go to Markets" },
    { keys: ["G", "N"], description: "Go to News" },
    { keys: ["N"], description: "Add new item" },
    { keys: ["E"], description: "Export data" },
    { keys: ["R"], description: "Refresh data" },
    { keys: ["?"], description: "Show shortcuts" },
    { keys: ["Esc"], description: "Close dialogs" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Keyboard Shortcuts">
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 hover:bg-muted/50 px-2 rounded transition-colors"
            >
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, keyIndex) => (
                  <Badge key={keyIndex} variant="outline" className="font-mono text-xs">
                    {key}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Press <Badge variant="outline" className="mx-1 font-mono">?</Badge> anytime to view shortcuts
        </p>
      </DialogContent>
    </Dialog>
  );
};
