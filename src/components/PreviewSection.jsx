import { useMemo } from 'react';
import { marked } from 'marked';
import { formatBytes } from '../utils/formatBytes';
import { analyzeDocument } from '../utils/documentAnalyzer';
import './PreviewSection.css';

export function PreviewSection({ file, markdown, tokens, onConvert, onClear, isConverting, error }) {

  const previewHtml = useMemo(() => {
    try {
      return marked.parse(markdown, { gfm: true });
    } catch (err) {
      console.error('Error parsing markdown:', err);
      return '<p>Error parsing markdown</p>';
    }
  }, [markdown]);

  const stats = useMemo(() => analyzeDocument(tokens), [tokens]);

  const handleConvert = () => {
    if (!isConverting) {
      onConvert();
    }
  };

  return (
    <section className="preview-section">
      {/* File info bar */}
      <div className="file-info-bar glass">
        <div className="file-info">
          <div className="file-icon">
            <i className="fa-brands fa-markdown" />
          </div>
          <div className="file-details">
            <p className="file-name">{file.name}</p>
            <p className="file-meta">
              {formatBytes(file.size)} · {markdown.split('\n').length} lines
            </p>
          </div>
        </div>
        <button
          className="btn-clear"
          onClick={onClear}
          aria-label="Remove file"
          disabled={isConverting}
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>

      {/* Preview grid */}
      <div className="preview-grid">
        {/* Left: Markdown preview */}
        <div className="preview-content">
          <p className="section-label">
            <i className="fa-solid fa-eye" />
            Live Preview
          </p>
          <div
            className="md-preview"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
            role="document"
            aria-label="Markdown preview"
          />
        </div>

        {/* Right: Analysis */}
        <div className="analysis-panel">
          <p className="section-label">
            <i className="fa-solid fa-chart-pie" />
            Document Analysis
          </p>
          <div className="analysis-content glass">
            {stats.length > 0 ? (
              stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">
                    <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color }} />
                  </div>
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-stats">No structured elements detected.</p>
            )}
          </div>

          <p className="section-label">
            <i className="fa-solid fa-palette" />
            Output Palette
          </p>
          <div className="palette-content glass">
            <div className="palette-grid">
              {['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Body', 'Link', 'Code', 'Quote'].map((label) => (
                <div key={label} className="palette-item">
                  <div
                    className="color-swatch"
                    style={{
                      background: `#${
                        label === 'H1' ? '1B2A4A' :
                        label === 'H2' ? '0D7377' :
                        label === 'H3' ? '2E86AB' :
                        label === 'H4' ? '5C6BC0' :
                        label === 'H5' ? '7E57C2' :
                        label === 'H6' ? 'AB47BC' :
                        label === 'Body' ? '2D3436' :
                        label === 'Link' ? '00838F' :
                        label === 'Code' ? 'C62828' :
                        '00897B'
                      }`
                    }}
                  />
                  <span className="palette-label">{label}</span>
                </div>
              ))}
            </div>
            <div className="palette-info">
              <strong>Fonts:</strong> Cambria (headings), Calibri (body), Consolas (code)
            </div>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="error-message">
          <i className="fa-solid fa-triangle-exclamation" />
          {error}
        </div>
      )}

      {/* Convert button */}
      <button
        className={`btn-convert ${isConverting ? 'converting' : ''}`}
        onClick={handleConvert}
        disabled={isConverting}
      >
        {isConverting ? (
          <>
            <span className="spinner" />
            Converting...
          </>
        ) : (
          <>
            <i className="fa-solid fa-wand-magic-sparkles" />
            Convert to DOCX
          </>
        )}
      </button>
    </section>
  );
}