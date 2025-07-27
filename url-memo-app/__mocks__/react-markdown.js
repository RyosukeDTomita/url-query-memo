// Mock for react-markdown
const React = require('react');

const ReactMarkdown = ({ children, components }) => {
  if (!children) return null;
  
  // Simple mock that renders children as plain text
  return React.createElement('div', { 
    'data-testid': 'react-markdown',
    dangerouslySetInnerHTML: { __html: children }
  });
};

module.exports = ReactMarkdown;
module.exports.default = ReactMarkdown;