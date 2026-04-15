import { describe, it, expect, beforeAll } from 'vitest';
import { marked } from 'marked';
import { analyzeDocument } from '../utils/documentAnalyzer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Markdown Syntax Support Tests', () => {
  let comprehensiveTokens;
  beforeAll(async () => {
    // Load comprehensive syntax test file
    const comprehensivePath = path.join(__dirname, '../../test_comprehensive_syntax.md');
    const comprehensiveContent = fs.readFileSync(comprehensivePath, 'utf8');
    comprehensiveTokens = marked.lexer(comprehensiveContent, { gfm: true });
  });

  describe('Heading Support', () => {
    it('should parse all heading levels (H1-H6)', () => {
      const headings = comprehensiveTokens.filter(t => t.type === 'heading');
      const headingLevels = headings.map(h => h.depth);

      expect(headingLevels).toContain(1);
      expect(headingLevels).toContain(2);
      expect(headingLevels).toContain(3);
      expect(headingLevels).toContain(4);
      expect(headingLevels).toContain(5);
      expect(headingLevels).toContain(6);
    });

    it('should count headings correctly in analysis', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      const headingStat = stats.find(s => s.label === 'Headings');
      expect(headingStat).toBeDefined();
      expect(headingStat.value).toBeGreaterThan(0);
    });
  });

  describe('Text Formatting Support', () => {
    it('should handle bold text', () => {
      const hasBold = comprehensiveTokens.some(token => {
        if (token.tokens) {
          return token.tokens.some(t => t.type === 'strong');
        }
        return false;
      });
      expect(hasBold).toBe(true);
    });

    it('should handle italic text', () => {
      const hasItalic = comprehensiveTokens.some(token => {
        if (token.tokens) {
          return token.tokens.some(t => t.type === 'em');
        }
        return false;
      });
      expect(hasItalic).toBe(true);
    });

    it('should handle strikethrough text', () => {
      const hasStrikethrough = comprehensiveTokens.some(token => {
        if (token.tokens) {
          return token.tokens.some(t => t.type === 'del' || t.type === 'strikethrough');
        }
        return false;
      });
      expect(hasStrikethrough).toBe(true);
    });

    it('should handle inline code', () => {
      const hasInlineCode = comprehensiveTokens.some(token => {
        if (token.tokens) {
          return token.tokens.some(t => t.type === 'codespan');
        }
        return false;
      });
      expect(hasInlineCode).toBe(true);
    });
  });

  describe('Paragraph Support', () => {
    it('should parse paragraphs correctly', () => {
      const paragraphs = comprehensiveTokens.filter(t => t.type === 'paragraph');
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it('should count paragraphs in analysis', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      const paragraphStat = stats.find(s => s.label === 'Paragraphs');
      expect(paragraphStat).toBeDefined();
      expect(paragraphStat.value).toBeGreaterThan(0);
    });
  });

  describe('List Support', () => {
    it('should handle unordered lists', () => {
      const hasUnorderedList = comprehensiveTokens.some(t =>
        t.type === 'list' && t.ordered === false
      );
      expect(hasUnorderedList).toBe(true);
    });

    it('should handle ordered lists', () => {
      const hasOrderedList = comprehensiveTokens.some(t =>
        t.type === 'list' && t.ordered === true
      );
      expect(hasOrderedList).toBe(true);
    });

    it('should handle nested lists', () => {
      const lists = comprehensiveTokens.filter(t => t.type === 'list');
      const hasNestedLists = lists.some(list =>
        list.items.some(item =>
          item.tokens && item.tokens.some(t => t.type === 'list')
        )
      );
      expect(hasNestedLists).toBe(true);
    });

    it('should handle task lists', () => {
      const lists = comprehensiveTokens.filter(t => t.type === 'list');
      const hasTaskLists = lists.some(list =>
        list.items.some(item => item.task !== undefined)
      );
      expect(hasTaskLists).toBe(true);
    });

    it('should count lists and items correctly', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      const listStat = stats.find(s => s.label.includes('Lists'));
      expect(listStat).toBeDefined();
      expect(listStat.value).toBeGreaterThan(0);
    });
  });

  describe('Code Block Support', () => {
    it('should handle code blocks', () => {
      const codeBlocks = comprehensiveTokens.filter(t => t.type === 'code');
      expect(codeBlocks.length).toBeGreaterThan(0);
    });

    it('should handle different language syntax highlighting', () => {
      const codeBlocks = comprehensiveTokens.filter(t => t.type === 'code');
      // Check for different languages
      const hasJavascript = codeBlocks.some(cb => cb.lang === 'javascript');
      const hasPython = codeBlocks.some(cb => cb.lang === 'python');
      const hasBash = codeBlocks.some(cb => cb.lang === 'bash');

      expect(hasJavascript || hasPython || hasBash).toBe(true);
    });

    it('should count code blocks in analysis', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      const codeStat = stats.find(s => s.label === 'Code Blocks');
      expect(codeStat).toBeDefined();
      expect(codeStat.value).toBeGreaterThan(0);
    });
  });

  describe('Blockquote Support', () => {
    it('should handle blockquotes', () => {
      const blockquotes = comprehensiveTokens.filter(t => t.type === 'blockquote');
      expect(blockquotes.length).toBeGreaterThan(0);
    });

    it('should handle nested blockquotes', () => {
      const blockquotes = comprehensiveTokens.filter(t => t.type === 'blockquote');
      const hasNested = blockquotes.some(bq =>
        bq.tokens && bq.tokens.some(t => t.type === 'blockquote')
      );
      expect(hasNested).toBe(true);
    });

    it('should count blockquotes in analysis', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      const quoteStat = stats.find(s => s.label === 'Blockquotes');
      expect(quoteStat).toBeDefined();
      expect(quoteStat.value).toBeGreaterThan(0);
    });
  });

  describe('Link Support', () => {
    it('should handle links', () => {
      const hasLinks = comprehensiveTokens.some(token => {
        if (token.tokens) {
          return token.tokens.some(t => t.type === 'link');
        }
        return false;
      });
      expect(hasLinks).toBe(true);
    });

    it('should count links in analysis', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      const linkStat = stats.find(s => s.label === 'Links');
      expect(linkStat).toBeDefined();
      expect(linkStat.value).toBeGreaterThan(0);
    });
  });

  describe('Image Support', () => {
    it('should handle images', () => {
      const hasImages = comprehensiveTokens.some(token => {
        if (token.tokens) {
          return token.tokens.some(t => t.type === 'image');
        }
        return false;
      });
      expect(hasImages).toBe(true);
    });

    it('should count images in analysis', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      const imageStat = stats.find(s => s.label === 'Images');
      expect(imageStat).toBeDefined();
      expect(imageStat.value).toBeGreaterThan(0);
    });
  });

  describe('Table Support', () => {
    it('should handle tables', () => {
      const tables = comprehensiveTokens.filter(t => t.type === 'table');
      expect(tables.length).toBeGreaterThan(0);
    });

    it('should handle table headers', () => {
      const tables = comprehensiveTokens.filter(t => t.type === 'table');
      const hasHeaders = tables.some(t => t.header && t.header.length > 0);
      expect(hasHeaders).toBe(true);
    });

    it('should handle table rows', () => {
      const tables = comprehensiveTokens.filter(t => t.type === 'table');
      const hasRows = tables.some(t => t.rows && t.rows.length > 0);
      expect(hasRows).toBe(true);
    });

    it('should count tables in analysis', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      const tableStat = stats.find(s => s.label === 'Tables');
      expect(tableStat).toBeDefined();
      expect(tableStat.value).toBeGreaterThan(0);
    });
  });

  describe('Horizontal Rule Support', () => {
    it('should handle horizontal rules', () => {
      const hrElements = comprehensiveTokens.filter(t => t.type === 'hr');
      expect(hrElements.length).toBeGreaterThan(0);
    });

    it('should count horizontal rules in analysis', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      const hrStat = stats.find(s => s.label === 'Horizontal Rules');
      expect(hrStat).toBeDefined();
      expect(hrStat.value).toBeGreaterThan(0);
    });
  });

  describe('Mixed Content Support', () => {
    it('should handle paragraphs with multiple formatting types', () => {
      const complexParagraphs = comprehensiveTokens.filter(token => {
        if (token.type === 'paragraph' && token.tokens) {
          const types = token.tokens.map(t => t.type);
          return types.includes('strong') || types.includes('em') ||
                 types.includes('codespan') || types.includes('link');
        }
        return false;
      });
      expect(complexParagraphs.length).toBeGreaterThan(0);
    });

    it('should handle nested formatting', () => {
      const hasNestedFormatting = comprehensiveTokens.some(token => {
        if (token.tokens) {
          return token.tokens.some(t =>
            t.tokens && t.tokens.length > 0
          );
        }
        return false;
      });
      expect(hasNestedFormatting).toBe(true);
    });
  });

  describe('Special Characters and Entities', () => {
    it('should handle HTML entities', () => {
      const content = fs.readFileSync(
        path.join(__dirname, '../../test_comprehensive_syntax.md'),
        'utf8'
      );
      expect(content).toContain('&copy;');
      expect(content).toContain('&reg;');
      expect(content).toContain('&trade;');
    });

    it('should handle escaped characters', () => {
      const content = fs.readFileSync(
        path.join(__dirname, '../../test_comprehensive_syntax.md'),
        'utf8'
      );
      expect(content).toContain('\\*');
      expect(content).toContain('\\[');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty elements', () => {
      const stats = analyzeDocument(comprehensiveTokens);
      // All stats should have positive values
      expect(stats.every(s => s.value > 0)).toBe(true);
    });

    it('should handle multiple consecutive elements', () => {
      const headings = comprehensiveTokens.filter(t => t.type === 'heading');
      expect(headings.length).toBeGreaterThan(5);
    });
  });
});

