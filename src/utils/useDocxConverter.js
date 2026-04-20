import { useState, useCallback } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  UnderlineType, ShadingType, BorderStyle, convertInchesToTwip, Table, TableRow, TableCell, WidthType } from 'docx';
import { COLORS, HEADING_SIZES, BODY_SIZE, CODE_SIZE } from '../styles/docxStyles';
import { showToast } from './toast';

// marked's lexer HTML-encodes special characters in token.text (e.g. & → &amp;,
// ' → &#39;). Decode them before writing to DOCX so Word shows the real characters.
function decodeHtmlEntities(str) {
  if (!str || !str.includes('&')) return str;
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
}

// Splits a text string into TextRun segments so emoji characters get the
// 'Segoe UI Emoji' font (which Cambria/Calibri don't support on most platforms).
function createEmojiAwareRuns(text, baseProps) {
  if (!text) return [];
  text = decodeHtmlEntities(text); // must happen before emoji splitting
  const EMOJI_RE = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
  const runs = [];
  let lastIndex = 0;
  let match;
  while ((match = EMOJI_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push(new TextRun({ ...baseProps, text: text.slice(lastIndex, match.index) }));
    }
    // Emoji: override font, strip color so Word uses its built-in color rendering
    runs.push(new TextRun({ ...baseProps, text: match[0], font: 'Segoe UI Emoji', color: undefined }));
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    runs.push(new TextRun({ ...baseProps, text: text.slice(lastIndex) }));
  }
  return runs.length > 0 ? runs : [new TextRun({ ...baseProps, text })];
}

