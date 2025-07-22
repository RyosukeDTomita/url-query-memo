import { copyToClipboard } from '@/utils/clipboard';

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('copyToClipboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should copy text to clipboard successfully', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockResolvedValueOnce(undefined);

    const text = 'Hello World';
    const result = await copyToClipboard(text);

    expect(mockWriteText).toHaveBeenCalledWith(text);
    expect(result).toBe(true);
  });

  it('should return false when clipboard write fails', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockRejectedValueOnce(new Error('Clipboard write failed'));

    const text = 'Hello World';
    const result = await copyToClipboard(text);

    expect(mockWriteText).toHaveBeenCalledWith(text);
    expect(result).toBe(false);
  });

  it('should handle empty string', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockResolvedValueOnce(undefined);

    const text = '';
    const result = await copyToClipboard(text);

    expect(mockWriteText).toHaveBeenCalledWith(text);
    expect(result).toBe(true);
  });

  it('should handle very long text', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockResolvedValueOnce(undefined);

    const text = 'a'.repeat(10000);
    const result = await copyToClipboard(text);

    expect(mockWriteText).toHaveBeenCalledWith(text);
    expect(result).toBe(true);
  });
});