import LZString from 'lz-string';

const MAX_URL_LENGTH = 8192; // 8KB - supported by most modern browsers and servers

export function encodeTextToUrl(text: string): string {
  if (text === '') {
    return '';
  }

  const compressed = LZString.compressToEncodedURIComponent(text);
  
  if (compressed.length > MAX_URL_LENGTH) {
    throw new Error('Text is too long to be safely encoded in URL');
  }

  return compressed;
}