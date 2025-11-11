import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FileUploadZone } from "./Upload/FileUploadZone";
import { PasswordInput } from "./Upload/PasswordInput";
import { SecurityBadge } from "./Upload/SecurityBadge";
import { Button } from "@/components/ui/button";
import { ProcessingOverlay } from "./Upload/ProcessingOverlay";
import { usePortfolioHoldings } from "@/hooks/usePortfolioHoldings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface UploadNSDLModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadNSDLModal = ({ isOpen, onClose }: UploadNSDLModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [fundCount, setFundCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [userId, setUserId] = useState<string | undefined>();

  const { importHoldings } = usePortfolioHoldings(userId);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  /**
   * Extract text from PDF using pdfjs-dist
   */
  const extractPDFText = async (file: File, password?: string): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password });
    const pdfDoc = await loadingTask.promise;
    let textContent = "";

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const content = await page.getTextContent();
      textContent += content.items.map((item: any) => item.str).join(" ") + "\n";
    }

    return textContent;
  };

  /**
   * Detect whether PDF is encrypted and return extracted text
   */
  const tryDecryptPDF = async (file: File, password: string): Promise<{ text: string; encrypted: boolean }> => {
    try {
      const text = await extractPDFText(file, password || undefined);
      return { text, encrypted: !!password };
    } catch (err: any) {
      if (err?.name === "PasswordException" || err?.message?.includes("password")) {
        throw new Error("Incorrect password");
      }
      if (err?.message?.includes("InvalidPDFException")) {
        throw new Error("Invalid PDF file");
      }
      // Retry as non-encrypted if no password
      if (!password) {
        try {
          const text = await extractPDFText(file);
          return { text, encrypted: false };
        } catch {
          throw new Error("Failed to parse PDF");
        }
      }
      throw err;
    }
  };

  /**
   * Parse extracted text into fund data
   */
  const parseFunds = (text: string): any[] => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const extractedFunds: any[] = [];
    let currentFund: any = null;

    for (const line of lines) {
      if (/^[A-Za-z\s&.,'-]+$/.test(line) && line.length > 15 && !line.includes("ISIN") && !line.includes("Folio")) {
        if (currentFund) extractedFunds.push(currentFund);
        currentFund = { schemeName: line };
      } else if (/^INF[0-9A-Z]{10}$/.test(line)) {
        currentFund = currentFund || {};
        currentFund.schemeCode = line;
      } else if (line.includes("Folio") && line.includes(":")) {
        currentFund = currentFund || {};
        currentFund.folioNumber = line.split(":")[1]?.trim() || null;
      } else if (/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(line.replace(/,/g, ""))) {
        const num = parseFloat(line.replace(/,/g, ""));
        if (num > 0 && num < 100000) {
          currentFund = currentFund || {};
          currentFund.units = num.toString();
        }
      } else if (line.includes("Value") || line.includes("NAV")) {
        const values = line.match(/[\d,]+\.?\d*/g);
        if (values && values.length >= 1) {
          currentFund = currentFund || {};
          currentFund.currentValue = parseFloat(values[0].replace(/,/g, ""));
        }
      }
    }

    if (currentFund) extractedFunds.push(currentFund);

    return extractedFunds.map(fund => ({
      ...fund,
      investedAmount: fund.currentValue?.toString() || "0",
      currentNAV: "0",
      returns: "0",
      returnsPercentage: "0",
      category: null,
    }));
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      setIsProcessing(true);
      setProcessingStep(1);
      setProgress(15);

      await new Promise(r => setTimeout(r, 500));

      // Try decrypt with or without password
      const { text, encrypted } = await tryDecryptPDF(file, password);
      setIsEncrypted(encrypted);

      setProcessingStep(2);
      setProgress(40);

      const extractedFunds = parseFunds(text);
      if (extractedFunds.length === 0) throw new Error("No mutual fund data found in the statement");

      setFundCount(extractedFunds.length);
      setProgress(70);
      setProcessingStep(3);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      await importHoldings(
        extractedFunds.map(fund => ({
          user_id: user.id,
          scheme_code: fund.schemeCode || "UNKNOWN",
          scheme_name: fund.schemeName || "Unknown Fund",
          folio_number: fund.folioNumber || null,
          units: fund.units || "0",
          current_nav: fund.currentNAV || "0",
          invested_amount: fund.investedAmount || "0",
          current_value: fund.currentValue?.toString() || "0",
          returns: fund.returns || "0",
          returns_percentage: fund.returnsPercentage || "0",
          category: fund.category || null,
        }))
      );

      setProgress(100);
      setProcessingStep(4);

      await new Promise(r => setTimeout(r, 600));
      toast.success(`Imported ${extractedFunds.length} mutual funds successfully!`);
      handleClose();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error.message.includes("password")
          ? "Incorrect password for encrypted file"
          : error.message.includes("mutual fund")
          ? "No data found. Upload valid NSDL CAS."
          : "Processing failed"
      );
      setIsProcessing(false);
      setProcessingStep(0);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPassword("");
    setIsEncrypted(true);
    setIsProcessing(false);
    setProcessingStep(0);
    setFundCount(0);
    setProgress(0);
    onClose();
  };

  const isValid = !!file && (!isEncrypted || password.length > 0);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-portfolio-gain dark:text-portfolio-gain">
              Import All Your Mutual Funds from NSDL
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Upload your CAS statement to instantly sync all your holdings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <FileUploadZone file={file} onFileSelect={handleFileSelect} onFileRemove={handleFileRemove} />

            {isEncrypted && (
              <PasswordInput value={password} onChange={setPassword} />
            )}

            <SecurityBadge />

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={!isValid || isProcessing}
                className="flex-1 bg-portfolio-gain hover:bg-portfolio-gain/90 text-white"
              >
                {isProcessing
                  ? "Processing..."
                  : isEncrypted
                  ? "Decrypt & Import"
                  : "Import All"}
              </Button>
              <Button onClick={handleClose} variant="outline" className="flex-1" disabled={isProcessing}>
                Cancel
              </Button>
            </div>

            <div className="pt-4 border-t text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <span>🔒</span>
                <span>In-browser processing. No upload to server.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🗑️</span>
                <span>File deleted after import completion.</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>SEBI & NSDL compliant workflow.</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProcessingOverlay isOpen={isProcessing} step={processingStep} fundCount={fundCount} progress={progress} />
    </>
  );
};
