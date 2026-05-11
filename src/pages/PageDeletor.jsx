import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload as UploadIcon, FileText, Trash2, Download, AlertCircle } from 'lucide-react';
import { deletePagesFromPDF, parsePageRanges } from '../utils/pdfLibUtils';
import './Tools.css';

const PageDeletor = () => {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pagesToDelete, setPagesToDelete] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPdfUrl(null);
      setError('');
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdfDoc.getPageCount());
      } catch (err) {
        setError('Error reading PDF. Please ensure it is a valid PDF file.');
      }
    }
  };

  const handleDeletePages = async () => {
    if (!file || !pagesToDelete) return;
    setIsProcessing(true);
    setError('');
    try {
      const indicesToDelete = parsePageRanges(pagesToDelete, totalPages);
      
      if (indicesToDelete.length === 0) {
        setError('Please specify valid pages or ranges to delete.');
        setIsProcessing(false);
        return;
      }

      if (indicesToDelete.length >= totalPages) {
        setError('You cannot delete all pages from the PDF.');
        setIsProcessing(false);
        return;
      }

      const pdfBytes = await deletePagesFromPDF(file, indicesToDelete, totalPages);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Error deleting pages:', err);
      setError('An error occurred while processing the PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header deletor">
        <h1>Page Deletor</h1>
        <p>Remove unnecessary pages from your document with ease.</p>
      </div>

      <div className="tool-card">
        {!file ? (
          <div className="upload-area">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <div className="upload-content">
              <UploadIcon className="upload-icon" style={{ color: '#4f46e5' }} />
              <p className="upload-text">Click or drag a PDF file here</p>
              <p className="upload-subtext">Select the file you want to edit</p>
            </div>
          </div>
        ) : (
          <div className="tool-content">
            <div className="file-item" style={{ marginBottom: '1.5rem', backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' }}>
              <div className="file-info">
                <FileText className="file-icon" style={{ color: '#4f46e5' }} size={32} />
                <div>
                  <p className="file-name" style={{ fontWeight: 'bold' }}>{file.name}</p>
                  <p className="upload-subtext" style={{ fontSize: '0.875rem' }}>{totalPages} pages total</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPdfUrl(null);
                  setPagesToDelete('');
                }}
                className="text-link"
                style={{ fontSize: '0.875rem', color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Change file
              </button>
            </div>

            {!pdfUrl ? (
              <div className="form-content">
                <div className="form-group">
                  <label htmlFor="pages" className="form-label">
                    Pages to delete (e.g., 1, 3, 5-7)
                  </label>
                  <input
                    type="text"
                    id="pages"
                    placeholder="e.g. 1, 3, 5-10"
                    value={pagesToDelete}
                    onChange={(e) => setPagesToDelete(e.target.value)}
                    className="form-input"
                    style={{ border: '1px solid #e5e7eb' }}
                  />
                </div>

                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} style={{ marginRight: '0.5rem' }} />
                    {error}
                  </div>
                )}

                <div className="action-area">
                  <button
                    onClick={handleDeletePages}
                    disabled={!pagesToDelete || isProcessing}
                    className="primary-btn"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="spinner" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Trash2 size={20} style={{ marginRight: '0.5rem' }} />
                        Delete Pages
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="action-area">
                <p className="success-message">
                  Pages removed successfully!
                </p>
                <a
                  href={pdfUrl}
                  download={`edited_${file.name}`}
                  className="primary-btn success-btn"
                >
                  <Download size={20} style={{ marginRight: '0.5rem' }} />
                  Download Edited PDF
                </a>
                <button
                  onClick={() => {
                    setFile(null);
                    setPdfUrl(null);
                    setPagesToDelete('');
                  }}
                  className="text-link"
                  style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Start over
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageDeletor;
