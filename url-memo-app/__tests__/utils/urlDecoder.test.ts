import { decodeTextFromUrl } from '@/utils/urlDecoder';

describe('decodeTextFromUrl', () => {
  it('should decode Base64 to simple text', () => {
    const encoded = 'SGVsbG8gV29ybGQ=';
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe('Hello World');
  });

  it('should handle empty string', () => {
    const encoded = '';
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe('');
  });

  it('should decode Japanese text correctly', () => {
    const originalText = 'こんにちは世界';
    const encoded = Buffer.from(originalText, 'utf-8').toString('base64');
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });

  it('should handle special characters', () => {
    const originalText = '!@#$%^&*()_+-=[]{}|;\':",./<>?';
    const encoded = Buffer.from(originalText, 'utf-8').toString('base64');
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });

  it('should handle multi-line text', () => {
    const originalText = 'Line 1\nLine 2\nLine 3';
    const encoded = Buffer.from(originalText, 'utf-8').toString('base64');
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });

  it('should decode emoji correctly', () => {
    const originalText = '😀😃😄😁😆';
    const encoded = Buffer.from(originalText, 'utf-8').toString('base64');
    const decoded = decodeTextFromUrl(encoded);
    expect(decoded).toBe(originalText);
  });

  it('should handle invalid Base64 gracefully', () => {
    const invalidEncoded = 'This is not valid Base64!@#$%';
    expect(() => decodeTextFromUrl(invalidEncoded)).toThrow('Invalid encoded text');
  });

  it('should handle corrupted Base64', () => {
    const corruptedEncoded = 'SGVsbG8gV29ybGQ'; // Missing padding
    const decoded = decodeTextFromUrl(corruptedEncoded);
    expect(decoded).toBe('Hello World');
  });
});