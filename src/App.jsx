import React, { useState, useCallback, useEffect } from 'react';
import { UploadSection } from './components/UploadSection';
import { PreviewSection } from './components/PreviewSection';
import { ResultSection } from './components/ResultSection';
import { ToastContainer } from './components/ToastContainer';
import { useFileHandler } from './utils/useFileHandler';
import { useDocxConverter } from './utils/useDocxConverter';
import './styles/App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('upload');
  const { currentFile, currentMarkdown, currentTokens, handleFile, clearFile } = useFileHandler();
  const { convertToDocx, outputBlob, isConverting, conversionError } = useDocxConverter();

  const handleConvert = useCallback(async () => {
    if (!currentFile || !currentMarkdown) return;

    try {
      await convertToDocx(currentMarkdown, currentTokens);
      setCurrentSection('result');
    } catch (error) {
      console.error('Conversion failed:', error);
    }
  }, [currentFile, currentMarkdown, currentTokens, convertToDocx]);

  const handleClear = useCallback(() => {
    clearFile();
    setCurrentSection('upload');
  }, [clearFile]);

  const handleAnother = useCallback(() => {
    clearFile();
    setCurrentSection('upload');
  }, [clearFile]);

  // Reset to upload section when file is cleared
  useEffect(() => {
    if (!currentFile && currentSection !== 'upload') {
      setCurrentSection('upload');
    }
  }, [currentFile, currentSection]);

  return (
    <div className="app">
      {/* Background effects */}
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <div className="main-container">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <div className="logo-icon">
              <i className="fa-solid fa-file-word" />
            </div>
            <h1 className="app-title">Markify</h1>
          </div>
          <p className="app-subtitle">Professional Markdown to Word Document Conversion</p>
        </header>

        {/* Main content sections */}
        {currentSection === 'upload' && (
          <UploadSection onFileSelect={handleFile} />
        )}

        {currentSection === 'preview' && currentFile && (
          <PreviewSection
            file={currentFile}
            markdown={currentMarkdown}
            tokens={currentTokens}
            onConvert={handleConvert}
            onClear={handleClear}
            isConverting={isConverting}
            error={conversionError}
          />
        )}

        {currentSection === 'result' && currentFile && outputBlob && (
          <ResultSection
            fileName={currentFile.name}
            fileSize={outputBlob.size}
            blob={outputBlob}
            onAnother={handleAnother}
          />
        )}
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
