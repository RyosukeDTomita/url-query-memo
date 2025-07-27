import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../app/page';

// Mock components to test integration
jest.mock('../../components/CodeMirrorVimEditor', () => ({
  CodeMirrorVimEditor: ({ onChange, initialText }: any) => (
    <textarea
      data-testid="editor"
      value={initialText}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

jest.mock('../../hooks/useUrlState', () => ({
  useUrlState: (key: string, defaultValue: string) => {
    const [value, setValue] = React.useState(defaultValue);
    return [value, setValue];
  },
}));

jest.mock('../../hooks/useBookmark', () => ({
  useBookmark: () => ({
    updateBookmark: jest.fn(),
  }),
}));

jest.mock('../../utils/urlEncoder', () => ({
  encodeTextToUrl: (text: string) => btoa(text),
}));

jest.mock('../../utils/urlDecoder', () => ({
  decodeTextFromUrl: (encoded: string) => atob(encoded),
}));

describe('Split View with Markdown Integration', () => {
  beforeEach(() => {
    // Mock window.history
    window.history.replaceState = jest.fn();
    
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
  });

  it('should update preview in real-time when text changes', async () => {
    render(<Home />);
    
    const editor = screen.getByTestId('editor');
    
    // Type markdown content
    fireEvent.change(editor, { target: { value: '# Hello World' } });
    
    await waitFor(() => {
      const preview = screen.getByTestId('markdown-preview');
      expect(preview).toBeInTheDocument();
      expect(preview.innerHTML).toContain('<h1>Hello World</h1>');
    });
  });

  it('should handle complex markdown with lists and code', async () => {
    render(<Home />);
    
    const editor = screen.getByTestId('editor');
    const markdown = `# My Document

## Features
- Feature 1
- Feature 2

\`\`\`javascript
const hello = "world";
\`\`\`

**Bold text** and *italic text*`;
    
    fireEvent.change(editor, { target: { value: markdown } });
    
    await waitFor(() => {
      const preview = screen.getByTestId('markdown-preview');
      expect(preview.innerHTML).toContain('<h1>My Document</h1>');
      expect(preview.innerHTML).toContain('<h2>Features</h2>');
      expect(preview.innerHTML).toContain('<li>Feature 1</li>');
      expect(preview.innerHTML).toContain('<strong>Bold text</strong>');
      expect(preview.innerHTML).toContain('<em>italic text</em>');
    });
  });

  it('should maintain sync between editor and preview during rapid typing', async () => {
    render(<Home />);
    
    const editor = screen.getByTestId('editor');
    
    // Simulate rapid typing
    const texts = [
      '# H',
      '# He',
      '# Hel',
      '# Hell',
      '# Hello',
    ];
    
    for (const text of texts) {
      fireEvent.change(editor, { target: { value: text } });
      
      await waitFor(() => {
        const preview = screen.getByTestId('markdown-preview');
        expect(preview.innerHTML).toContain(text.replace('# ', ''));
      });
    }
  });

  it('should handle empty content in both panes', async () => {
    render(<Home />);
    
    const editor = screen.getByTestId('editor');
    
    // Clear content
    fireEvent.change(editor, { target: { value: '' } });
    
    await waitFor(() => {
      const preview = screen.getByTestId('markdown-preview');
      expect(preview).toBeEmptyDOMElement();
    });
  });

  it('should properly render preview on initial load with content', async () => {
    render(<Home />);
    
    const editor = screen.getByTestId('editor');
    
    // Set initial content
    fireEvent.change(editor, { target: { value: '# Initial Content' } });
    
    await waitFor(() => {
      const preview = screen.getByTestId('markdown-preview');
      expect(preview).toBeInTheDocument();
      expect(preview.innerHTML).toContain('<h1>Initial Content</h1>');
    });
  });

  it('should handle markdown tables in preview', async () => {
    render(<Home />);
    
    const editor = screen.getByTestId('editor');
    const markdown = `| Column 1 | Column 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |`;
    
    fireEvent.change(editor, { target: { value: markdown } });
    
    await waitFor(() => {
      const preview = screen.getByTestId('markdown-preview');
      expect(preview.innerHTML).toContain('<table>');
      expect(preview.innerHTML).toContain('<th>Column 1</th>');
      expect(preview.innerHTML).toContain('<td>Cell 1</td>');
    });
  });

  it('should update preview when reset button is clicked', async () => {
    render(<Home />);
    
    const editor = screen.getByTestId('editor');
    
    // Add content
    fireEvent.change(editor, { target: { value: '# Test Content' } });
    
    await waitFor(() => {
      const preview = screen.getByTestId('markdown-preview');
      expect(preview.innerHTML).toContain('<h1>Test Content</h1>');
    });
    
    // Click reset
    const resetButton = screen.getByText('リセット');
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      const preview = screen.getByTestId('markdown-preview');
      expect(preview).toBeEmptyDOMElement();
    });
  });
});