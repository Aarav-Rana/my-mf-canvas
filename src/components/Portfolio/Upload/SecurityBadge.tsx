import { Shield } from "lucide-react";

export const SecurityBadge = () => {
  return (
    <div className="bg-portfolio-gain/10 dark:bg-portfolio-gain/20 border border-portfolio-gain/30 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="h-5 w-5 text-portfolio-gain" />
        <span className="font-bold text-sm text-portfolio-gain">
          Secure Third-Party Processing
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        Your CAS file is securely processed by a trusted third-party API. No data is stored on our servers.
      </p>
    </div>
  );
};