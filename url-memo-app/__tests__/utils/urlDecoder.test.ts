import { decodeTextFromUrl } from '@/utils/urlDecoder';
import { encodeTextToUrl } from '@/utils/urlEncoder';

describe('decodeTextFromUrl', () => {
  it('should decode compressed text correctly', () => {
    const originalText = 'Hello World';
    const encoded = encodeTextToUrl(originalText);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });

  it('should handle empty string', () => {
    const encoded = '';
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe('');
  });

  it('should decode Japanese text correctly', () => {
    const originalText = 'こんにちは世界';
    const encoded = encodeTextToUrl(originalText);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });

  it('should handle special characters', () => {
    const originalText = '!@#$%^&*()_+-=[]{}|;\':",./<>?';
    const encoded = encodeTextToUrl(originalText);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });

  it('should handle multi-line text', () => {
    const originalText = 'Line 1\nLine 2\nLine 3';
    const encoded = encodeTextToUrl(originalText);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });

  it('should decode emoji correctly', () => {
    const originalText = '😀😃😄😁😆';
    const encoded = encodeTextToUrl(originalText);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });

  it('should handle invalid compressed data gracefully', () => {
    // LZ-string returns null for invalid data, which should result in an error
    const invalidEncoded = 'This is not valid compressed data!@#$%';
    expect(() => decodeTextFromUrl(invalidEncoded)).toThrow('Invalid compressed data');
  });

  it('should handle very long text', () => {
    const originalText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(50);
    const encoded = encodeTextToUrl(originalText);
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });
});