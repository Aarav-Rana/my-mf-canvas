import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // to refresh portfolio after saving
};

export default function UploadNSDLModal({ open, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return alert("Please select a PDF file first.");
    if (!password) return alert("Enter NSDL password (PAN / DOB).");

    setLoading(true);

    // 1) Get authenticated user
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      setLoading(false);
      return alert("You must be logged in.");
    }

    // 2) Send file to backend for parsing
    const form = new FormData();
    form.append("file", file);
    form.append("password", password);

    const parseRes = await fetch("https://my-mf-canvas-1.onrender.com/api/parse-nsdl/summary", {
      method: "POST",
      body: form
    });

    const summary = await parseRes.json();
    if (!summary || summary.error) {
      setLoading(false);
      return alert("Failed to parse PDF. Check password or try another file.");
    }

    // 3) Store parsed result into Supabase
    await fetch("https://my-mf-canvas-1.onrender.com/api/save-portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, summary })
    });

    setLoading(false);
    onSuccess();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload NSDL Statement</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <input
            type="text"
            placeholder="NSDL Password (PAN or DOB)"
            className="border p-2 w-full rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button disabled={loading} onClick={handleUpload}>
            {loading ? "Processing..." : "Upload & Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
