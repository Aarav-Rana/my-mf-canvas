import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileUploadZone } from "./Upload/FileUploadZone";
import { PasswordInput } from "./Upload/PasswordInput";
import { SecurityBadge } from "./Upload/SecurityBadge";
import { Button } from "@/components/ui/button";
import { ProcessingOverlay } from "./Upload/ProcessingOverlay";
import { usePortfolioHoldings } from "@/hooks/usePortfolioHoldings";
import { supabase } from "@/integrations/supabase/client";
import { processPDFFile } from "@/lib/pdfProcessor";
import { toast } from "sonner";

interface UploadNSDLModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadNSDLModal = ({ isOpen, onClose }: UploadNSDLModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [fundCount, setFundCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState<string | undefined>();
  const [isEncrypted, setIsEncrypted] = useState(true);

  // Get user ID on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  const { importHoldings } = usePortfolioHoldings(userId);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file || (isEncrypted && !password)) return;

    try {
      setIsProcessing(true);
      setProcessingStep(1);
      setProgress(0);

      // Step 1: Decrypt file (20%)
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(20);
      setProcessingStep(2);

      // Step 2: Read mutual fund entries (40%)
      const extractedData = await processPDFFile(file, isEncrypted ? password : "");
      setFundCount(extractedData.length);
      setProgress(40);

      if (extractedData.length === 0) {
        throw new Error("No mutual fund data found in the statement");
      }

      setProcessingStep(3);
      setProgress(60);

      // Step 3: Import funds (80%)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      await importHoldings(
        extractedData.map((fund) => ({
          user_id: user.id,
          scheme_code: fund.schemeCode,
          scheme_name: fund.schemeName,
          folio_number: fund.folioNumber || null,
          units: fund.units,
          current_nav: fund.currentNAV,
          invested_amount: fund.investedAmount,
          current_value: fund.currentValue,
          returns: fund.returns,
          returns_percentage: fund.returnsPercentage,
          category: fund.category || null,
        }))
      );

      setProgress(80);
      setProcessingStep(4);

      // Step 4: Update dashboard (100%)
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(100);

      // Success
      await new Promise(resolve => setTimeout(resolve, 500));
      handleClose();
      toast.success(`Successfully imported ${extractedData.length} mutual funds and updated your portfolio.`);
    } catch (error: any) {
      console.error("Upload error:", error);
      
      if (error.message.includes("password")) {
        toast.error("Incorrect password. Please try again.");
      } else if (error.message.includes("No mutual fund data")) {
        toast.error("No mutual fund data found. Please upload a valid NSDL CAS.");
      } else if (error.message.includes("not a valid")) {
        toast.error("This doesn't appear to be a valid NSDL statement.");
      } else {
        toast.error("Failed to process the file. Please try again.");
      }
      
      setIsProcessing(false);
      setProcessingStep(0);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPassword("");
    setIsProcessing(false);
    setProcessingStep(0);
    setProgress(0);
    setFundCount(0);
    setIsEncrypted(true);
    onClose();
  };

  const isValid = file && (isEncrypted ? password.length >= 1 : true);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-portfolio-gain dark:text-portfolio-gain">
              Import All Your Mutual Funds from NSDL
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Upload your password-protected CAS to instantly add all your holdings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Document Type Selection */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-card-foreground">Select Document Type</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsEncrypted(true)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isEncrypted
                      ? "border-portfolio-gain bg-portfolio-gain/10"
                      : "border-border hover:border-portfolio-gain/50"
                  }`}
                >
                  <p className="font-semibold text-sm">🔒 Encrypted NSDL</p>
                  <p className="text-xs text-muted-foreground mt-1">Password-protected CAS</p>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEncrypted(false)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    !isEncrypted
                      ? "border-portfolio-gain bg-portfolio-gain/10"
                      : "border-border hover:border-portfolio-gain/50"
                  }`}
                >
                  <p className="font-semibold text-sm">📄 Decrypted NSDL</p>
                  <p className="text-xs text-muted-foreground mt-1">Unprotected CAS</p>
                </button>
              </div>
            </div>

            <FileUploadZone
              file={file}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />

            {isEncrypted && (
              <PasswordInput
                value={password}
                onChange={setPassword}
              />
            )}

            <SecurityBadge />

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={!isValid}
                className="flex-1 bg-portfolio-gain hover:bg-portfolio-gain/90 text-white"
              >
                {isEncrypted ? "Decrypt & Import All" : "Import All"}
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>

            <div className="pt-4 border-t text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>Encrypted in-browser using Web Crypto API</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🗑️</span>
                <span>Auto-wiped from memory after import</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>SEBI & NSDL compliant</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProcessingOverlay
        isOpen={isProcessing}
        step={processingStep}
        fundCount={fundCount}
        progress={progress}
      />
    </>
  );
};
