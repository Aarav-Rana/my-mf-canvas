import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Rocket, Target, TrendingUp, CheckCircle } from "lucide-react";

interface OnboardingWizardProps {
  open: boolean;
  onComplete: () => void;
}

export const OnboardingWizard = ({ open, onComplete }: OnboardingWizardProps) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Rocket,
      title: "Welcome to MutualFund Tracker",
      description: "Your all-in-one platform to track, analyze, and optimize your mutual fund investments.",
      content: "We'll help you get started in just a few steps."
    },
    {
      icon: Target,
      title: "Build Your Watchlist",
      description: "Add mutual funds you're interested in to track their performance in real-time.",
      content: "Click on any fund in the Markets page and select 'Add to Watchlist'."
    },
    {
      icon: TrendingUp,
      title: "Track Your Portfolio",
      description: "Monitor your investments with detailed analytics and performance metrics.",
      content: "View portfolio health score, allocation charts, and returns all in one place."
    },
    {
      icon: CheckCircle,
      title: "You're All Set!",
      description: "Start exploring and make informed investment decisions.",
      content: "Check out the Markets page for top gainers and sector analysis."
    }
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={handleSkip}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit animate-fade-in">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-center">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={progress} className="h-2" />
          
          <p className="text-center text-sm text-muted-foreground">
            {currentStep.content}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip} className="flex-1">
              Skip
            </Button>
            <Button onClick={handleNext} className="flex-1 hover-scale">
              {step < steps.length - 1 ? 'Next' : 'Get Started'}
            </Button>
          </div>

          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === step ? 'bg-primary w-6' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
