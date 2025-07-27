import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setWordCount(newText.trim().split(/\s+/).filter(word => word.length > 0).length);
  };

  const showNotification = (message, type = 'error') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `notification notification-${type}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
      if (document.body.contains(alertDiv)) {
        document.body.removeChild(alertDiv);
      }
    }, 3000);
  };

  const handleSummarize = async () => {
    if (!text.trim()) {
      showNotification('Please paste blog content first!');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const res = await axios.post('https://blog-summarizer-api.onrender.com/api/summarize', { text });
      if (res.data && res.data.summary) {
        setSummary(res.data.summary);
      } else {
        console.warn('Unexpected response format:', res.data);
        showNotification('Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      showNotification('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      showNotification('Summary copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text');
      showNotification('Failed to copy text');
    }
  };

  return (
    <div className="app-container">
      {/* Animated background elements */}
      <div className="background-overlay">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <h1 className="main-title">QuickBlog AI</h1>
          <p className="subtitle">
            Transform lengthy blog posts into concise, engaging summaries with the power of AI
          </p>
        </div>

        {/* Main card */}
        <div className="card-container">
          <div className="main-card">
            {/* Input section */}
            <div className="input-section">
              <div className="section-header">
                <div className="section-title-container">
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                  <label className="section-title">Blog Content</label>
                </div>
                <span className="word-count">{wordCount} words</span>
              </div>
              
              <div className="textarea-container">
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Paste your blog content here and watch the magic happen..."
                  className="main-textarea"
                />
                {text && (
                  <div className="textarea-badge">
                    <div className="ready-badge">Ready to summarize</div>
                  </div>
                )}
              </div>
            </div>

            {/* Action button */}
            <div className="button-container">
              <button
                onClick={handleSummarize}
                disabled={loading || !text.trim()}
                className={`summarize-button ${loading ? 'loading' : ''} ${!text.trim() ? 'disabled' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Analyzing Content...</span>
                  </>
                ) : (
                  <>
                    <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <span>Generate Summary</span>
                    <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Output section */}
            {summary && (
              <div className="output-section">
                <div className="output-header">
                  <div className="output-title-container">
                    <svg className="sparkles-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/>
                    </svg>
                    <h3 className="output-title">AI Summary</h3>
                  </div>
                  <button onClick={handleCopy} className="copy-button">
                    {copied ? (
                      <>
                        <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <span className="copied-text">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="summary-content">
                  <p className="summary-text">{summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          <p className="footer-text">
            Built with MERN Stack + AI ✨ | Powered by cutting-edge technology
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;