import express, { Request, Response } from "express";
import PDFDocument from "pdfkit";

const router = express.Router();

router.post("/getPDF", async (request: Request, response: Response) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument();
    
    // Set response headers for PDF
    response.header('Content-Type', 'application/pdf');
    response.header('Content-Disposition', 'attachment; filename="plant-guide.pdf"');
    
    // Pipe the PDF into the response
    doc.pipe(response);
    
    // Add header content
    doc.fontSize(20).text('Plant Identification Guide', 100, 100);
    doc.fontSize(12).text('Generated on: ' + new Date().toLocaleDateString(), 100, 130);
    
    let currentY = 160; // Track current Y position for content
    
    // Embed image if provided
    if (request.body && request.body.imageBase64) {
      try {
        // Remove data URL prefix if present (data:image/jpeg;base64, etc.)
        const base64Data = request.body.imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        // Add the image to the PDF
        doc.fontSize(14).text('Plant Image:', 100, currentY);
        currentY += 25;
        
        doc.image(imageBuffer, 100, currentY, { 
          fit: [400, 300],  // Fit within 400x300 pixels
          align: 'center',
          valign: 'center'
        });
        
        currentY += 320; // Move below the image (300px height + 20px margin)
        
      } catch (imageError) {
        console.error('Error processing image:', imageError);
        doc.text('Error: Could not process the provided image', 100, currentY);
        currentY += 30;
      }
    }
    
    // Add result text below the image
    if (request.body && request.body.result) {
      try {
        // Parse the result if it's JSON, otherwise use as-is
        let resultText = '';
        if (typeof request.body.result === 'string') {
          try {
            const parsedResult = JSON.parse(request.body.result);
            resultText = parsedResult.response || request.body.result;
          } catch {
            resultText = request.body.result;
          }
        } else {
          resultText = request.body.result.response || JSON.stringify(request.body.result);
        }
        
        // Add result content
        doc.fontSize(14).text('Plant Information:', 100, currentY);
        currentY += 25;
        
        // Split text into manageable chunks and handle line wrapping
        doc.fontSize(11);
        const lines = resultText.split('\n');
        
        for (const line of lines) {
          // Check if we need a new page
          if (currentY > 700) {
            doc.addPage();
            currentY = 50;
          }
          
          if (line.trim()) {
            doc.text(line, 100, currentY, {
              width: 400,
              align: 'left'
            });
            currentY += doc.heightOfString(line, { width: 400 }) + 5;
          } else {
            currentY += 15; // Add space for empty lines
          }
        }
        
      } catch (resultError) {
        console.error('Error processing result:', resultError);
        doc.fontSize(12).text('Error: Could not process the result data', 100, currentY);
      }
    }
    
    // Finalize the PDF
    doc.end();
    
  } catch (error) {
    console.error('Error serving PDF:', error);
    return response.status(500).json({ error: 'Failed to serve PDF file.' });
  }
});

export default router;