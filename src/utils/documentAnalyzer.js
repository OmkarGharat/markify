export function analyzeDocument(tokens) {
  const stats = {
    headings: 0,
    paragraphs: 0,
    codeBlocks: 0,
    tables: 0,
    lists: 0,
    listItems: 0,
    blockquotes: 0,
    links: 0,
    images: 0,
    hr: 0
  };

  function countTokens(tokens) {
    for (const t of tokens) {
      switch (t.type) {
        case 'heading':
          stats.headings++;
          countTokens(t.tokens || []);
          break;
        case 'paragraph':
          stats.paragraphs++;
          countTokens(t.tokens || []);
          break;
        case 'code':
          stats.codeBlocks++;
          break;
        case 'table':
          stats.tables++;
          break;
        case 'list':
          stats.lists++;
          countListItems(t.items);
          break;
        case 'blockquote':
          stats.blockquotes++;
          countTokens(t.tokens || []);
          break;
        case 'hr':
          stats.hr++;
          break;
        case 'text':
          break;
      }
    }

    // Count inline elements
    for (const t of tokens) {
      if (t.tokens) countInline(t.tokens, stats);
    }
  }

  function countInline(tokens, s) {
    for (const t of tokens) {
      if (t.type === 'link') s.links++;
      if (t.type === 'image') s.images++;
      if (t.tokens) countInline(t.tokens, s);
    }
  }

  function countListItems(items) {
    for (const item of items) {
      stats.listItems++;
      if (item.tokens) {
        for (const t of item.tokens) {
          if (t.type === 'list') countListItems(t.items);
          if (t.tokens) countInline(t.tokens, stats);
        }
      }
    }
  }

  countTokens(tokens);

  const items = [
    { icon: 'fa-heading', color: '#1B2A4A', label: 'Headings', value: stats.headings },
    { icon: 'fa-paragraph', color: '#2D3436', label: 'Paragraphs', value: stats.paragraphs },
    { icon: 'fa-code', color: '#C62828', label: 'Code Blocks', value: stats.codeBlocks },
    { icon: 'fa-table', color: '#0D7377', label: 'Tables', value: stats.tables },
    { icon: 'fa-list', color: '#2E86AB', label: `Lists (${stats.listItems} items)`, value: stats.lists },
    { icon: 'fa-quote-left', color: '#00897B', label: 'Blockquotes', value: stats.blockquotes },
    { icon: 'fa-link', color: '#00838F', label: 'Links', value: stats.links },
    { icon: 'fa-image', color: '#5C6BC0', label: 'Images', value: stats.images },
    { icon: 'fa-minus', color: '#0D7377', label: 'Horizontal Rules', value: stats.hr }
  ].filter(i => i.value > 0);

  return items;
}