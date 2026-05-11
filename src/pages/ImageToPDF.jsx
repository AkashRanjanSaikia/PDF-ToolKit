import React, { useState } from 'react';
import { Upload as UploadIcon, Image as ImageIcon, X, Download, Plus } from 'lucide-react';
import { imagesToPDF } from '../utils/pdfLibUtils';
import './Tools.css';

const ImageToPDF = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => 
      file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...selectedFiles]);
    setPdfUrl(null);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPdfUrl(null);
  };

  const handleConvertToPDF = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await imagesToPDF(files);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error converting images:', error);
      alert('Error converting images to PDF. Please ensure you are using JPG or PNG files.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header image">
        <h1>Image to PDF</h1>
        <p>Convert JPG and PNG images into high-quality PDF files.</p>
      </div>

      <div className="tool-card">
        {files.length === 0 ? (
          <div className="upload-area">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
            <div className="upload-content">
              <UploadIcon className="upload-icon" style={{ color: '#4f46e5' }} />
              <p className="upload-text">Click or drag images here</p>
              <p className="upload-subtext">Supports JPG and PNG</p>
            </div>
          </div>
        ) : (
          <div className="tool-content">
            <div className="image-grid image-grid-md">
              {files.map((file, index) => (
                <div key={index} className="image-item">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="image-preview"
                  />
                  <div className="image-overlay">
                    <button
                      onClick={() => removeFile(index)}
                      className="remove-btn"
                      style={{ backgroundColor: '#ef4444', color: 'white', padding: '0.5rem' }}
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
              <label className="add-more-btn" style={{ aspectRatio: '1/1' }}>
                <input type="file" multiple accept="image/jpeg,image/png" onChange={handleFileChange} style={{ display: 'none' }} />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Plus size={24} style={{ color: '#4f46e5' }} />
                  <span className="add-more-text" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Add more</span>
                </div>
              </label>
            </div>

            <div className="action-area">
              {!pdfUrl ? (
                <button
                  onClick={handleConvertToPDF}
                  disabled={files.length === 0 || isProcessing}
                  className="primary-btn"
                >
                  {isProcessing ? (
                    <>
                      <svg className="spinner" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Converting...
                    </>
                  ) : 'Convert to PDF'}
                </button>
              ) : (
                <div className="action-area">
                  <p className="success-message">
                    Conversion complete!
                  </p>
                  <a
                    href={pdfUrl}
                    download="images_to_pdf.pdf"
                    className="primary-btn"
                  >
                    <Download size={20} style={{ marginRight: '0.5rem' }} />
                    Download PDF
                  </a>
                  <button
                    onClick={() => {
                      setFiles([]);
                      setPdfUrl(null);
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

export default ImageToPDF;
