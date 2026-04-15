import { useState, useCallback } from 'react';
import { marked } from 'marked';
import { showToast } from './toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['md', 'markdown', 'txt'];

export function useFileHandler() {
  const [currentFile, setCurrentFile] = useState(null);
  const [currentMarkdown, setCurrentMarkdown] = useState('');
  const [currentTokens, setCurrentTokens] = useState([]);

  const validateFile = useCallback((file) => {
    // Check file extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      showToast('Please upload a .md or .markdown file.', 'error');
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      showToast('File too large. Maximum size is 10 MB.', 'error');
      return false;
    }

    return true;
  }, []);

  const handleFile = useCallback((file) => {
    if (!validateFile(file)) return;

    setCurrentFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      
      if (!content.trim()) {
        showToast('The file appears to be empty.', 'error');
        setCurrentFile(null);
        return;
      }

      setCurrentMarkdown(content);
      
      // Parse markdown tokens
      try {
        const tokens = marked.lexer(content, { gfm: true });
        setCurrentTokens(tokens);
        showToast('File loaded successfully!', 'success');
      } catch (error) {
        console.error('Error parsing markdown:', error);
        showToast('Error parsing markdown file.', 'error');
        setCurrentFile(null);
        setCurrentMarkdown('');
        setCurrentTokens([]);
      }
    };

    reader.onerror = () => {
      showToast('Failed to read the file.', 'error');
      setCurrentFile(null);
      setCurrentMarkdown('');
      setCurrentTokens([]);
    };

    reader.readAsText(file);
  }, [validateFile]);

  const clearFile = useCallback(() => {
    setCurrentFile(null);
    setCurrentMarkdown('');
    setCurrentTokens([]);
  }, []);

  return {
    currentFile,
    currentMarkdown,
    currentTokens,
    handleFile,
    clearFile,
  };
}
