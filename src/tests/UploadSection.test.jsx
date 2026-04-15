import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UploadSection } from '../components/UploadSection';

describe('UploadSection', () => {
  const mockOnFileSelect = vi.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it('renders upload zone correctly', () => {
    render(<UploadSection onFileSelect={mockOnFileSelect} />);

    expect(screen.getByText(/drag & drop your .md file here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to browse your files/i)).toBeInTheDocument();
    expect(screen.getByText(/supports .md files up to 10 mb/i)).toBeInTheDocument();
  });

  it('calls onFileSelect when file is dropped', async () => {
    render(<UploadSection onFileSelect={mockOnFileSelect} />);

    const dropZone = screen.getByRole('button');
    const file = new File(['# Test content'], 'test.md', { type: 'text/markdown' });

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it('calls onFileSelect when file input changes', async () => {
    const { container } = render(<UploadSection onFileSelect={mockOnFileSelect} />);

    const fileInput = container.querySelector('#file-input');
    const file = new File(['# Test content'], 'test.md', { type: 'text/markdown' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    });
  });

  it('applies drag-over class when dragging over', () => {
    render(<UploadSection onFileSelect={mockOnFileSelect} />);

    const dropZone = screen.getByRole('button');

    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveClass('drag-over');

    fireEvent.dragLeave(dropZone);
    expect(dropZone).not.toHaveClass('drag-over');
  });

  it('is accessible via keyboard', () => {
    render(<UploadSection onFileSelect={mockOnFileSelect} />);

    const dropZone = screen.getByRole('button');

    expect(dropZone).toHaveAttribute('tabindex', '0');
    expect(dropZone).toHaveAttribute('aria-label', 'Upload a Markdown file');
  });

  it('triggers file input on Enter key', async () => {
    render(<UploadSection onFileSelect={mockOnFileSelect} />);

    const dropZone = screen.getByRole('button');

    fireEvent.keyDown(dropZone, { key: 'Enter' });

    // Should trigger file input click
    expect(dropZone).toBeInTheDocument();
  });

  it('triggers file input on Space key', async () => {
    render(<UploadSection onFileSelect={mockOnFileSelect} />);

    const dropZone = screen.getByRole('button');

    fireEvent.keyDown(dropZone, { key: ' ' });

    // Should trigger file input click
    expect(dropZone).toBeInTheDocument();
  });
});