import { PDFDocument } from 'pdf-lib';
import { default as Zga } from 'zgapdfsigner';

/**
 * Protects a PDF file with a password.
 * @param {File} file - The PDF File object.
 * @param {string} password - The password to set.
 * @returns {Promise<Uint8Array>} - The protected PDF bytes.
 */
export const protectPDF = async (file, password) => {
  const arrayBuffer = await file.arrayBuffer();
  
  const eopt = {
    mode: Zga.Crypto.Mode.AES_256,
    userpwd: password,
    ownerpwd: password, // Using the same password for owner for simplicity
    permissions: [] // Restrict everything by default
  };
  
  const cryptor = new Zga.PdfCryptor(eopt);
  const pdfDoc = await cryptor.encryptPdf(arrayBuffer);
  
  // Save without object streams as required by some viewers for protected PDFs
  return await pdfDoc.save({ useObjectStreams: false });
};

/**
 * Merges multiple PDF files into a single PDF.
 * @param {File[]} files - Array of PDF File objects.
 * @returns {Promise<Uint8Array>} - The merged PDF bytes.
 */
export const mergePDFs = async (files) => {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
};

/**
 * Deletes specified pages from a PDF.
 * @param {File} file - The PDF File object.
 * @param {number[]} pageIndices - 0-indexed indices of pages to delete.
 * @param {number} totalPages - Total number of pages in the PDF.
 * @returns {Promise<Uint8Array>} - The edited PDF bytes.
 */
export const deletePagesFromPDF = async (file, pageIndices, totalPages) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  const newPdfDoc = await PDFDocument.create();
  const allIndices = Array.from({ length: totalPages }, (_, i) => i);
  const indicesToKeep = allIndices.filter(i => !pageIndices.includes(i));
  
  const copiedPages = await newPdfDoc.copyPages(pdfDoc, indicesToKeep);
  copiedPages.forEach(page => newPdfDoc.addPage(page));

  return await newPdfDoc.save();
};

/**
 * Converts images to a single PDF.
 * @param {File[]} files - Array of image File objects (JPG/PNG).
 * @returns {Promise<Uint8Array>} - The generated PDF bytes.
 */
export const imagesToPDF = async (files) => {
  const pdfDoc = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let image;
    
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      continue;
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return await pdfDoc.save();
};

/**
 * Sets metadata on a PDF.
 * @param {File} file - The PDF File object.
 * @param {Object} metadata - Metadata to set.
 * @returns {Promise<Uint8Array>} - The edited PDF bytes.
 */
export const setPDFMetadata = async (file, metadata) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  if (metadata.producer) pdfDoc.setProducer(metadata.producer);
  if (metadata.subject) pdfDoc.setSubject(metadata.subject);
  if (metadata.title) pdfDoc.setTitle(metadata.title);
  if (metadata.author) pdfDoc.setAuthor(metadata.author);
  
  return await pdfDoc.save();
};

/**
 * Parses page ranges (e.g., "1, 3, 5-7") into an array of 0-indexed page indices.
 * @param {string} input - The range string.
 * @param {number} maxPages - The maximum number of pages in the document.
 * @returns {number[]} - Array of 0-indexed page indices.
 */
export const parsePageRanges = (input, maxPages) => {
  const pages = new Set();
  const parts = input.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(p => parseInt(p.trim()));
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
          pages.add(i - 1); // 0-indexed
        }
      }
    } else {
      const page = parseInt(part);
      if (!isNaN(page) && page >= 1 && page <= maxPages) {
        pages.add(page - 1); // 0-indexed
      }
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
};
