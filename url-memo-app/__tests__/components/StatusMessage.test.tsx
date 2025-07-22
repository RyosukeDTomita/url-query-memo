import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { StatusMessage } from '@/components/StatusMessage';

// Mock timers
jest.useFakeTimers();

describe('StatusMessage', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should render message text', () => {
    render(<StatusMessage message="Test message" type="info" />);
    
    const message = screen.getByText('Test message');
    expect(message).toBeInTheDocument();
  });

  it('should apply correct styling for success type', () => {
    render(<StatusMessage message="Success message" type="success" />);
    
    const messageElement = screen.getByText('Success message');
    expect(messageElement.closest('div')).toHaveClass('bg-green-100', 'text-green-800', 'border-green-200');
  });

  it('should apply correct styling for error type', () => {
    render(<StatusMessage message="Error message" type="error" />);
    
    const messageElement = screen.getByText('Error message');
    expect(messageElement.closest('div')).toHaveClass('bg-red-100', 'text-red-800', 'border-red-200');
  });

  it('should apply correct styling for warning type', () => {
    render(<StatusMessage message="Warning message" type="warning" />);
    
    const messageElement = screen.getByText('Warning message');
    expect(messageElement.closest('div')).toHaveClass('bg-yellow-100', 'text-yellow-800', 'border-yellow-200');
  });

  it('should apply correct styling for info type', () => {
    render(<StatusMessage message="Info message" type="info" />);
    
    const messageElement = screen.getByText('Info message');
    expect(messageElement.closest('div')).toHaveClass('bg-blue-100', 'text-blue-800', 'border-blue-200');
  });

  it('should auto-hide after default duration', () => {
    const { container } = render(<StatusMessage message="Test message" type="info" />);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(5000); // Default 5 seconds
    });
    
    expect(container.firstChild).toBeNull();
  });

  it('should auto-hide after custom duration', () => {
    const { container } = render(<StatusMessage message="Test message" type="info" duration={3000} />);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(2999);
    });
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(1);
    });
    
    expect(container.firstChild).toBeNull();
  });

  it('should not auto-hide when duration is 0', () => {
    render(<StatusMessage message="Persistent message" type="info" duration={0} />);
    
    expect(screen.getByText('Persistent message')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    expect(screen.getByText('Persistent message')).toBeInTheDocument();
  });

  it('should have proper ARIA role', () => {
    render(<StatusMessage message="Alert message" type="error" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Alert message');
  });

  it('should handle empty message', () => {
    const { container } = render(<StatusMessage message="" type="info" />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should handle long messages', () => {
    const longMessage = 'This is a very long message that should be handled properly by the component without breaking the layout or functionality.';
    render(<StatusMessage message={longMessage} type="info" />);
    
    const message = screen.getByText(longMessage);
    expect(message).toBeInTheDocument();
  });

  it('should display icons for different message types', () => {
    const { rerender } = render(<StatusMessage message="Success" type="success" />);
    expect(screen.getByText('✓')).toBeInTheDocument();
    
    rerender(<StatusMessage message="Error" type="error" />);
    expect(screen.getByText('✕')).toBeInTheDocument();
    
    rerender(<StatusMessage message="Warning" type="warning" />);
    expect(screen.getByText('⚠')).toBeInTheDocument();
    
    rerender(<StatusMessage message="Info" type="info" />);
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });
});