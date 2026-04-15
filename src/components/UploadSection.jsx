import React, { useCallback, useState } from 'react';
import './UploadSection.css';

export function UploadSection({ onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
    e.target.value = '';
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    document.getElementById('file-input').click();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('file-input').click();
    }
  }, []);

  return (
    <section className="upload-section">
      <div
        className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex="0"
        aria-label="Upload a Markdown file"
      >
        <div className="drop-icon">
          <i className="fa-solid fa-cloud-arrow-up" />
        </div>
        <p className="drop-text">
          Drag & drop your .md file here
        </p>
        <p className="drop-subtext">
          or click to browse your files
        </p>
        <div className="drop-info">
          <i className="fa-solid fa-circle-info" />
          Supports .md files up to 10 MB
        </div>
        <input
          type="file"
          id="file-input"
          accept=".md,.markdown,.txt"
          onChange={handleFileInput}
          hidden
        />
      </div>
    </section>
  );
}