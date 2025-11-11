import express from "express";
import multer from "multer";
import fs from "fs";
import { decryptNSDL } from "../utils/decryptNSDL";
import { parseNSDL } from "../utils/parseNSDL";
import { updatePortfolio } from "../services/portfolioService";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-nsdl", upload.single("statementFile"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    const password = req.body.password;

    if (!filePath || !password) {
      return res.status(400).send("Missing file or password");
    }

    const decrypted = await decryptNSDL(filePath, password);
    const parsedData = await parseNSDL(decrypted);
    await updatePortfolio("mock-user-id", parsedData); // Replace with actual user ID logic

    fs.unlinkSync(filePath); // cleanup
    res.status(200).send("Portfolio updated successfully");
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).send("Failed to process NSDL statement");
  }
});

export default router;
