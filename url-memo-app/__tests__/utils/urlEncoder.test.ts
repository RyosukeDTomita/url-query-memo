import { encodeTextToUrl } from '@/utils/urlEncoder';

describe('encodeTextToUrl', () => {
  it('should encode simple text to Base64', () => {
    const text = 'Hello World';
    const encoded = encodeTextToUrl(text);
    expect(encoded).toBe('SGVsbG8gV29ybGQ=');
  });

  it('should handle empty string', () => {
    const text = '';
    const encoded = encodeTextToUrl(text);
    expect(encoded).toBe('');
  });

  it('should encode Japanese text correctly', () => {
    const text = 'こんにちは世界';
    const encoded = encodeTextToUrl(text);
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    expect(decoded).toBe(text);
  });

  it('should handle special characters', () => {
    const text = '!@#$%^&*()_+-=[]{}|;\':",./<>?';
    const encoded = encodeTextToUrl(text);
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    expect(decoded).toBe(text);
  });

  it('should handle multi-line text', () => {
    const text = 'Line 1\nLine 2\nLine 3';
    const encoded = encodeTextToUrl(text);
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    expect(decoded).toBe(text);
  });

  it('should encode emoji correctly', () => {
    const text = '😀😃😄😁😆';
    const encoded = encodeTextToUrl(text);
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    expect(decoded).toBe(text);
  });

  it('should handle very long text', () => {
    const text = 'a'.repeat(1000);
    const encoded = encodeTextToUrl(text);
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    expect(decoded).toBe(text);
  });

  it('should throw error for text exceeding URL limit', () => {
    const text = 'a'.repeat(3000);
    expect(() => encodeTextToUrl(text)).toThrow('Text is too long to be safely encoded in URL');
  });
});