module.exports = {
  marked: {
    parse: jest.fn((text) => {
      if (!text) return '';
      
      // Handle lists first
      let html = text;
      
      // Convert unordered lists
      const unorderedListRegex = /^- (.+)$/gm;
      const unorderedMatches = [...text.matchAll(unorderedListRegex)];
      if (unorderedMatches.length > 0) {
        let listItems = '';
        unorderedMatches.forEach(match => {
          listItems += `<li>${match[1]}</li>`;
        });
        html = html.replace(unorderedListRegex, '');
        html += `<ul>${listItems}</ul>`;
      }
      
      // Convert ordered lists
      const orderedListRegex = /^\d+\. (.+)$/gm;
      const orderedMatches = [...text.matchAll(orderedListRegex)];
      if (orderedMatches.length > 0) {
        let listItems = '';
        orderedMatches.forEach(match => {
          listItems += `<li>${match[1]}</li>`;
        });
        html = html.replace(orderedListRegex, '');
        html += `<ol>${listItems}</ol>`;
      }
      
      // Other conversions
      html = html
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/```javascript\n([^`]+)\n```/g, '<pre><code>$1</code></pre>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^---$/gm, '<hr>');
      
      // Handle tables
      if (text.includes('|')) {
        const lines = text.split('\n');
        let inTable = false;
        let tableHtml = '';
        
        lines.forEach((line, index) => {
          if (line.includes('|') && !line.includes('---')) {
            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
            if (!inTable) {
              tableHtml = '<table><thead><tr>';
              cells.forEach(cell => {
                tableHtml += `<th>${cell}</th>`;
              });
              tableHtml += '</tr></thead><tbody>';
              inTable = true;
            } else if (index > 1) {
              tableHtml += '<tr>';
              cells.forEach(cell => {
                tableHtml += `<td>${cell}</td>`;
              });
              tableHtml += '</tr>';
            }
          }
        });
        
        if (inTable) {
          tableHtml += '</tbody></table>';
          return tableHtml;
        }
      }
      
      // Wrap non-HTML content in paragraphs
      const lines = html.split('\n').filter(line => line.trim());
      html = lines.map(line => {
        if (!line.match(/^<[^>]+>/)) {
          return `<p>${line}</p>`;
        }
        return line;
      }).join('');
      
      return html;
    }),
    setOptions: jest.fn(),
  },
};