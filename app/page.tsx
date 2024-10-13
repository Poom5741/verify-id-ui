"use client";
import { useState } from "react";
import { createWorker } from "tesseract.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [file, setFile] = useState<File | null>(null); // To hold the uploaded file
  const [status, setStatus] = useState("Not Verified"); // To display the verification status
  const [extractedText, setExtractedText] = useState({
    eng: "",
    tha: "",
  }); // To hold OCR results for both languages

  // Handle file upload change event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]); // Get the selected file
    }
  };

  // Function to handle document verification using two Tesseract.js workers (English and Thai)
  const handleVerify = async () => {
    if (!file) {
      alert("Please upload a document first.");
      return;
    }

    // Set status to show that OCR is in progress
    setStatus("Performing OCR in English and Thai...");

    try {
      // Initialize two workers for both languages
      const workerEng = await createWorker("eng"); // English OCR worker
      const workerTha = await createWorker("tha"); // Thai OCR worker

      // Load and initialize both languages

      // Perform OCR in parallel for both languages
      const [engResult, thaResult] = await Promise.all([
        workerEng.recognize(file), // OCR in English
        workerTha.recognize(file), // OCR in Thai
      ]);

      // Terminate both workers after OCR is complete
      await workerEng.terminate();
      await workerTha.terminate();

      // Update the extracted text with both results
      setExtractedText({
        eng: engResult.data.text,
        tha: thaResult.data.text,
      });

      setStatus("Document Verified in both languages!");
    } catch (error) {
      console.error("Error during OCR:", error);
      setStatus("OCR failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Card className="p-6 w-full max-w-md shadow-lg rounded-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Upload Your Document
        </h1>

        <Label htmlFor="document-upload" className="block mb-2">
          Choose a document
        </Label>
        <Input
          id="document-upload"
          type="file"
          onChange={handleFileChange}
          className="mb-4"
        />

        <Button onClick={handleVerify} variant="default" className="w-full">
          Verify Document
        </Button>

        <p className="mt-4 text-lg text-center">{status}</p>

        {extractedText.eng && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Extracted Text (English):</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {extractedText.eng}
            </p>
          </div>
        )}

        {extractedText.tha && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Extracted Text (Thai):</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {extractedText.tha}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
