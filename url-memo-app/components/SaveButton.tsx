import React from 'react';

interface SaveButtonProps {
  currentUrl: string;
  onSave: () => void;
  disabled?: boolean;
}

export function SaveButton({ currentUrl, onSave, disabled = false }: SaveButtonProps) {
  const handleClick = () => {
    if (!disabled) {
      onSave();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <button
      type="button"
      aria-label="メモを保存"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        px-4 py-2 bg-blue-600 text-white rounded-lg 
        hover:bg-blue-700 focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-offset-2 transition-colors
        flex items-center gap-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span>💾</span>
      <span>メモを保存</span>
    </button>
  );
}