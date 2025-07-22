import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResetButton } from '@/components/ResetButton';

describe('ResetButton', () => {
  let mockOnReset: jest.Mock;

  beforeEach(() => {
    mockOnReset = jest.fn();
    // Mock window.confirm
    global.confirm = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the reset button', () => {
    render(<ResetButton onReset={mockOnReset} />);
    
    const button = screen.getByRole('button', { name: 'メモをリセット' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('リセット');
  });

  it('should show confirmation dialog when clicked', () => {
    (global.confirm as jest.Mock).mockReturnValue(true);
    
    render(<ResetButton onReset={mockOnReset} />);
    
    const button = screen.getByRole('button', { name: 'メモをリセット' });
    fireEvent.click(button);
    
    expect(global.confirm).toHaveBeenCalledWith(
      'メモをリセットしますか？\nこの操作は取り消せません。'
    );
  });

  it('should call onReset when user confirms', () => {
    (global.confirm as jest.Mock).mockReturnValue(true);
    
    render(<ResetButton onReset={mockOnReset} />);
    
    const button = screen.getByRole('button', { name: 'メモをリセット' });
    fireEvent.click(button);
    
    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it('should not call onReset when user cancels', () => {
    (global.confirm as jest.Mock).mockReturnValue(false);
    
    render(<ResetButton onReset={mockOnReset} />);
    
    const button = screen.getByRole('button', { name: 'メモをリセット' });
    fireEvent.click(button);
    
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<ResetButton onReset={mockOnReset} disabled={true} />);
    
    const button = screen.getByRole('button', { name: 'メモをリセット' });
    expect(button).toBeDisabled();
  });

  it('should not show confirmation when disabled', () => {
    render(<ResetButton onReset={mockOnReset} disabled={true} />);
    
    const button = screen.getByRole('button', { name: 'メモをリセット' });
    fireEvent.click(button);
    
    expect(global.confirm).not.toHaveBeenCalled();
    expect(mockOnReset).not.toHaveBeenCalled();
  });

  it('should have proper styling classes', () => {
    render(<ResetButton onReset={mockOnReset} />);
    
    const button = screen.getByRole('button', { name: 'メモをリセット' });
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('hover:bg-red-700');
  });
});