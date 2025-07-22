import React, { useState, useEffect, useRef } from 'react';

interface EditorProps {
  initialText: string;
  onChange: (text: string) => void;
  maxLength?: number;
}

export function Editor({ initialText, onChange, maxLength }: EditorProps) {
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea height
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange(newText);
  };

  const getCharacterCountClassName = () => {
    if (!maxLength) return '';
    
    const length = text.length;
    const ratio = length / maxLength;
    
    if (ratio > 1) return 'text-red-500';
    if (ratio >= 0.9) return 'text-orange-500';
    return 'text-black';
  };

  return (
    <div className="w-full">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        placeholder="ここにメモを入力してください..."
        aria-label="メモエディタ"
        maxLength={maxLength}
        className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
      />
      {maxLength && (
        <div className={`text-sm mt-2 text-right ${getCharacterCountClassName()}`}>
          {text.length} / {maxLength}
        </div>
      )}
    </div>
  );
}