import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MarkdownPreview } from '../../components/MarkdownPreview';

describe('MarkdownPreview', () => {
  it('should render plain text as paragraph', () => {
    render(<MarkdownPreview content="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should render markdown headings correctly', () => {
    const markdown = `# Heading 1
## Heading 2
### Heading 3`;
    
    render(<MarkdownPreview content={markdown} />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });
    const h3 = screen.getByRole('heading', { level: 3 });
    
    expect(h1).toHaveTextContent('Heading 1');
    expect(h2).toHaveTextContent('Heading 2');
    expect(h3).toHaveTextContent('Heading 3');
  });

  it('should render bold and italic text', () => {
    const markdown = '**Bold text** and *italic text*';
    render(<MarkdownPreview content={markdown} />);
    
    const boldText = screen.getByText('Bold text');
    const italicText = screen.getByText('italic text');
    
    expect(boldText.tagName).toBe('STRONG');
    expect(italicText.tagName).toBe('EM');
  });

  it('should render links correctly', () => {
    const markdown = '[OpenAI](https://openai.com)';
    render(<MarkdownPreview content={markdown} />);
    
    const link = screen.getByRole('link', { name: 'OpenAI' });
    expect(link).toHaveAttribute('href', 'https://openai.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render code blocks with syntax highlighting', () => {
    const markdown = '```javascript\nconst hello = "world";\n```';
    render(<MarkdownPreview content={markdown} />);
    
    const preview = screen.getByTestId('markdown-preview');
    expect(preview.innerHTML).toContain('<pre><code>const hello = "world";</code></pre>');
  });

  it('should render inline code', () => {
    const markdown = 'Use `npm install` to install dependencies';
    render(<MarkdownPreview content={markdown} />);
    
    const inlineCode = screen.getByText('npm install');
    expect(inlineCode.tagName).toBe('CODE');
  });

  it('should render lists correctly', () => {
    const unorderedMarkdown = `- Item 1
- Item 2
- Item 3`;

    const orderedMarkdown = `1. First item
2. Second item
3. Third item`;

    const { rerender } = render(<MarkdownPreview content={unorderedMarkdown} />);
    let preview = screen.getByTestId('markdown-preview');
    expect(preview.innerHTML).toContain('<ul>');
    expect(preview.innerHTML).toContain('<li>Item 1</li>');
    expect(preview.innerHTML).toContain('<li>Item 2</li>');
    expect(preview.innerHTML).toContain('<li>Item 3</li>');
    
    rerender(<MarkdownPreview content={orderedMarkdown} />);
    preview = screen.getByTestId('markdown-preview');
    expect(preview.innerHTML).toContain('<ol>');
    expect(preview.innerHTML).toContain('<li>First item</li>');
    expect(preview.innerHTML).toContain('<li>Second item</li>');
    expect(preview.innerHTML).toContain('<li>Third item</li>');
  });

  it('should render blockquotes', () => {
    const markdown = '> This is a blockquote';
    render(<MarkdownPreview content={markdown} />);
    
    const blockquote = screen.getByText('This is a blockquote').closest('blockquote');
    expect(blockquote).toBeInTheDocument();
  });

  it('should render horizontal rules', () => {
    const markdown = 'Text above\n\n---\n\nText below';
    const { container } = render(<MarkdownPreview content={markdown} />);
    
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
  });

  it('should render tables', () => {
    const markdown = `| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |`;

    render(<MarkdownPreview content={markdown} />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent('Header 1');
    expect(headers[1]).toHaveTextContent('Header 2');
  });

  it('should handle empty content', () => {
    render(<MarkdownPreview content="" />);
    const preview = screen.getByTestId('markdown-preview');
    expect(preview).toBeEmptyDOMElement();
  });

  it('should handle null content', () => {
    render(<MarkdownPreview content={null as any} />);
    const preview = screen.getByTestId('markdown-preview');
    expect(preview).toBeEmptyDOMElement();
  });

  it('should sanitize dangerous HTML', () => {
    const markdown = '<script>alert("XSS")</script><b>Safe text</b>';
    render(<MarkdownPreview content={markdown} />);
    
    expect(screen.queryByText('alert("XSS")')).not.toBeInTheDocument();
    expect(screen.getByText('Safe text')).toBeInTheDocument();
  });

  it('should have proper styling classes', () => {
    render(<MarkdownPreview content="# Test" />);
    
    const preview = screen.getByTestId('markdown-preview');
    expect(preview).toHaveClass('prose');
    expect(preview).toHaveClass('prose-sm');
    expect(preview).toHaveClass('max-w-none');
  });
});