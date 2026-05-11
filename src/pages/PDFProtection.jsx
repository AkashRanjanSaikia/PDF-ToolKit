import { useState } from 'react';
import { Upload as UploadIcon, FileText, ShieldAlert, Download, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';
import { protectPDF } from '../utils/pdfLibUtils';
import './Tools.css';

const PDFProtection = () => {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setPdfUrl(null);
      setError('');
    }
  };

  const handleProtectPDF = async () => {
    if (!file || !password) return;
    setIsProcessing(true);
    setError('');
    
    try {
      const pdfBytes = await protectPDF(file, password);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      
      // Keep a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPdfUrl(url);
    } catch (err) {
      console.error('Error protecting PDF:', err);
      setError('An error occurred while protecting the PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-container">
      <div className="tool-header protection">
        <h1>PDF Protection</h1>
        <p>Secure your sensitive files with encrypted passwords.</p>
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
              <p className="upload-subtext">Select the file you want to protect</p>
            </div>
          </div>
        ) : (
          <div className="tool-content">
            <div className="file-item" style={{ marginBottom: '1.5rem', backgroundColor: '#f5f3ff', borderColor: '#ddd6fe' }}>
              <div className="file-info">
                <FileText className="file-icon" style={{ color: '#4f46e5' }} size={32} />
                <div>
                  <p className="file-name" style={{ fontWeight: 'bold' }}>{file.name}</p>
                  <p className="upload-subtext" style={{ fontSize: '0.875rem' }}>Ready to protect</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPdfUrl(null);
                  setPassword('');
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
                  <label htmlFor="password" className="form-label">
                    Set a password for your PDF
                  </label>
                  <div className="input-with-icon">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="input-icon-btn"
                      style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="info-box info-box-blue">
                  <Lock size={20} style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.875rem' }}>
                    Your password will be used to encrypt the document. Make sure to remember it, as it cannot be recovered.
                  </p>
                </div>

                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} style={{ marginRight: '0.5rem' }} />
                    {error}
                  </div>
                )}

            <div className="action-area">
              <button
                onClick={handleProtectPDF}
                disabled={!password || isProcessing}
                className="primary-btn"
              >
                {isProcessing ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Protecting...
                  </>
                ) : (
                  <>
                    <ShieldAlert size={20} style={{ marginRight: '0.5rem' }} />
                    Protect PDF
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
              <div className="action-area">
                <p className="success-message" style={{ textAlign: 'center' }}>
                  Success! Your PDF is now protected with the password.
                </p>
                <a
                  href={pdfUrl}
                  download={`protected_${file.name}`}
                  className="primary-btn success-btn"
                >
                  <Download size={20} style={{ marginRight: '0.5rem' }} />
                  Download Protected PDF
                </a>
                <button
                  onClick={() => {
                    setFile(null);
                    setPdfUrl(null);
                    setPassword('');
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

export default PDFProtection;
