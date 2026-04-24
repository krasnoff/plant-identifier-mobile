import express, { Request, Response } from "express";
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.get("/shem-pdf", async (request: Request, response: Response) => {
  try {
    const pdfPath = path.join(__dirname, '..', 'assets', 'shem.pdf');
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      return response.status(404).json({ error: 'PDF file not found.' });
    }

    // Set appropriate headers for PDF
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'inline; filename="shem.pdf"');
    
    // Create read stream and pipe to response
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(response);
    
    fileStream.on('error', (error) => {
      console.error('Error reading PDF file:', error);
      if (!response.headersSent) {
        return response.status(500).json({ error: 'Failed to read PDF file.' });
      }
    });
    
  } catch (error) {
    console.error('Error serving PDF:', error);
    return response.status(500).json({ error: 'Failed to serve PDF file.' });
  }
});

export default router;