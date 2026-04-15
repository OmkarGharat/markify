import { useState, useEffect } from 'react';
import { formatBytes } from '../utils/formatBytes';
import './ResultSection.css';

export function ResultSection({ fileName, fileSize, blob, onAnother }) {
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [blob]);

  const handleDownload = () => {
    if (!downloadUrl) return;

    const outputName = fileName.replace(/\.(md|markdown|txt)$/i, '') + '.docx';
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = outputName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section className="result-section">
      <div className="result-card glass">
        <div className="success-icon">
          <i className="fa-solid fa-check" />
        </div>
        <h2 className="result-title">Conversion Complete</h2>
        <p className="result-filename">
          {fileName.replace(/\.(md|markdown|txt)$/i, '') + '.docx'}
        </p>
        <p className="result-filesize">{formatBytes(fileSize)}</p>

        <button className="btn-download" onClick={handleDownload}>
          <i className="fa-solid fa-download" />
          Download .docx
        </button>

        <div className="result-actions">
          <button className="btn-another" onClick={onAnother}>
            <i className="fa-solid fa-arrow-rotate-left" />
            Convert Another File
          </button>
        </div>
      </div>
    </section>
  );
}