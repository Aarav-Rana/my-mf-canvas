import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for file uploads
const upload = multer({ dest: "uploads/" });

// Example endpoint to test connection
app.get("/", (req, res) => {
  res.send("✅ Backend is running fine!");
});

// --- NSDL Upload Endpoint ---
app.post("/api/parse-nsdl/summary", upload.single("file"), async (req, res) => {
  try {
    const { password } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!password) return res.status(400).json({ error: "Password missing" });

    // Here you can call your local NSDL decryption logic
    // Example: const parsedData = await decryptNSDL(file.path, password);

    // Mock response for now
    res.json({
      success: true,
      investor_name: "Test User",
      total_portfolio_value: 1234567,
      total_mf_value: 789012,
      mutual_fund_holdings: [],
      equity_holdings: [],
    });
  } catch (error) {
    console.error("Error parsing NSDL:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
