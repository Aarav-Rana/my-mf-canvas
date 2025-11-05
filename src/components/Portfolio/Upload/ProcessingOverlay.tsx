import { CheckCircle2, Circle, Loader2, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProcessingOverlayProps {
  isOpen: boolean;
  step: number;
  fundCount: number;
  progress: number;
}

export const ProcessingOverlay = ({ isOpen, step, fundCount, progress }: ProcessingOverlayProps) => {
  if (!isOpen) return null;

  const steps = [
    { id: 1, label: "Decrypting file…" },
    { id: 2, label: "Reading all mutual fund entries…" },
    { id: 3, label: `Importing ${fundCount || "…"} funds into your portfolio…` },
    { id: 4, label: "Updating dashboard…" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="bg-background dark:bg-card rounded-2xl p-12 w-[480px] max-w-[90vw] shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-foreground">Processing Your Statement</h3>
          <Shield className="h-6 w-6 text-portfolio-gain" />
        </div>

        <div className="space-y-5 mb-8">
          {steps.map((s) => (
            <div key={s.id} className="flex items-center gap-4">
              {step > s.id ? (
                <CheckCircle2 className="h-6 w-6 text-portfolio-gain flex-shrink-0" />
              ) : step === s.id ? (
                <Loader2 className="h-6 w-6 text-portfolio-gain animate-spin flex-shrink-0" />
              ) : (
                <Circle className="h-6 w-6 text-muted-foreground/50 flex-shrink-0" />
              )}
              <span
                className={
                  step === s.id
                    ? "text-portfolio-gain font-semibold"
                    : step > s.id
                    ? "text-muted-foreground"
                    : "text-muted-foreground/50"
                }
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-portfolio-gain font-bold text-lg">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>
  );
};
