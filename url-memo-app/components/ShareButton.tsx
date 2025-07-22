import React from 'react';
import { copyToClipboard } from '@/utils/clipboard';

interface ShareButtonProps {
  currentUrl: string;
  onShare: () => void;
  disabled?: boolean;
}

export function ShareButton({ currentUrl, onShare, disabled = false }: ShareButtonProps) {
  const handleClick = async () => {
    if (disabled) return;

    try {
      await copyToClipboard(currentUrl);
      onShare();
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      onShare(); // Still call onShare to show message
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      aria-label="共有"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        px-4 py-2 bg-green-600 text-white rounded-lg 
        hover:bg-green-700 focus:outline-none focus:ring-2 
        focus:ring-green-500 focus:ring-offset-2 transition-colors
        flex items-center gap-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span>🔗</span>
      <span>共有</span>
    </button>
  );
}