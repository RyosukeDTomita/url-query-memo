const MAX_URL_LENGTH = 2048;

export function encodeTextToUrl(text: string): string {
  if (text === '') {
    return '';
  }

  const base64Encoded = Buffer.from(text, 'utf-8').toString('base64');
  
  if (base64Encoded.length > MAX_URL_LENGTH) {
    throw new Error('Text is too long to be safely encoded in URL');
  }

  return base64Encoded;
}