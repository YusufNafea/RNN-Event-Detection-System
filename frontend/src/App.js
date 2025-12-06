import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Results from './components/Results';
import api from './services/api';

function App() {
  const [modelInfo, setModelInfo] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    checkApiConnection();
    fetchModelInfo();
    
    // Hide welcome animation after 3 seconds
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const checkApiConnection = async () => {
    try {
      const response = await api.checkHealth();
      if (response.status === 'healthy') {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    } catch (err) {
      setApiStatus('disconnected');
      setError('Cannot connect to backend server. Please ensure Flask is running on port 5000.');
    }
  };

  const fetchModelInfo = async () => {
    try {
      const info = await api.getModelInfo();
      setModelInfo(info);
    } catch (err) {
      console.error('Error fetching model info:', err);
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError(null);
    setPredictions(null);

    try {
      const result = await api.uploadFile(file);
      setPredictions(result);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error processing file');
      setLoading(false);
    }
  };

  const clearResults = () => {
    setPredictions(null);
    setError(null);
  };

  return (
    <div className="app-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      {/* Welcome Splash Screen */}
      {showWelcome && (
        <div className="welcome-splash">
          <div className="welcome-content">
            <div className="logo-animation">
              <svg className="logo-icon" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="url(#gradient1)" strokeWidth="3" />
                <circle cx="50" cy="50" r="35" stroke="url(#gradient2)" strokeWidth="2" />
                <path d="M50 20 L50 80 M30 50 L70 50" stroke="url(#gradient3)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f093fb" />
                    <stop offset="100%" stopColor="#f5576c" />
                  </linearGradient>
                  <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4facfe" />
                    <stop offset="100%" stopColor="#00f2fe" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="welcome-title">RNN Event Detection</h1>
            <p className="welcome-subtitle">AI-Powered Vehicle Collision Prediction</p>
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo-badge">
              <div className="logo-inner">
                <svg className="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="header-text">
              <h1 className="header-title">
                <span className="gradient-text">RNN Event Detection</span>
              </h1>
              <p className="header-subtitle">LSTM-based Vehicle Collision Prediction System</p>
            </div>
          </div>
          
          {/* Animated Status Badge */}
          <div className="status-container">
            <div className={`status-badge status-${apiStatus}`}>
              <div className="status-pulse"></div>
              <div className="status-dot"></div>
              <span className="status-text">
                {apiStatus === 'connected' ? '● Connected' : 
                 apiStatus === 'checking' ? '○ Checking...' : 
                 '✕ Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-wrapper">
          
          {/* Error Alert with Animation */}
          {error && (
            <div className="alert alert-error fade-in">
              <div className="alert-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="alert-content">
                <h3 className="alert-title">Error Occurred</h3>
                <p className="alert-message">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="alert-close">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* Success Alert when Connected */}
          {apiStatus === 'connected' && !error && !predictions && (
            <div className="alert alert-success fade-in">
              <div className="alert-icon">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="alert-content">
                <h3 className="alert-title">System Ready</h3>
                <p className="alert-message">Backend connected. Model loaded. Upload a CSV file to begin analysis.</p>
              </div>
            </div>
          )}

          {/* Dashboard */}
          {modelInfo && (
            <div className="dashboard-section slide-up">
              <Dashboard modelInfo={modelInfo} />
            </div>
          )}

          {/* File Upload */}
          <div className="upload-section slide-up" style={{animationDelay: '0.2s'}}>
            <FileUpload 
              onFileUpload={handleFileUpload}
              loading={loading}
              disabled={apiStatus !== 'connected'}
            />
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="loading-container fade-in">
              <div className="loading-card">
                <div className="loading-spinner">
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-ring"></div>
                  <div className="spinner-inner">
                    <svg className="spinner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="loading-title">Analyzing Your Data</h3>
                <p className="loading-text">Our AI is processing vehicle trajectories...</p>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {predictions && !loading && (
            <div className="results-section slide-up">
              <Results 
                predictions={predictions}
                onClear={clearResults}
              />
            </div>
          )}

          {/* Empty State */}
          {!predictions && !loading && !error && apiStatus === 'connected' && (
            <div className="empty-state fade-in">
              <div className="empty-state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="empty-state-title">Ready to Analyze</h3>
              <p className="empty-state-text">
                Upload a CSV file containing vehicle trajectory data to predict potential collisions
              </p>
              <div className="empty-state-features">
                <div className="feature-item">
                  <span className="feature-icon">⚡</span>
                  <span>Fast Processing</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🎯</span>
                  <span>High Accuracy</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Visual Results</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p className="footer-text">
              RNN Event Detection System <span className="version-badge"></span>
            </p>
            <p className="footer-subtext">Powered by PyTorch LSTM & React</p>
          </div>
          <div className="footer-right">
            <div className="tech-stack">
              <span className="tech-badge">PyTorch</span>
              <span className="tech-badge">Flask</span>
              <span className="tech-badge">React</span>
              <span className="tech-badge">TailwindCSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;