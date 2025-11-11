import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // refresh portfolio after save
};

export default function UploadNSDLModal({ open, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return alert("Please select a PDF file first.");
    if (!password) return alert("Enter NSDL password (PAN / DOB).");

    setLoading(true);

    // 1️⃣ Get authenticated user (optional for Supabase)
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      setLoading(false);
      return alert("You must be logged in.");
    }

    try {
      // 2️⃣ Send file + password to local backend
      const form = new FormData();
      form.append("file", file);
      form.append("password", password);

      const parseRes = await fetch("http://localhost:8080/api/parse-nsdl/summary", {
        method: "POST",
        body: form,
      });

      if (!parseRes.ok) {
        const err = await parseRes.text();
        throw new Error(err || "Failed to parse PDF");
      }

      const summary = await parseRes.json();

      if (!summary || summary.error) {
        throw new Error(summary.error || "Invalid PDF or password");
      }

      console.log("✅ Decrypted NSDL data:", summary);

      // 3️⃣ Optionally save to Supabase (comment out if not needed)
      // await fetch("http://localhost:8080/api/save-portfolio", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ user_id: user.id, summary }),
      // });

      alert("✅ NSDL
