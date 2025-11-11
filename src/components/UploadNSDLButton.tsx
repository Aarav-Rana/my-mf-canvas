import React, { useState } from "react";

const UploadNSDLButton: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatusMessage(null);

    const password = prompt("Enter the password for your NSDL statement:");
    if (!password) {
      alert("⚠️ A password is required to decrypt your statement.");
      return;
    }

    const formData = new FormData();
    formData.append("statementFile", file);
    formData.append("password", password);

    try {
      setIsUploading(true);
      setStatusMessage("Uploading and processing your statement...");

      const response = await fetch("/api/upload-nsdl", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Unknown error occurred");
      }

      setStatusMessage("✅ NSDL Statement processed successfully!");
      alert("✅ Portfolio updated successfully!");
      window.location.reload();
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatusMessage("❌ Failed to process file. Please try again.");
      alert("❌ Failed to process NSDL statement: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center space-y-3 border border-gray-700 rounded-xl shadow-md bg-gray-900/50 backdrop-blur-sm">
      <label
        htmlFor="nsdl-upload"
        className={`${
          isUploading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
        } text-white font-semibold py-2 px-5 rounded-lg transition`}
      >
        {isUploading ? "Uploading..." : "Upload NSDL Statement"}
      </label>

      <input
        id="nsdl-upload"
        type="file"
        accept=".pdf,.csv"
        className="hidden"
        onChange={handleFileUpload}
      />

      {fileName && (
        <p className="text-sm text-gray-400">
          Selected file: <span className="text-white font-medium">{fileName}</span>
        </p>
      )}

      {statusMessage && (
        <p
          className={`text-sm ${
            statusMessage.startsWith("✅")
              ? "text-green-400"
              : statusMessage.startsWith("❌")
              ? "text-red-400"
              : "text-blue-400"
          }`}
        >
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default UploadNSDLButton;
