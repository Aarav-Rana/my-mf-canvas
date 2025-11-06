import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadNSDLModal } from "./UploadNSDLModal";

export const UploadNSDLButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-[hsl(var(--upload-button))] text-[hsl(var(--upload-button-foreground))] hover:bg-[hsl(var(--upload-button))]/90 shadow-md transition-all duration-200 hover:-translate-y-0.5"
        aria-label="Upload NSDL Consolidated Account Statement"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload NSDL Statement
      </Button>
      
      <UploadNSDLModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
