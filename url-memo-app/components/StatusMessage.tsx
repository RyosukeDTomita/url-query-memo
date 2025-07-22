import React, { useState, useEffect } from 'react';

interface StatusMessageProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export function StatusMessage({ message, type, duration = 5000 }: StatusMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!message || !isVisible) {
    return null;
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div
      role="alert"
      className={`p-4 border rounded-lg flex items-center gap-2 ${getTypeStyles()}`}
    >
      <span className="flex-shrink-0 font-semibold">
        {getIcon()}
      </span>
      <span className="flex-1">
        {message}
      </span>
    </div>
  );
}