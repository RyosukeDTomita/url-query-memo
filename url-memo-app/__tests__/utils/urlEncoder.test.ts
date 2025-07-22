import { encodeTextToUrl } from '@/utils/urlEncoder';
import { decodeTextFromUrl } from '@/utils/urlDecoder';

describe('encodeTextToUrl', () => {
  it('should encode simple text', () => {
    const text = 'Hello World';
    const encoded = encodeTextToUrl(text);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(text);
  });

  it('should handle empty string', () => {
    const text = '';
    const encoded = encodeTextToUrl(text);
    expect(encoded).toBe('');
  });

  it('should encode Japanese text correctly', () => {
    const text = 'こんにちは世界';
    const encoded = encodeTextToUrl(text);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(text);
  });

  it('should handle special characters', () => {
    const text = '!@#$%^&*()_+-=[]{}|;\':",./<>?';
    const encoded = encodeTextToUrl(text);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(text);
  });

  it('should handle multi-line text', () => {
    const text = 'Line 1\nLine 2\nLine 3';
    const encoded = encodeTextToUrl(text);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(text);
  });

  it('should encode emoji correctly', () => {
    const text = '😀😃😄😁😆';
    const encoded = encodeTextToUrl(text);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(text);
  });

  it('should handle very long text with compression', () => {
    const text = 'a'.repeat(1000);
    const encoded = encodeTextToUrl(text);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(text);
    // Compression should make it much smaller than base64
    expect(encoded.length).toBeLessThan(text.length);
  });

  it('should throw error for text exceeding URL limit', () => {
    // Create a very large text that will exceed 2048 chars when compressed
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(500) + 'a'.repeat(10000);
    expect(() => encodeTextToUrl(text)).toThrow('Text is too long to be safely encoded in URL');
  });
});