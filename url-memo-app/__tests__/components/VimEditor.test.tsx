import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VimEditor } from '../../components/VimEditor';

describe('VimEditor', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with initial text', () => {
    render(<VimEditor initialText="Hello World" onChange={mockOnChange} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('Hello World');
  });

  it('shows normal mode indicator by default', () => {
    render(<VimEditor initialText="" onChange={mockOnChange} />);
    expect(screen.getByText('NORMAL')).toBeInTheDocument();
  });

  it('switches to insert mode when pressing i', () => {
    render(<VimEditor initialText="" onChange={mockOnChange} />);
    const textarea = screen.getByRole('textbox');
    
    fireEvent.keyDown(textarea, { key: 'i' });
    
    expect(screen.getByText('INSERT')).toBeInTheDocument();
  });

  it('returns to normal mode when pressing Escape', () => {
    render(<VimEditor initialText="" onChange={mockOnChange} />);
    const textarea = screen.getByRole('textbox');
    
    // Switch to insert mode
    fireEvent.keyDown(textarea, { key: 'i' });
    expect(screen.getByText('INSERT')).toBeInTheDocument();
    
    // Return to normal mode
    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(screen.getByText('NORMAL')).toBeInTheDocument();
  });

  it('allows typing in insert mode', async () => {
    const user = userEvent.setup();
    render(<VimEditor initialText="" onChange={mockOnChange} />);
    const textarea = screen.getByRole('textbox');
    
    // Switch to insert mode
    fireEvent.keyDown(textarea, { key: 'i' });
    
    // Type text
    await user.type(textarea, 'Hello');
    
    expect(mockOnChange).toHaveBeenCalledWith('Hello');
  });

  it('prevents typing in normal mode', async () => {
    const user = userEvent.setup();
    render(<VimEditor initialText="" onChange={mockOnChange} />);
    const textarea = screen.getByRole('textbox');
    
    // Try to type in normal mode
    await user.type(textarea, 'Hello');
    
    // Should not trigger onChange
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('moves cursor with hjkl in normal mode', async () => {
    render(<VimEditor initialText="Hello World" onChange={mockOnChange} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    
    // Set cursor position to middle
    textarea.setSelectionRange(5, 5);
    fireEvent.select(textarea);
    
    // Move left with h
    fireEvent.keyDown(textarea, { key: 'h' });
    
    // Wait for cursor update
    await waitFor(() => {
      expect(textarea.selectionStart).toBe(4);
    });
  });

  it('deletes character with x in normal mode', () => {
    render(<VimEditor initialText="Hello" onChange={mockOnChange} />);
    const textarea = screen.getByRole('textbox');
    
    // Press x to delete first character
    fireEvent.keyDown(textarea, { key: 'x' });
    
    expect(mockOnChange).toHaveBeenCalledWith('ello');
  });

  it('shows character count when maxLength is provided', () => {
    render(<VimEditor initialText="Hello" onChange={mockOnChange} maxLength={100} />);
    expect(screen.getByText('5 / 100')).toBeInTheDocument();
  });

  it('can toggle vim mode on/off', async () => {
    const user = userEvent.setup();
    render(<VimEditor initialText="" onChange={mockOnChange} />);
    
    const toggleButton = screen.getByText('Vim Mode: ON');
    await user.click(toggleButton);
    
    expect(screen.getByText('Vim Mode: OFF')).toBeInTheDocument();
    expect(screen.queryByText('NORMAL')).not.toBeInTheDocument();
  });

  it('updates when initialText changes', () => {
    const { rerender } = render(<VimEditor initialText="Hello" onChange={mockOnChange} />);
    const textarea = screen.getByRole('textbox');
    
    expect(textarea).toHaveValue('Hello');
    
    rerender(<VimEditor initialText="World" onChange={mockOnChange} />);
    expect(textarea).toHaveValue('World');
  });
});