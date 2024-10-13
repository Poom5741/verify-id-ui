"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/navbar";
import { Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("idle");
  const [extractedText, setExtractedText] = useState({
    eng: "",
    tha: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus("ready");
    }
  };

  const handleVerify = async () => {
    if (!file) {
      alert("Please upload a document first.");
      return;
    }

    setStatus("processing");

    try {
      const workerEng = await createWorker("eng");
      const workerTha = await createWorker("tha");

      const [engResult, thaResult] = await Promise.all([
        workerEng.recognize(file),
        workerTha.recognize(file),
      ]);

      await workerEng.terminate();
      await workerTha.terminate();

      setExtractedText({
        eng: engResult.data.text,
        tha: thaResult.data.text,
      });

      setStatus("verified");
    } catch (error) {
      console.error("Error during OCR:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center flex-grow p-6">
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <CardHeader className="text-center mb-4">
            <CardTitle className="text-2xl font-bold">
              Document Verifier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="document-upload"
                className="text-sm font-medium text-gray-600"
              >
                Choose a document
              </Label>
              <div className="relative">
                <Input
                  id="document-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <Label
                  htmlFor="document-upload"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed rounded-md border-gray-300 hover:border-gray-400 cursor-pointer transition-colors"
                >
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-500" />
                    <div className="flex text-sm text-gray-600">
                      <span className="relative font-medium text-blue-600 hover:underline focus-within:outline-none">
                        Upload a file
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </Label>
              </div>
            </div>
            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={status === "processing"}
            >
              {status === "processing" ? "Verifying..." : "Verify Document"}
            </Button>
            <div className="text-center">
              {status === "idle" && (
                <p className="text-gray-500">Upload a document to begin</p>
              )}
              {status === "ready" && (
                <p className="text-blue-600 flex items-center justify-center">
                  <FileText className="mr-2" />
                  Document ready for verification
                </p>
              )}
              {status === "processing" && (
                <p className="text-yellow-600 flex items-center justify-center">
                  <Loader2 className="mr-2 animate-spin" />
                  Performing OCR in English and Thai...
                </p>
              )}
              {status === "verified" && (
                <p className="text-green-600 flex items-center justify-center">
                  <CheckCircle className="mr-2" />
                  Document Verified in both languages!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-600 flex items-center justify-center">
                  <XCircle className="mr-2" />
                  OCR failed. Please try again.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        {(extractedText.eng || extractedText.tha) && (
          <Card className="w-full max-w-lg mt-4 p-6 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-semibold">
                Extracted Text
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {extractedText.eng && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700">
                    English:
                  </h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap mt-2 p-2 bg-gray-100 rounded-md">
                    {extractedText.eng}
                  </p>
                </div>
              )}
              {extractedText.tha && (
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Thai:</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap mt-2 p-2 bg-gray-100 rounded-md">
                    {extractedText.tha}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
