import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SaveButton } from '@/components/SaveButton';

describe('SaveButton', () => {
  it('should render button with correct text', () => {
    const mockOnSave = jest.fn();
    render(<SaveButton currentUrl="https://example.com" onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: 'ブックマークに保存' });
    expect(button).toBeInTheDocument();
  });

  it('should call onSave when clicked', () => {
    const mockOnSave = jest.fn();
    const currentUrl = 'https://example.com/?memo=test';
    
    render(<SaveButton currentUrl={currentUrl} onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: 'ブックマークに保存' });
    fireEvent.click(button);
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should have proper styling', () => {
    const mockOnSave = jest.fn();
    render(<SaveButton currentUrl="https://example.com" onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: 'ブックマークに保存' });
    expect(button).toHaveClass(
      'px-4',
      'py-2',
      'bg-blue-600',
      'text-white',
      'rounded-lg',
      'hover:bg-blue-700',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:ring-offset-2',
      'transition-colors'
    );
  });

  it('should display save icon', () => {
    const mockOnSave = jest.fn();
    render(<SaveButton currentUrl="https://example.com" onSave={mockOnSave} />);
    
    const icon = screen.getByText('💾');
    expect(icon).toBeInTheDocument();
  });

  it('should be accessible via keyboard', () => {
    const mockOnSave = jest.fn();
    render(<SaveButton currentUrl="https://example.com" onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: 'ブックマークに保存' });
    
    // Tab to focus the button
    button.focus();
    expect(button).toHaveFocus();
    
    // Press Enter to trigger click
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    
    // Press Space to trigger click
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(mockOnSave).toHaveBeenCalledTimes(2);
  });

  it('should handle disabled state', () => {
    const mockOnSave = jest.fn();
    render(<SaveButton currentUrl="https://example.com" onSave={mockOnSave} disabled />);
    
    const button = screen.getByRole('button', { name: 'ブックマークに保存' });
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should apply disabled styling when disabled', () => {
    const mockOnSave = jest.fn();
    render(<SaveButton currentUrl="https://example.com" onSave={mockOnSave} disabled />);
    
    const button = screen.getByRole('button', { name: 'ブックマークに保存' });
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('should have proper aria attributes', () => {
    const mockOnSave = jest.fn();
    const currentUrl = 'https://example.com/?memo=test';
    
    render(<SaveButton currentUrl={currentUrl} onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: 'ブックマークに保存' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'ブックマークに保存');
  });

  it('should work with empty URL', () => {
    const mockOnSave = jest.fn();
    render(<SaveButton currentUrl="" onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: 'ブックマークに保存' });
    fireEvent.click(button);
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should work with very long URLs', () => {
    const mockOnSave = jest.fn();
    const longUrl = 'https://example.com/?' + 'a'.repeat(1000);
    
    render(<SaveButton currentUrl={longUrl} onSave={mockOnSave} />);
    
    const button = screen.getByRole('button', { name: 'ブックマークに保存' });
    fireEvent.click(button);
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });
});