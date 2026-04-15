import { describe, it, expect } from 'vitest';
import { analyzeDocument } from '../utils/documentAnalyzer';

describe('analyzeDocument', () => {
  it('analyzes empty document', () => {
    const tokens = [];
    const result = analyzeDocument(tokens);

    expect(result).toEqual([]);
  });

  it('counts headings correctly', () => {
    const tokens = [
      { type: 'heading', depth: 1, tokens: [{ type: 'text', text: 'Heading 1' }] },
      { type: 'heading', depth: 2, tokens: [{ type: 'text', text: 'Heading 2' }] },
      { type: 'heading', depth: 3, tokens: [{ type: 'text', text: 'Heading 3' }] },
    ];

    const result = analyzeDocument(tokens);

    expect(result).toHaveLength(1);
    expect(result[0].label).toBe('Headings');
    expect(result[0].value).toBe(3);
  });

  it('counts paragraphs correctly', () => {
    const tokens = [
      { type: 'paragraph', tokens: [{ type: 'text', text: 'Paragraph 1' }] },
      { type: 'paragraph', tokens: [{ type: 'text', text: 'Paragraph 2' }] },
    ];

    const result = analyzeDocument(tokens);

    const paragraphStat = result.find(stat => stat.label === 'Paragraphs');
    expect(paragraphStat).toBeDefined();
    expect(paragraphStat.value).toBe(2);
  });

  it('counts code blocks correctly', () => {
    const tokens = [
      { type: 'code', text: 'console.log("Hello");' },
      { type: 'code', text: 'const x = 5;' },
    ];

    const result = analyzeDocument(tokens);

    const codeStat = result.find(stat => stat.label === 'Code Blocks');
    expect(codeStat).toBeDefined();
    expect(codeStat.value).toBe(2);
  });

  it('counts lists and list items correctly', () => {
    const tokens = [
      {
        type: 'list',
        ordered: false,
        items: [
          { tokens: [{ type: 'paragraph', tokens: [{ type: 'text', text: 'Item 1' }] }] },
          { tokens: [{ type: 'paragraph', tokens: [{ type: 'text', text: 'Item 2' }] }] },
          { tokens: [{ type: 'paragraph', tokens: [{ type: 'text', text: 'Item 3' }] }] },
        ],
      },
    ];

    const result = analyzeDocument(tokens);

    const listStat = result.find(stat => stat.label.includes('Lists'));
    expect(listStat).toBeDefined();
    expect(listStat.value).toBe(1);
    expect(listStat.label).toContain('3 items');
  });

  it('counts links correctly', () => {
    const tokens = [
      {
        type: 'paragraph',
        tokens: [
          { type: 'link', href: 'https://example.com', tokens: [{ type: 'text', text: 'Example' }] },
          { type: 'link', href: 'https://test.com', tokens: [{ type: 'text', text: 'Test' }] },
        ],
      },
    ];

    const result = analyzeDocument(tokens);

    const linkStat = result.find(stat => stat.label === 'Links');
    expect(linkStat).toBeDefined();
    expect(linkStat.value).toBe(2);
  });

  it('counts images correctly', () => {
    const tokens = [
      {
        type: 'paragraph',
        tokens: [
          { type: 'image', href: 'image1.png', text: 'Image 1' },
          { type: 'image', href: 'image2.png', text: 'Image 2' },
        ],
      },
    ];

    const result = analyzeDocument(tokens);

    const imageStat = result.find(stat => stat.label === 'Images');
    expect(imageStat).toBeDefined();
    expect(imageStat.value).toBe(2);
  });

  it('counts horizontal rules correctly', () => {
    const tokens = [
      { type: 'hr' },
      { type: 'hr' },
      { type: 'hr' },
    ];

    const result = analyzeDocument(tokens);

    const hrStat = result.find(stat => stat.label === 'Horizontal Rules');
    expect(hrStat).toBeDefined();
    expect(hrStat.value).toBe(3);
  });

  it('counts blockquotes correctly', () => {
    const tokens = [
      {
        type: 'blockquote',
        tokens: [{ type: 'paragraph', tokens: [{ type: 'text', text: 'Quote 1' }] }],
      },
      {
        type: 'blockquote',
        tokens: [{ type: 'paragraph', tokens: [{ type: 'text', text: 'Quote 2' }] }],
      },
    ];

    const result = analyzeDocument(tokens);

    const quoteStat = result.find(stat => stat.label === 'Blockquotes');
    expect(quoteStat).toBeDefined();
    expect(quoteStat.value).toBe(2);
  });

  it('filters out zero-count items', () => {
    const tokens = [
      { type: 'heading', depth: 1, tokens: [{ type: 'text', text: 'Heading 1' }] },
    ];

    const result = analyzeDocument(tokens);

    // Should only include headings, not other elements with 0 count
    expect(result.every(stat => stat.value > 0)).toBe(true);
  });

  it('handles complex nested structures', () => {
    const tokens = [
      {
        type: 'list',
        ordered: false,
        items: [
          {
            tokens: [
              { type: 'paragraph', tokens: [{ type: 'text', text: 'Item 1' }] },
              {
                type: 'list',
                ordered: true,
                items: [
                  { tokens: [{ type: 'paragraph', tokens: [{ type: 'text', text: 'Nested 1' }] }] },
                  { tokens: [{ type: 'paragraph', tokens: [{ type: 'text', text: 'Nested 2' }] }] },
                ],
              },
            ],
          },
        ],
      },
    ];

    const result = analyzeDocument(tokens);

    const listStat = result.find(stat => stat.label.includes('Lists'));
    expect(listStat).toBeDefined();
    expect(listStat.value).toBe(1);
    expect(listStat.label).toContain('3 items'); // 1 top-level + 2 nested
  });
});