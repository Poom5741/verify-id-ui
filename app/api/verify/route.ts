import { NextResponse } from "next/server";
import { createWorker } from "tesseract.js";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Handle POST request for document verification
export async function POST(request: Request) {
  // Extract the form data containing the uploaded file
  const formData = await request.formData();
  const file = formData.get("document") as File;

  if (!file) {
    return NextResponse.json({ success: false, message: "No file uploaded" });
  }

  try {
    // Save the uploaded file temporarily in the /tmp directory
    const tempFileName = path.join("/tmp", `${uuidv4()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());

    // Write the file to disk temporarily
    await fs.writeFile(tempFileName, buffer);

    // Create and initialize a Tesseract worker for OCR
    const worker = await createWorker("eng");

    // Perform OCR on the temporary file
    const {
      data: { text },
    } = await worker.recognize(tempFileName);

    // Terminate the worker after OCR is complete
    await worker.terminate();

    // Delete the temporary file after OCR is finished
    await fs.unlink(tempFileName);

    // Return the extracted text as the API response
    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("Error during OCR processing:", error);
    return NextResponse.json({
      success: false,
      message: "OCR failed. Unable to verify document.",
    });
  }
}
