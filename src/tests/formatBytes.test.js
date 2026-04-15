import { describe, it, expect } from 'vitest';
import { formatBytes } from '../utils/formatBytes';

describe('formatBytes', () => {
  it('formats bytes correctly', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576)).toBe('1.00 MB');
    expect(formatBytes(1572864)).toBe('1.50 MB');
  });

  it('handles large numbers', () => {
    expect(formatBytes(1073741824)).toBe('1024.00 MB');
    expect(formatBytes(2147483648)).toBe('2048.00 MB');
  });

  it('returns string with appropriate units', () => {
    expect(typeof formatBytes(100)).toBe('string');
    expect(formatBytes(100)).toContain('B');
    expect(formatBytes(2048)).toContain('KB');
    expect(formatBytes(2097152)).toContain('MB');
  });
});