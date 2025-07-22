import LZString from 'lz-string';

export function decodeTextFromUrl(urlParam: string): string {
  if (urlParam === '') {
    return '';
  }

  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(urlParam);
    if (decompressed === null) {
      throw new Error('Invalid encoded text');
    }
    return decompressed;
  } catch (error) {
    throw new Error('Invalid encoded text');
  }
}