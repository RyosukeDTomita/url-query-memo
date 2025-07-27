import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SplitLayout } from '../../components/SplitLayout';

describe('SplitLayout', () => {
  it('should render both editor and preview panes', () => {
    render(
      <SplitLayout>
        <div data-testid="editor">Editor</div>
        <div data-testid="preview">Preview</div>
      </SplitLayout>
    );

    expect(screen.getByTestId('editor')).toBeInTheDocument();
    expect(screen.getByTestId('preview')).toBeInTheDocument();
  });

  it('should show both panes side by side', () => {
    render(
      <SplitLayout>
        <div>Editor</div>
        <div>Preview</div>
      </SplitLayout>
    );

    const container = screen.getByTestId('split-layout');
    expect(container).toHaveClass('grid-cols-2');
  });

  it('should have equal width for both panes', () => {
    render(
      <SplitLayout>
        <div>Editor</div>
        <div>Preview</div>
      </SplitLayout>
    );

    const leftPane = screen.getByTestId('left-pane');
    const rightPane = screen.getByTestId('right-pane');
    
    expect(leftPane).toHaveClass('w-full');
    expect(rightPane).toHaveClass('w-full');
  });

  it('should handle window resize correctly', () => {
    const { container } = render(
      <SplitLayout>
        <div>Editor</div>
        <div>Preview</div>
      </SplitLayout>
    );

    // Simulate window resize
    global.innerWidth = 500;
    fireEvent(window, new Event('resize'));

    const layout = screen.getByTestId('split-layout');
    // On small screens, it should stack vertically
    expect(layout).toHaveClass('grid-cols-1');

    // Simulate larger window
    global.innerWidth = 1200;
    fireEvent(window, new Event('resize'));

    // On larger screens, it should be side by side
    expect(layout).toHaveClass('md:grid-cols-2');
  });

  it('should have proper styling and borders', () => {
    render(
      <SplitLayout>
        <div>Editor</div>
        <div>Preview</div>
      </SplitLayout>
    );

    const leftPane = screen.getByTestId('left-pane');
    const rightPane = screen.getByTestId('right-pane');

    // Check for border between panes
    expect(rightPane).toHaveClass('border-l');
  });

  it('should maintain content when switching layouts', () => {
    const { rerender } = render(
      <SplitLayout>
        <div data-testid="editor">Editor Content</div>
        <div data-testid="preview">Preview Content</div>
      </SplitLayout>
    );

    expect(screen.getByText('Editor Content')).toBeInTheDocument();
    expect(screen.getByText('Preview Content')).toBeInTheDocument();

    // Simulate window resize
    global.innerWidth = 400;
    fireEvent(window, new Event('resize'));

    // Content should still be there
    expect(screen.getByText('Editor Content')).toBeInTheDocument();
    expect(screen.getByText('Preview Content')).toBeInTheDocument();
  });
});