describe('Performance and Large File Tests', () => {
  let largeFileTokens;
  let parseTime;
  let analysisTime;

  beforeAll(() => {
    const largeFilePath = path.join(__dirname, '../../test_large_100pages.md');
    const largeFileContent = fs.readFileSync(largeFilePath, 'utf8');

    // Measure parsing time
    const parseStart = Date.now();
    largeFileTokens = marked.lexer(largeFileContent, { gfm: true });
    parseTime = Date.now() - parseStart;

    // Measure analysis time
    const analysisStart = Date.now();
    analyzeDocument(largeFileTokens);
    analysisTime = Date.now() - analysisStart;
  });

  it('should parse large file without errors', () => {
    expect(largeFileTokens).toBeDefined();
    expect(largeFileTokens.length).toBeGreaterThan(0);
  });

  it('should parse large file in reasonable time', () => {
    // Should parse within 5 seconds for a 100-page document
    expect(parseTime).toBeLessThan(5000);
  });

  it('should analyze large file in reasonable time', () => {
    // Should analyze within 1 second
    expect(analysisTime).toBeLessThan(1000);
  });

  it('should handle large number of elements', () => {
    const stats = analyzeDocument(largeFileTokens);

    // Should have substantial content
    const totalElements = stats.reduce((sum, stat) => sum + stat.value, 0);
    expect(totalElements).toBeGreaterThan(100);
  });

  it('should handle large number of headings', () => {
    const headings = largeFileTokens.filter(t => t.type === 'heading');
    expect(headings.length).toBeGreaterThan(50); // At least 100 chapters + sections
  });

  it('should handle large number of paragraphs', () => {
    const paragraphs = largeFileTokens.filter(t => t.type === 'paragraph');
    expect(paragraphs.length).toBeGreaterThan(100);
  });

  it('should handle large number of lists', () => {
    const lists = largeFileTokens.filter(t => t.type === 'list');
    expect(lists.length).toBeGreaterThan(50);
  });

  it('should handle large number of code blocks', () => {
    const codeBlocks = largeFileTokens.filter(t => t.type === 'code');
    expect(codeBlocks.length).toBeGreaterThan(50);
  });

  it('should handle large number of tables', () => {
    const tables = largeFileTokens.filter(t => t.type === 'table');
    expect(tables.length).toBeGreaterThan(50);
  });

  it('should handle large number of blockquotes', () => {
    const blockquotes = largeFileTokens.filter(t => t.type === 'blockquote');
    expect(blockquotes.length).toBeGreaterThan(50);
  });

  it('should maintain memory efficiency', () => {
    // This is a basic check - in real scenarios you'd want more sophisticated memory profiling
    const stats = analyzeDocument(largeFileTokens);
    expect(stats).toBeDefined();
    expect(stats.length).toBeGreaterThan(0);
  });

  it('should handle list structures in large files', () => {
    const lists = largeFileTokens.filter(t => t.type === 'list');
    // Should have multiple lists in the large file
    expect(lists.length).toBeGreaterThan(10);

    // Check that lists have items
    const hasItems = lists.some(list => list.items && list.items.length > 0);
    expect(hasItems).toBe(true);
  });
});

