import React, { useState, useRef } from 'react';

function FileUpload({ onFileUpload, loading, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    if (file.size > 16 * 1024 * 1024) {
      alert('File size must be less than 16MB');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="upload-card">
      <div className="upload-header">
        <div className="upload-icon-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <h2 className="upload-title">Upload Vehicle Data</h2>
          <p className="upload-subtitle">Drag and drop or click to select your CSV file</p>
        </div>
      </div>
      
      <div
        className={`upload-zone ${dragActive ? 'upload-zone-active' : ''} ${disabled ? 'upload-zone-disabled' : ''} ${selectedFile ? 'upload-zone-success' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled && !selectedFile ? handleButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleChange}
          disabled={disabled}
          style={{display: 'none'}}
        />

        {!selectedFile ? (
          <div className="upload-zone-content">
            <div className="upload-zone-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            <div className="upload-zone-text">
              <p className="upload-zone-main-text">
                <span className="upload-zone-link">Click to upload</span>
                {' '}or drag and drop
              </p>
              <p className="upload-zone-sub-text">CSV file up to 16MB</p>
            </div>

            <div className="upload-zone-pulse"></div>
          </div>
        ) : (
          <div className="file-selected">
            <div className="file-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="file-info">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">{(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="file-remove"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="upload-info-box">
        <div className="upload-info-header">
          <svg className="upload-info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h4 className="upload-info-title">CSV Format Requirements</h4>
        </div>
        <ul className="upload-info-list">
          <li>
            <span className="upload-info-bullet">✓</span>
            Required columns: timestamp, vehicle_id, position_x, position_y, velocity_x, velocity_y
          </li>
          <li>
            <span className="upload-info-bullet">✓</span>
            Each vehicle should have exactly 20 timesteps (0-19)
          </li>
          <li>
            <span className="upload-info-bullet">✓</span>
            Example: vehicle_id=1 with timestamps 0-19
          </li>
        </ul>
      </div>

      <div className="upload-actions">
        <button
          onClick={handleSubmit}
          disabled={!selectedFile || loading || disabled}
          className={`btn-primary ${(!selectedFile || loading || disabled) ? 'btn-disabled' : ''}`}
        >
          {loading ? (
            <>
              <svg className="btn-spinner" viewBox="0 0 24 24">
                <circle className="spinner-circle" cx="12" cy="12" r="10" fill="none" strokeWidth="3"></circle>
                <path className="spinner-path" fill="none" strokeWidth="3" strokeLinecap="round" d="M12 2 A10 10 0 0 1 22 12"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analyze Data
            </>
          )}
        </button>
        
        {selectedFile && (
          <button
            onClick={clearFile}
            disabled={loading}
            className="btn-secondary"
          >
            <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        )}
      </div>

      <div className="upload-sample">
        <button
          className="sample-download-btn"
          onClick={() => {
            const sampleData = `timestamp,vehicle_id,position_x,position_y,velocity_x,velocity_y
0,1,10.5,20.3,1.2,0.8
1,1,11.7,21.1,1.2,0.8
2,1,12.9,21.9,1.2,0.8
3,1,14.1,22.7,1.2,0.8
4,1,15.3,23.5,1.2,0.8
5,1,16.5,24.3,1.2,0.8
6,1,17.7,25.1,1.2,0.8
7,1,18.9,25.9,1.2,0.8
8,1,20.1,26.7,1.2,0.8
9,1,21.3,27.5,1.2,0.8
10,1,22.5,28.3,1.2,0.8
11,1,23.7,29.1,1.2,0.8
12,1,24.9,29.9,1.2,0.8
13,1,26.1,30.7,1.2,0.8
14,1,27.3,31.5,1.2,0.8
15,1,28.5,32.3,1.2,0.8
16,1,29.7,33.1,1.2,0.8
17,1,30.9,33.9,1.2,0.8
18,1,32.1,34.7,1.2,0.8
19,1,33.3,35.5,1.2,0.8`;
            
            const blob = new Blob([sampleData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sample_vehicle_data.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }}
        >
          <svg className="sample-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Sample CSV
        </button>
      </div>

      <style jsx>{`
        .upload-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }

        .upload-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .upload-icon-badge {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .upload-icon-badge svg {
          width: 32px;
          height: 32px;
          stroke: white;
          stroke-width: 2;
        }

        .upload-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .upload-subtitle {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .upload-zone {
          position: relative;
          border: 3px dashed #e5e7eb;
          border-radius: 20px;
          padding: 4rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%);
          overflow: hidden;
        }

        .upload-zone:hover:not(.upload-zone-disabled) {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
          transform: scale(1.01);
        }

        .upload-zone-active {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          transform: scale(1.02);
        }

        .upload-zone-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .upload-zone-success {
          border-color: #10b981;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
        }

        .upload-zone-content {
          position: relative;
          z-index: 1;
        }

        .upload-zone-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 3s ease-in-out infinite;
        }

        .upload-zone-icon svg {
          width: 40px;
          height: 40px;
          stroke: #667eea;
          stroke-width: 1.5;
        }

        .upload-zone-main-text {
          font-size: 1.125rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .upload-zone-link {
          color: #667eea;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .upload-zone-sub-text {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .upload-zone-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse-ring 2s infinite;
        }

        .file-selected {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          animation: slideIn 0.3s ease-out;
        }

        .file-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .file-icon svg {
          width: 28px;
          height: 28px;
          stroke: white;
        }

        .file-info {
          flex: 1;
          text-align: left;
        }

        .file-name {
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
          word-break: break-word;
        }

        .file-size {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .file-remove {
          width: 40px;
          height: 40px;
          background: rgba(239, 68, 68, 0.1);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .file-remove:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: rotate(90deg);
        }

        .file-remove svg {
          width: 20px;
          height: 20px;
          stroke: #ef4444;
        }

        .upload-info-box {
          margin: 2rem 0;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%);
          border-radius: 16px;
          border: 2px solid rgba(59, 130, 246, 0.2);
        }

        .upload-info-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .upload-info-icon {
          width: 24px;
          height: 24px;
          stroke: #3b82f6;
          flex-shrink: 0;
        }

        .upload-info-title {
          font-weight: 700;
          color: #1e40af;
          font-size: 1rem;
          margin: 0;
        }

        .upload-info-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .upload-info-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          color: #1e40af;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        .upload-info-list li:last-child {
          margin-bottom: 0;
        }

        .upload-info-bullet {
          color: #10b981;
          font-weight: 700;
          flex-shrink: 0;
        }

        .upload-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .btn-primary {
          flex: 1;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover:not(.btn-disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:active:not(.btn-disabled) {
          transform: translateY(0);
        }

        .btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .btn-secondary {
          padding: 1rem 1.5rem;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 2px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          transform: translateY(-2px);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          width: 20px;
          height: 20px;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        .spinner-circle {
          stroke: rgba(255, 255, 255, 0.3);
        }

        .spinner-path {
          stroke: white;
        }

        .upload-sample {
          text-align: center;
        }

        .sample-download-btn {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          transition: all 0.3s;
        }

        .sample-download-btn:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .sample-icon {
          width: 18px;
          height: 18px;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default FileUpload;