export function useDocxConverter() {
  const [outputBlob, setOutputBlob] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionError, setConversionError] = useState(null);

  const processInlineTokens = useCallback((tokens, overrides = {}) => {
    if (!tokens || !tokens.length) return [];

    const runs = [];
    const baseRun = {
      font: 'Calibri',
      size: BODY_SIZE,
      color: COLORS.body,
      ...overrides
    };

    for (const token of tokens) {
      switch (token.type) {
        case 'text': {
          if (token.tokens && token.tokens.length > 0) {
            runs.push(...processInlineTokens(token.tokens, overrides));
          } else if (token.text) {
            runs.push(...createEmojiAwareRuns(token.text, baseRun));
          }
          break;
        }
        case 'strong': {
          runs.push(...processInlineTokens(token.tokens, {
            ...overrides,
            bold: true,
            color: overrides.color || COLORS.strong
          }));
          break;
        }
        case 'em': {
          runs.push(...processInlineTokens(token.tokens, { ...overrides, italics: true }));
          break;
        }
        case 'codespan': {
          if (token.text) {
            runs.push(new TextRun({
              text: decodeHtmlEntities(token.text),
              font: 'Consolas',
              size: CODE_SIZE,
              color: COLORS.inlineText,
              shading: { type: ShadingType.CLEAR, fill: COLORS.inlineBg }
            }));
          }
          break;
        }
        case 'link': {
          const linkRuns = processInlineTokens(token.tokens, {
            color: COLORS.link,
            underline: { type: UnderlineType.SINGLE, color: COLORS.link }
          });
          runs.push(...linkRuns);
          break;
        }
        case 'image': {
          const altText = token.text || token.href || 'Image';
          runs.push(new TextRun({
            text: `[${altText}]`,
            font: 'Calibri',
            size: BODY_SIZE,
            italics: true,
            color: COLORS.quoteText
          }));
          break;
        }
        case 'br': {
          runs.push(new TextRun({ break: 1 }));
          break;
        }
        case 'del':
        case 'strikethrough': {
          runs.push(...processInlineTokens(token.tokens, { ...overrides, strike: true }));
          break;
        }
        default: {
          if (token.raw) {
            runs.push(new TextRun({ ...baseRun, text: token.raw }));
          }
        }
      }
    }
    return runs;
  }, []);

  const processBlockTokens = useCallback((tokens) => {
    const elements = [];
    if (!tokens) return elements;

    for (const token of tokens) {
      switch (token.type) {
        case 'heading': {
          const idx = Math.min(token.depth - 1, 5);
          const headingLevels = [
            HeadingLevel.HEADING_1, HeadingLevel.HEADING_2,
            HeadingLevel.HEADING_3, HeadingLevel.HEADING_4,
            HeadingLevel.HEADING_5, HeadingLevel.HEADING_6
          ];
          const runs = processInlineTokens(token.tokens, {
            bold: true,
            color: [COLORS.h1, COLORS.h2, COLORS.h3, COLORS.h4, COLORS.h5, COLORS.h6][idx],
            font: 'Cambria',
            size: HEADING_SIZES[idx]
          });
          if (runs.length === 0) {
            runs.push(new TextRun({
              text: ' ',
              font: 'Cambria',
              size: HEADING_SIZES[idx]
            }));
          }
          elements.push(new Paragraph({
            heading: headingLevels[idx],
            spacing: { before: idx === 0 ? 480 : 360, after: 200 },
            children: runs
          }));
          break;
        }

        case 'paragraph': {
          const runs = processInlineTokens(token.tokens);
          if (runs.length > 0) {
            elements.push(new Paragraph({
              spacing: { after: 200, line: 360 },
              children: runs
            }));
          }
          break;
        }

        case 'text': {
          if (token.text && token.text.trim()) {
            elements.push(new Paragraph({
              spacing: { after: 200, line: 360 },
              children: [new TextRun({
                text: token.text,
                font: 'Calibri',
                size: BODY_SIZE,
                color: COLORS.body
              })]
            }));
          }
          break;
        }

        case 'code': {
          // Carousel blocks (4-backtick fenced blocks) — render as a clean slide list
          if (token.lang === 'carousel') {
            const imageMatches = [...token.text.matchAll(/!\[([^\]]+)\]/g)];
            elements.push(new Paragraph({
              spacing: { before: 240, after: 80 },
              border: { left: { style: BorderStyle.SINGLE, size: 16, color: COLORS.h3, space: 8 } },
              indent: { left: 360 },
              children: [new TextRun({
                text: `Carousel — ${imageMatches.length} slide${imageMatches.length !== 1 ? 's' : ''}`,
                font: 'Calibri', size: BODY_SIZE, bold: true, color: COLORS.h3
              })]
            }));
            imageMatches.forEach((m, i) => {
              elements.push(new Paragraph({
                spacing: { before: 40, after: 40 },
                indent: { left: 720 },
                children: [
                  new TextRun({ text: `${i + 1}.  `, font: 'Calibri', size: BODY_SIZE, color: COLORS.bullet, bold: true }),
                  new TextRun({ text: m[1], font: 'Calibri', size: BODY_SIZE, color: COLORS.quoteText, italics: true })
                ]
              }));
            });
            elements.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
            break;
          }

          // Diff blocks — colour added/removed lines green/red
          if (token.lang === 'diff') {
            if (token.lang) {
              elements.push(new Paragraph({
                spacing: { before: 240, after: 0 },
                children: [new TextRun({ text: 'diff', font: 'Consolas', size: 16, color: COLORS.headerText, bold: true })]
              }));
            }
            token.text.split('\n').forEach(line => {
              const isAdd = line.startsWith('+');
              const isDel = line.startsWith('-');
              const lineColor = isAdd ? '1A7F37' : isDel ? 'CF222E' : COLORS.codeText;
              const lineBg   = isAdd ? 'E6FFEC'  : isDel ? 'FFEBE9'  : COLORS.codeBg;
              elements.push(new Paragraph({
                spacing: { after: 0, line: 276 },
                shading: { type: ShadingType.CLEAR, fill: lineBg },
                indent: { left: 360 },
                border: { left: { style: BorderStyle.SINGLE, size: 12, color: lineColor, space: 8 } },
                children: [new TextRun({ text: line || ' ', font: 'Consolas', size: CODE_SIZE, color: lineColor })]
              }));
            });
            elements.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
            break;
          }

          // Generic code block — no language label, just render the lines
          const lines = decodeHtmlEntities(token.text).split('\n');
          const codeParagraphs = lines.map(line =>
            new Paragraph({
              spacing: { after: 0, line: 276 },
              shading: { type: ShadingType.CLEAR, fill: COLORS.codeBg },
              indent: { left: 360 },
              border: { left: { style: BorderStyle.SINGLE, size: 12, color: COLORS.bullet, space: 8 } },
              children: [new TextRun({ text: line || ' ', font: 'Consolas', size: CODE_SIZE, color: COLORS.codeText })]
            })
          );
          elements.push(...codeParagraphs);
          elements.push(new Paragraph({ spacing: { after: 200 }, children: [] }));
          break;
        }

        case 'list': {
          processListItems(token.items, 0, token.ordered ? 'ordered-list' : 'bullet-list', elements);
          elements.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
          break;
        }

        case 'blockquote': {
          processBlockquote(token, elements, 0);
          break;
        }

        case 'table': {
          processTable(token, elements);
          break;
        }

        case 'hr': {
          elements.push(new Paragraph({
            spacing: { before: 240, after: 240 },
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 6,
                color: COLORS.hr,
                space: 1
              }
            },
            children: []
          }));
          break;
        }

        default: {
          if (token.text) {
            elements.push(new Paragraph({
              spacing: { after: 200 },
              children: [new TextRun({
                text: token.text,
                font: 'Calibri',
                size: BODY_SIZE,
                color: COLORS.body
              })]
            }));
          }
        }
      }
    }
    return elements;
  }, [processInlineTokens]);

  const processListItems = useCallback((items, level, reference, elements) => {
    for (const item of items) {
      const inlineTokens = [];
      const nestedLists = [];

      for (const t of (item.tokens || [])) {
        if (t.type === 'paragraph' && t.tokens) {
          inlineTokens.push(...t.tokens);
        } else if (t.type === 'text') {
          inlineTokens.push(t);
        } else if (t.type === 'list') {
          nestedLists.push(t);
        }
      }

      const runs = [];

      if (item.task) {
        // Task list items: manually render checkbox + text, no numbering bullet
        runs.push(new TextRun({
          text: item.checked ? '\u2611 ' : '\u2610 ',
          font: 'Segoe UI Symbol',
          size: BODY_SIZE,
          color: COLORS.bullet
        }));
        runs.push(...processInlineTokens(inlineTokens));
        if (runs.length > 0) {
          elements.push(new Paragraph({
            spacing: { after: 60, line: 360 },
            indent: { left: 360 * (level + 1), hanging: 360 },
            children: runs
          }));
        }
      } else {
        runs.push(...processInlineTokens(inlineTokens));
        if (runs.length > 0) {
          elements.push(new Paragraph({
            numbering: { reference, level: Math.min(level, 2) },
            spacing: { after: 60, line: 360 },
            children: runs
          }));
        }
      }

      for (const nl of nestedLists) {
        const nestedRef = nl.ordered ? 'ordered-list' : 'bullet-list';
        processListItems(nl.items, level + 1, nestedRef, elements);
      }
    }
  }, [processInlineTokens]);

  const processBlockquote = useCallback((token, elements, depth) => {
    let borderColor = COLORS.quoteBorder;
    let iconText = '';
    let isAlert = false;
    let titleRun = null;
    
    // Check if it's a GitHub flavored alert block
    if (token.tokens && token.tokens.length > 0 && token.tokens[0].type === 'paragraph') {
      const firstPar = token.tokens[0];
      if (firstPar.tokens && firstPar.tokens.length > 0) {
        let textIdx = firstPar.tokens.findIndex(t => t.type === 'text');
        if (textIdx !== -1) {
          const textToken = firstPar.tokens[textIdx];
          const text = textToken.text.trimStart();
          const alertMatch = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
          if (alertMatch) {
            isAlert = true;
            const alertType = alertMatch[1].toUpperCase();
            
            const alertStyles = {
              NOTE: { color: '0969DA', label: 'Note' },
              TIP: { color: '1A7F37', label: 'Tip' },
              IMPORTANT: { color: '8250DF', label: 'Important' },
              WARNING: { color: '9A6700', label: 'Warning' },
              CAUTION: { color: 'CF222E', label: 'Caution' }
            };
            
            const style = alertStyles[alertType] || alertStyles.NOTE;
            borderColor = style.color;
            iconText = style.label;
            
            textToken.text = textToken.text.replace(/^\s*\[![A-Z]+\][\s\n]*/i, '');
            
            if (!textToken.text) {
               firstPar.tokens.splice(textIdx, 1);
               if (firstPar.tokens.length > textIdx && (firstPar.tokens[textIdx].type === 'space' || firstPar.tokens[textIdx].type === 'br')) {
                 firstPar.tokens.splice(textIdx, 1);
               }
            }
            
            titleRun = new Paragraph({
               spacing: { before: 80, after: 80, line: 360 },
               indent: { left: 720 + (depth * 360) },
               border: {
                 left: { style: BorderStyle.SINGLE, size: Math.max(24 - depth * 6, 8), color: borderColor, space: 8 }
               },
               children: [
                 new TextRun({ text: iconText, bold: true, color: borderColor, size: BODY_SIZE })
               ]
            });
          }
        }
      }
    }

    const indentLeft = 720 + (depth * 360);
    const borderSize = Math.max(24 - depth * 6, 8);

    if (titleRun) {
      elements.push(titleRun);
    }

    for (const bt of (token.tokens || [])) {
      if (bt.type === 'paragraph') {
        const overrides = isAlert ? { color: COLORS.body } : { italics: true, color: COLORS.quoteText };
        const runs = processInlineTokens(bt.tokens, overrides);
        if (runs.length > 0) {
          elements.push(new Paragraph({
            spacing: { before: 80, after: 80, line: 360 },
            indent: { left: indentLeft },
            border: {
              left: {
                style: BorderStyle.SINGLE,
                size: borderSize,
                color: borderColor,
                space: 8
              }
            },
            children: runs
          }));
        }
      } else if (bt.type === 'blockquote') {
        processBlockquote(bt, elements, depth + 1);
      }
    }
  }, [processInlineTokens]);

  const processTable = useCallback((token, elements) => {
    const numCols = (token.header || []).length;
    if (numCols === 0) return;

    const aligns = token.align || [];

    // Give narrow columns (like "#", "№") a fixed small width;
    // distribute the remainder evenly among the rest.
    const headerTexts = (token.header || []).map(h => (h.text || '').trim());
    const isNarrow = (txt) => /^[#№]$/.test(txt) || txt.length <= 2;
    const narrowPct = 6;  // ~6% for a single-character index column
    const narrowCount = headerTexts.filter(isNarrow).length;
    const widePct = narrowCount < numCols
      ? Math.floor((100 - narrowCount * narrowPct) / (numCols - narrowCount))
      : Math.floor(100 / numCols);
    const colPct = (colIdx) => isNarrow(headerTexts[colIdx]) ? narrowPct : widePct;

    const getAlignment = (colIdx) => {
      const a = aligns[colIdx];
      if (a === 'right') return AlignmentType.RIGHT;
      if (a === 'center') return AlignmentType.CENTER;
      return AlignmentType.LEFT;
    };

    // Returns an array of Paragraph elements for a table cell.
    // Splits on `br` tokens so bullet points written on separate lines
    // each become their own Paragraph instead of emitting literal <br> text.
    const getCellParagraphs = (cell, colIdx, isHeader) => {
      const alignment = getAlignment(colIdx);
      const spacing = isHeader ? { before: 80, after: 80 } : { before: 60, after: 60 };

      const makeParagraph = (runs) => new Paragraph({
        alignment,
        spacing,
        children: runs.length > 0 ? runs : [new TextRun({ text: ' ', size: CODE_SIZE })]
      });

      if (!cell.tokens) {
        const runs = createEmojiAwareRuns(cell.text || '', {
          font: 'Calibri', size: CODE_SIZE, bold: isHeader,
          color: isHeader ? COLORS.tableHeaderText : COLORS.body
        });
        return [makeParagraph(runs)];
      }

      const overrides = isHeader
        ? { bold: true, color: COLORS.tableHeaderText, size: CODE_SIZE }
        : { size: CODE_SIZE };

      // Split the flat token list on `br` tokens → one paragraph per segment
      const segments = [];
      let current = [];
      for (const t of cell.tokens) {
        if (t.type === 'br') {
          segments.push(current);
          current = [];
        } else {
          current.push(t);
        }
      }
      segments.push(current);

      // If there was only one segment (no br tokens) just return one paragraph
      if (segments.length === 1) {
        return [makeParagraph(processInlineTokens(segments[0], overrides))];
      }

      return segments
        .filter(seg => seg.length > 0)
        .map(seg => makeParagraph(processInlineTokens(seg, overrides)));
    };

    const tableRows = [];

    // Header row — dark background, white bold text
    const headerCells = (token.header || []).map((h, colIdx) =>
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: COLORS.tableHeaderBg },
        width: { size: colPct(colIdx), type: WidthType.PERCENTAGE },
        children: getCellParagraphs(h, colIdx, true)
      })
    );
    tableRows.push(new TableRow({ tableHeader: true, children: headerCells }));

    // Data rows — alternating row shading
    (token.rows || []).forEach((row, rowIdx) => {
      const fill = rowIdx % 2 === 0 ? COLORS.tableRow1 : COLORS.tableRow2;
      const cells = row.map((cell, colIdx) =>
        new TableCell({
          shading: { type: ShadingType.CLEAR, fill },
          width: { size: colPct(colIdx), type: WidthType.PERCENTAGE },
          children: getCellParagraphs(cell, colIdx, false)
        })
      );
      tableRows.push(new TableRow({ children: cells }));
    });

    elements.push(new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } }));
    elements.push(new Paragraph({ spacing: { after: 240 }, children: [] }));
  }, [processInlineTokens]);

  const convertToDocx = useCallback(async (markdown, tokens) => {
    setIsConverting(true);
    setConversionError(null);

    try {
      const docElements = processBlockTokens(tokens);

      if (docElements.length === 0) {
        docElements.push(new Paragraph({
          children: [new TextRun({
            text: markdown,
            font: 'Calibri',
            size: BODY_SIZE,
            color: COLORS.body
          })]
        }));
      }

      const doc = new Document({
        creator: 'Markify Converter',
        description: 'Converted from Markdown',
        numbering: {
          config: [
            {
              reference: 'bullet-list',
              levels: [
                { level: 0, format: 'bullet', text: '\u25CF', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
                { level: 1, format: 'bullet', text: '\u25CB', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
                { level: 2, format: 'bullet', text: '\u25A0', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 2160, hanging: 360 } } } },
              ]
            },
            {
              reference: 'ordered-list',
              levels: [
                { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
                { level: 1, format: 'decimal', text: '%2.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1440, hanging: 360 } } } },
                { level: 2, format: 'decimal', text: '%3.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 2160, hanging: 360 } } } },
              ]
            }
          ]
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1.15),
                right: convertInchesToTwip(1.15)
              }
            }
          },
          children: docElements
        }]
      });

      const blob = await Packer.toBlob(doc);
      setOutputBlob(blob);
      showToast('Document converted successfully!', 'success');

      return blob;
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError(error.message);
      showToast(error.message || 'An error occurred during conversion.', 'error');
      throw error;
    } finally {
      setIsConverting(false);
    }
  }, [processBlockTokens]);

  return {
    outputBlob,
    isConverting,
    conversionError,
    convertToDocx,
  };
}