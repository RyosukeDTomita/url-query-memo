import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  return (
    <div
      data-testid="markdown-preview"
      className="markdown-preview w-full h-full overflow-auto p-4 text-black"
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '16px',
        lineHeight: '1.6',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom components for better styling
          h1: ({ children }) => <h1 className="text-3xl font-bold mb-4 text-black">{children}</h1>,
          h2: ({ children }) => <h2 className="text-2xl font-bold mb-3 text-black">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xl font-bold mb-2 text-black">{children}</h3>,
          p: ({ children }) => <p className="mb-3 text-black">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-3 text-black">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 text-black">{children}</ol>,
          li: ({ children }) => <li className="mb-1 text-black">{children}</li>,
          strong: ({ children }) => <strong className="font-bold text-black">{children}</strong>,
          em: ({ children }) => <em className="italic text-black">{children}</em>,
          code: ({ children }) => (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-black font-mono text-sm">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-3">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-3 text-black">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-blue-600 underline hover:text-blue-800" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          hr: () => <hr className="border-gray-300 my-4" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};