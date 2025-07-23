import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVimMode } from '../hooks/useVimMode';

interface VimEditorProps {
  initialText: string;
  onChange: (text: string) => void;
  maxLength?: number;
}

export function VimEditor({ initialText, onChange, maxLength }: VimEditorProps) {
  const vim = useVimMode();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isVimEnabled, setIsVimEnabled] = useState(true);

  useEffect(() => {
    vim.setText(initialText);
  }, [initialText, vim]);

  useEffect(() => {
    if (textareaRef.current) {
      // Auto-resize textarea height
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [vim.text]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.setSelectionRange(vim.cursorPosition, vim.cursorPosition);
    }
  }, [vim.cursorPosition]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isVimEnabled || vim.mode === 'insert') {
      const newText = e.target.value;
      vim.setText(newText);
      onChange(newText);
      
      // Update cursor position based on selection
      const newPosition = e.target.selectionStart || 0;
      vim.setCursorPosition(newPosition);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isVimEnabled) {
      // Let vim mode handle the key
      vim.handleKeyDown(e);
      
      // If in normal mode, prevent default behavior
      if (vim.mode === 'normal') {
        e.preventDefault();
      }
      
      // Update the parent component with any text changes
      if (vim.text !== textareaRef.current?.value) {
        onChange(vim.text);
      }
    }
  };

  const handleSelectionChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    if (!isVimEnabled || vim.mode === 'insert') {
      const target = e.target as HTMLTextAreaElement;
      vim.setCursorPosition(target.selectionStart || 0);
    }
  };

  const getModeIndicator = () => {
    if (!isVimEnabled) return null;
    
    const modeColors = {
      normal: 'bg-blue-500',
      insert: 'bg-green-500',
      visual: 'bg-purple-500'
    };
    
    return (
      <div className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded ${modeColors[vim.mode]}`}>
        {vim.mode.toUpperCase()}
      </div>
    );
  };

  const getCharacterCountClassName = () => {
    if (!maxLength) return '';
    
    const length = vim.text.length;
    const ratio = length / maxLength;
    
    if (ratio > 1) return 'text-red-500';
    if (ratio >= 0.9) return 'text-orange-500';
    return 'text-black';
  };

  return (
    <div className="w-full relative">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={vim.text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          placeholder="ここにメモを入力してください..."
          aria-label="Vimモード付きメモエディタ"
          maxLength={maxLength}
          className={`w-full min-h-[200px] p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black ${
            vim.mode === 'normal' ? 'caret-transparent' : ''
          } ${vim.mode === 'normal' ? 'border-blue-500' : 'border-gray-300'}`}
        />
        {getModeIndicator()}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => setIsVimEnabled(!isVimEnabled)}
          className="text-sm text-gray-600 hover:text-gray-800"
          type="button"
        >
          Vim Mode: {isVimEnabled ? 'ON' : 'OFF'}
        </button>
        
        {maxLength && (
          <div className={`text-sm ${getCharacterCountClassName()}`}>
            {vim.text.length} / {maxLength}
          </div>
        )}
      </div>
    </div>
  );
}