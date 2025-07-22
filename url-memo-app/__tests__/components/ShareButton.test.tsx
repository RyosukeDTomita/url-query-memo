import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareButton } from '@/components/ShareButton';

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('ShareButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render button with correct text', () => {
    const mockOnShare = jest.fn();
    render(<ShareButton currentUrl="https://example.com" onShare={mockOnShare} />);
    
    const button = screen.getByRole('button', { name: '共有' });
    expect(button).toBeInTheDocument();
  });

  it('should call onShare when clicked', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockResolvedValueOnce(undefined);
    
    const mockOnShare = jest.fn();
    const currentUrl = 'https://example.com/?memo=test';
    
    render(<ShareButton currentUrl={currentUrl} onShare={mockOnShare} />);
    
    const button = screen.getByRole('button', { name: '共有' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnShare).toHaveBeenCalledTimes(1);
    });
  });

  it('should copy URL to clipboard when clicked', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockResolvedValueOnce(undefined);
    
    const mockOnShare = jest.fn();
    const currentUrl = 'https://example.com/?memo=test';
    
    render(<ShareButton currentUrl={currentUrl} onShare={mockOnShare} />);
    
    const button = screen.getByRole('button', { name: '共有' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(currentUrl);
    });
  });

  it('should have proper styling', () => {
    const mockOnShare = jest.fn();
    render(<ShareButton currentUrl="https://example.com" onShare={mockOnShare} />);
    
    const button = screen.getByRole('button', { name: '共有' });
    expect(button).toHaveClass(
      'px-4',
      'py-2',
      'bg-green-600',
      'text-white',
      'rounded-lg',
      'hover:bg-green-700',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-green-500',
      'focus:ring-offset-2',
      'transition-colors'
    );
  });

  it('should display share icon', () => {
    const mockOnShare = jest.fn();
    render(<ShareButton currentUrl="https://example.com" onShare={mockOnShare} />);
    
    const icon = screen.getByText('🔗');
    expect(icon).toBeInTheDocument();
  });

  it('should be accessible via keyboard', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockResolvedValueOnce(undefined);
    
    const mockOnShare = jest.fn();
    render(<ShareButton currentUrl="https://example.com" onShare={mockOnShare} />);
    
    const button = screen.getByRole('button', { name: '共有' });
    
    // Tab to focus the button
    button.focus();
    expect(button).toHaveFocus();
    
    // Press Enter to trigger click
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockOnShare).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle disabled state', () => {
    const mockOnShare = jest.fn();
    render(<ShareButton currentUrl="https://example.com" onShare={mockOnShare} disabled />);
    
    const button = screen.getByRole('button', { name: '共有' });
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(mockOnShare).not.toHaveBeenCalled();
  });

  it('should apply disabled styling when disabled', () => {
    const mockOnShare = jest.fn();
    render(<ShareButton currentUrl="https://example.com" onShare={mockOnShare} disabled />);
    
    const button = screen.getByRole('button', { name: '共有' });
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('should handle clipboard failure gracefully', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockRejectedValueOnce(new Error('Clipboard failed'));
    
    const mockOnShare = jest.fn();
    const currentUrl = 'https://example.com/?memo=test';
    
    render(<ShareButton currentUrl={currentUrl} onShare={mockOnShare} />);
    
    const button = screen.getByRole('button', { name: '共有' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnShare).toHaveBeenCalledTimes(1);
    });
  });

  it('should work with empty URL', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockResolvedValueOnce(undefined);
    
    const mockOnShare = jest.fn();
    render(<ShareButton currentUrl="" onShare={mockOnShare} />);
    
    const button = screen.getByRole('button', { name: '共有' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith('');
      expect(mockOnShare).toHaveBeenCalledTimes(1);
    });
  });

  it('should work with very long URLs', async () => {
    const mockWriteText = navigator.clipboard.writeText as jest.Mock;
    mockWriteText.mockResolvedValueOnce(undefined);
    
    const mockOnShare = jest.fn();
    const longUrl = 'https://example.com/?' + 'a'.repeat(1000);
    
    render(<ShareButton currentUrl={longUrl} onShare={mockOnShare} />);
    
    const button = screen.getByRole('button', { name: '共有' });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(longUrl);
      expect(mockOnShare).toHaveBeenCalledTimes(1);
    });
  });
});