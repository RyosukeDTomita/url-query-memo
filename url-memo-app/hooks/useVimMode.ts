import { useState, useCallback, KeyboardEvent as ReactKeyboardEvent } from 'react';

type VimMode = 'normal' | 'insert' | 'visual';

interface UseVimModeReturn {
  mode: VimMode;
  cursorPosition: number;
  text: string;
  register: string;
  handleKeyDown: (event: ReactKeyboardEvent | KeyboardEvent) => void;
  setText: (text: string) => void;
  setCursorPosition: (position: number) => void;
  setMode: (mode: VimMode) => void;
  setRegister: (content: string) => void;
}

export const useVimMode = (): UseVimModeReturn => {
  const [mode, setMode] = useState<VimMode>('normal');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [text, setText] = useState('');
  const [register, setRegister] = useState('');
  const [pendingCommand, setPendingCommand] = useState('');

  const getLineStart = useCallback((position: number): number => {
    const lastNewline = text.lastIndexOf('\n', position - 1);
    return lastNewline + 1;
  }, [text]);

  const getLineEnd = useCallback((position: number): number => {
    const nextNewline = text.indexOf('\n', position);
    return nextNewline === -1 ? text.length : nextNewline;
  }, [text]);

  const getCurrentLine = useCallback((position: number): { start: number; end: number; text: string } => {
    const start = getLineStart(position);
    const end = getLineEnd(position);
    return {
      start,
      end,
      text: text.substring(start, end)
    };
  }, [text, getLineStart, getLineEnd]);

  const moveLeft = useCallback(() => {
    setCursorPosition(prev => Math.max(0, prev - 1));
  }, []);

  const moveRight = useCallback(() => {
    setCursorPosition(prev => Math.min(text.length - 1, prev + 1));
  }, [text.length]);

  const moveUp = useCallback(() => {
    const currentLineStart = getLineStart(cursorPosition);
    if (currentLineStart === 0) return; // Already on first line

    const columnInLine = cursorPosition - currentLineStart;
    const prevLineEnd = currentLineStart - 1;
    const prevLineStart = getLineStart(prevLineEnd);
    const prevLineLength = prevLineEnd - prevLineStart;
    
    const newPosition = prevLineStart + Math.min(columnInLine, prevLineLength);
    setCursorPosition(newPosition);
  }, [cursorPosition, text, getLineStart]);

  const moveDown = useCallback(() => {
    const currentLineEnd = getLineEnd(cursorPosition);
    if (currentLineEnd === text.length) return; // Already on last line

    const currentLineStart = getLineStart(cursorPosition);
    const columnInLine = cursorPosition - currentLineStart;
    const nextLineStart = currentLineEnd + 1;
    const nextLineEnd = getLineEnd(nextLineStart);
    const nextLineLength = nextLineEnd - nextLineStart;
    
    const newPosition = nextLineStart + Math.min(columnInLine, nextLineLength);
    setCursorPosition(newPosition);
  }, [cursorPosition, text, getLineStart, getLineEnd]);

  const deleteCharacter = useCallback(() => {
    if (cursorPosition < text.length) {
      const newText = text.slice(0, cursorPosition) + text.slice(cursorPosition + 1);
      setText(newText);
    }
  }, [cursorPosition, text]);

  const deleteLine = useCallback(() => {
    const line = getCurrentLine(cursorPosition);
    let deletedLine: string;
    
    // Check if this is the last line without a newline
    if (line.end === text.length) {
      deletedLine = text.substring(line.start) + '\n';
    } else {
      deletedLine = text.substring(line.start, line.end + 1); // Include actual newline
    }
    
    setRegister(deletedLine);
    
    let newText: string;
    if (line.end === text.length) {
      // Last line without newline
      if (line.start === 0) {
        newText = '';
      } else {
        newText = text.slice(0, line.start - 1); // Remove previous newline too
      }
    } else {
      newText = text.slice(0, line.start) + text.slice(line.end + 1);
    }
    
    setText(newText);
    setCursorPosition(Math.min(line.start, Math.max(0, newText.length - 1)));
  }, [cursorPosition, text, getCurrentLine]);

  const yankLine = useCallback(() => {
    const line = getCurrentLine(cursorPosition);
    let yankedLine: string;
    
    // Check if this is the last line without a newline
    if (line.end === text.length) {
      yankedLine = text.substring(line.start) + '\n';
    } else {
      yankedLine = text.substring(line.start, line.end + 1); // Include actual newline
    }
    
    setRegister(yankedLine);
  }, [cursorPosition, text, getCurrentLine]);

  const paste = useCallback(() => {
    if (!register) return;
    
    const isLinewise = register.endsWith('\n');
    if (isLinewise) {
      const currentLineEnd = getLineEnd(cursorPosition);
      const newText = text.slice(0, currentLineEnd + 1) + register + text.slice(currentLineEnd + 1);
      setText(newText);
      setCursorPosition(currentLineEnd + 1);
    } else {
      const newText = text.slice(0, cursorPosition + 1) + register + text.slice(cursorPosition + 1);
      setText(newText);
      setCursorPosition(cursorPosition + 1);
    }
  }, [cursorPosition, text, register, getLineEnd]);

  const handleKeyDown = useCallback((event: ReactKeyboardEvent | KeyboardEvent) => {
    if (mode === 'insert') {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMode('normal');
      }
      return;
    }

    if (mode === 'normal') {
      event.preventDefault();

      // Handle pending commands
      if (pendingCommand) {
        const fullCommand = pendingCommand + event.key;
        setPendingCommand('');
        
        if (fullCommand === 'dd') {
          deleteLine();
          return;
        } else if (fullCommand === 'yy') {
          yankLine();
          return;
        }
      }

      switch (event.key) {
        case 'h':
          moveLeft();
          break;
        case 'j':
          moveDown();
          break;
        case 'k':
          moveUp();
          break;
        case 'l':
          moveRight();
          break;
        case 'i':
          setMode('insert');
          break;
        case 'a':
          setMode('insert');
          setCursorPosition(prev => Math.min(text.length, prev + 1));
          break;
        case 'o':
          const currentLineEnd = getLineEnd(cursorPosition);
          const newText = text.slice(0, currentLineEnd) + '\n' + text.slice(currentLineEnd);
          setText(newText);
          setCursorPosition(currentLineEnd + 1);
          setMode('insert');
          break;
        case 'x':
          deleteCharacter();
          break;
        case 'd':
        case 'y':
          setPendingCommand(event.key);
          break;
        case 'p':
          paste();
          break;
        case 'Escape':
          // Already in normal mode
          break;
      }
    }
  }, [mode, pendingCommand, moveLeft, moveDown, moveUp, moveRight, 
      deleteCharacter, deleteLine, yankLine, paste, cursorPosition, text, getLineEnd]);

  return {
    mode,
    cursorPosition,
    text,
    register,
    handleKeyDown,
    setText,
    setCursorPosition,
    setMode,
    setRegister,
  };
};