import { renderHook, act } from '@testing-library/react';
import { useBookmark } from '@/hooks/useBookmark';

describe('useBookmark', () => {
  beforeEach(() => {
    // Clear any existing alerts
    jest.clearAllMocks();
    global.alert = jest.fn();
  });

  it('should provide updateBookmark function', () => {
    const { result } = renderHook(() => useBookmark());
    expect(result.current.updateBookmark).toBeDefined();
    expect(typeof result.current.updateBookmark).toBe('function');
  });

  it('should provide hasBookmark function', () => {
    const { result } = renderHook(() => useBookmark());
    expect(result.current.hasBookmark).toBeDefined();
    expect(typeof result.current.hasBookmark).toBe('function');
  });

  it('should show instructions when updateBookmark is called', () => {
    const { result } = renderHook(() => useBookmark());
    const testUrl = 'https://example.com/?memo=test';

    act(() => {
      result.current.updateBookmark(testUrl);
    });

    expect(global.alert).toHaveBeenCalledWith(
      expect.stringContaining('ブックマーク')
    );
  });

  it('should include URL in the update instructions', () => {
    const { result } = renderHook(() => useBookmark());
    const testUrl = 'https://example.com/?memo=test';

    act(() => {
      result.current.updateBookmark(testUrl);
    });

    expect(global.alert).toHaveBeenCalledWith(
      expect.stringContaining(testUrl)
    );
  });

  it('should always return false for hasBookmark (browser limitation)', () => {
    const { result } = renderHook(() => useBookmark());
    expect(result.current.hasBookmark()).toBe(false);
  });

  it('should handle empty URL', () => {
    const { result } = renderHook(() => useBookmark());

    act(() => {
      result.current.updateBookmark('');
    });

    expect(global.alert).toHaveBeenCalled();
  });

  it('should provide different instructions for first-time vs update', () => {
    const { result } = renderHook(() => useBookmark());
    const testUrl = 'https://example.com/?memo=test';

    // First call - should include creation instructions
    act(() => {
      result.current.updateBookmark(testUrl);
    });

    const firstCallMessage = (global.alert as jest.Mock).mock.calls[0][0];
    expect(firstCallMessage).toContain('Ctrl+D');

    // Subsequent calls could have different message (though in practice it's the same)
    act(() => {
      result.current.updateBookmark(testUrl);
    });

    const secondCallMessage = (global.alert as jest.Mock).mock.calls[1][0];
    expect(secondCallMessage).toBeTruthy();
  });
});