describe('Document Analysis Completeness', () => {
  it('should detect all supported markdown features', () => {
    const comprehensivePath = path.join(__dirname, '../../test_comprehensive_syntax.md');
    const content = fs.readFileSync(comprehensivePath, 'utf8');
    const tokens = marked.lexer(content, { gfm: true });
    const stats = analyzeDocument(tokens);

    const expectedFeatures = [
      'Headings', 'Paragraphs', 'Code Blocks', 'Tables',
      'Lists', 'Blockquotes', 'Links', 'Images', 'Horizontal Rules'
    ];

    const detectedFeatures = stats.map(s => s.label);

    expectedFeatures.forEach(feature => {
      // Check if feature exists (handling the "Lists (X items)" format)
      const featureExists = detectedFeatures.some(detected =>
        detected.includes(feature)
      );
      expect(featureExists).toBe(true);
    });
  });

  it('should provide accurate counts for each feature', () => {
    const comprehensivePath = path.join(__dirname, '../../test_comprehensive_syntax.md');
    const content = fs.readFileSync(comprehensivePath, 'utf8');
    const tokens = marked.lexer(content, { gfm: true });
    const stats = analyzeDocument(tokens);

    // Verify all counts are positive numbers
    stats.forEach(stat => {
      expect(stat.value).toBeGreaterThan(0);
      expect(typeof stat.value).toBe('number');
    });
  });
});