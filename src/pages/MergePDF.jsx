import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, X, Download, Plus } from 'lucide-react';
import { mergePDFs } from '../utils/pdfLibUtils';
import './Tools.css';

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
    setFiles(prev => [...prev, ...selectedFiles]);
    setMergedPdfUrl(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await mergePDFs(files);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('Error merging PDFs. Please make sure the files are valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header merge">
        <h1>Merge PDF</h1>
        <p>Combine multiple PDF files into one single document in seconds.</p>
      </div>

      <div className="tool-card">
        {files.length === 0 ? (
          <div className="upload-area">
            <input
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileChange}
            />
            <div className="upload-content">
              <UploadIcon className="upload-icon" style={{ color: '#4f46e5' }} />
              <p className="upload-text">Click or drag PDF files here</p>
              <p className="upload-subtext">Select 2 or more PDFs to merge</p>
            </div>
          </div>
        ) : (
          <div className="tool-content">
            <div className="file-list-grid">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <FileText className="file-icon" style={{ color: '#4f46e5', flexShrink: 0 }} size={24} />
                    <span className="file-name">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)} className="remove-btn">
                    <X size={20} />
                  </button>
                </div>
              ))}
              <label className="add-more-btn">
                <input type="file" multiple accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }} />
                <Plus size={24} style={{ color: '#4f46e5', marginRight: '0.5rem' }} />
                <span className="add-more-text">Add more files</span>
              </label>
            </div>

            <div className="action-area">
              {!mergedPdfUrl ? (
                <button
                  onClick={handleMerge}
                  disabled={files.length < 2 || isProcessing}
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
                  ) : 'Merge PDFs'}
                </button>
              ) : (
                <div className="action-area">
                  <p className="success-message">
                    Successfully merged! Your file is ready.
                  </p>
                  <a
                    href={mergedPdfUrl}
                    download="merged_document.pdf"
                    className="primary-btn"
                  >
                    <Download size={20} style={{ marginRight: '0.5rem' }} />
                    Download Merged PDF
                  </a>
                  <button
                    onClick={() => {
                      setFiles([]);
                      setMergedPdfUrl(null);
                    }}
                    className="text-link"
                    style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Start over
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MergePDF;
