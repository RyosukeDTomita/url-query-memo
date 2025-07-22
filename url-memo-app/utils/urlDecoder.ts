export function decodeTextFromUrl(urlParam: string): string {
  if (urlParam === '') {
    return '';
  }

  try {
    // Check if the string is valid Base64
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!base64Regex.test(urlParam)) {
      throw new Error('Invalid encoded text');
    }

    const decoded = Buffer.from(urlParam, 'base64').toString('utf-8');
    return decoded;
  } catch (error) {
    throw new Error('Invalid encoded text');
  }
}