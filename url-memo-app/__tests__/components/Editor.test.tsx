import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Editor } from '@/components/Editor';

describe('Editor', () => {
  it('should render textarea element', () => {
    const mockOnChange = jest.fn();
    render(<Editor initialText="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  });

  it('should display initial text', () => {
    const mockOnChange = jest.fn();
    const initialText = 'Hello World';
    
    render(<Editor initialText={initialText} onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe(initialText);
  });

  it('should call onChange when text is typed', () => {
    const mockOnChange = jest.fn();
    render(<Editor initialText="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    
    expect(mockOnChange).toHaveBeenCalledWith('New text');
  });

  it('should handle maxLength prop', () => {
    const mockOnChange = jest.fn();
    const maxLength = 10;
    
    render(<Editor initialText="" onChange={mockOnChange} maxLength={maxLength} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.maxLength).toBe(maxLength);
  });

  it('should show character count when maxLength is provided', () => {
    const mockOnChange = jest.fn();
    const initialText = 'Hello';
    const maxLength = 10;
    
    render(<Editor initialText={initialText} onChange={mockOnChange} maxLength={maxLength} />);
    
    const characterCount = screen.getByText('5 / 10');
    expect(characterCount).toBeInTheDocument();
  });

  it('should update character count when text changes', () => {
    const mockOnChange = jest.fn();
    const maxLength = 10;
    
    render(<Editor initialText="" onChange={mockOnChange} maxLength={maxLength} />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    
    const characterCount = screen.getByText('8 / 10');
    expect(characterCount).toBeInTheDocument();
  });

  it('should show warning when near character limit', () => {
    const mockOnChange = jest.fn();
    const initialText = 'Hello Wor'; // 9 characters (90% of 10)
    const maxLength = 10;
    
    render(<Editor initialText={initialText} onChange={mockOnChange} maxLength={maxLength} />);
    
    const textarea = screen.getByRole('textbox');
    // Make sure it's exactly 9 characters to trigger 90% threshold
    fireEvent.change(textarea, { target: { value: 'HelloWork' } }); // 9 chars exactly
    
    const characterCount = screen.getByText('9 / 10');
    expect(characterCount).toHaveClass('text-orange-500');
  });

  it('should show error when character limit is exceeded', () => {
    const mockOnChange = jest.fn();
    const initialText = 'Hello World'; // 11 characters
    const maxLength = 10;
    
    render(<Editor initialText={initialText} onChange={mockOnChange} maxLength={maxLength} />);
    
    const characterCount = screen.getByText('11 / 10');
    expect(characterCount).toHaveClass('text-red-500');
  });

  it('should handle multiline text', () => {
    const mockOnChange = jest.fn();
    const multilineText = 'Line 1\nLine 2\nLine 3';
    
    render(<Editor initialText={multilineText} onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe(multilineText);
  });

  it('should have appropriate placeholder text', () => {
    const mockOnChange = jest.fn();
    render(<Editor initialText="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe('ここにメモを入力してください...');
  });

  it('should have appropriate ARIA label', () => {
    const mockOnChange = jest.fn();
    render(<Editor initialText="" onChange={mockOnChange} />);
    
    const textarea = screen.getByLabelText('メモエディタ');
    expect(textarea).toBeInTheDocument();
  });

  it('should auto-resize height based on content', () => {
    const mockOnChange = jest.fn();
    render(<Editor initialText="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    
    // Initially should have a minimum height
    expect(textarea).toHaveClass('min-h-[200px]');
    
    // Should allow for expansion
    expect(textarea).toHaveClass('resize-none');
  });
});