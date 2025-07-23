import { renderHook, act } from '@testing-library/react';
import { useVimMode } from '../../hooks/useVimMode';

describe('useVimMode', () => {
  describe('Normal Mode', () => {
    describe('Movement Keys', () => {
      it('should move cursor left with h key', () => {
        const { result } = renderHook(() => useVimMode());
        
        // Set initial text and cursor position
        act(() => {
          result.current.setText('Hello World');
          result.current.setCursorPosition(5); // cursor at space
        });
        
        // Press h key
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'h' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.cursorPosition).toBe(4);
        expect(result.current.mode).toBe('normal');
      });

      it('should move cursor down with j key', () => {
        const { result } = renderHook(() => useVimMode());
        
        // Set initial text with multiple lines
        act(() => {
          result.current.setText('Line 1\nLine 2\nLine 3');
          result.current.setCursorPosition(3); // cursor in first line
        });
        
        // Press j key
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'j' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.cursorPosition).toBe(10); // 3 + 7 (to maintain column position)
      });

      it('should move cursor up with k key', () => {
        const { result } = renderHook(() => useVimMode());
        
        // Set initial text with multiple lines
        act(() => {
          result.current.setText('Line 1\nLine 2\nLine 3');
          result.current.setCursorPosition(10); // cursor in second line
        });
        
        // Press k key
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'k' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.cursorPosition).toBe(3); // back to first line
      });

      it('should move cursor right with l key', () => {
        const { result } = renderHook(() => useVimMode());
        
        // Set initial text and cursor position
        act(() => {
          result.current.setText('Hello World');
          result.current.setCursorPosition(0);
        });
        
        // Press l key
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'l' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.cursorPosition).toBe(1);
      });

      it('should not move beyond text boundaries', () => {
        const { result } = renderHook(() => useVimMode());
        
        act(() => {
          result.current.setText('Test');
          result.current.setCursorPosition(0);
        });
        
        // Try to move left at start
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'h' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.cursorPosition).toBe(0);
        
        // Move to end
        act(() => {
          result.current.setCursorPosition(3);
        });
        
        // Try to move right at end
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'l' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.cursorPosition).toBe(3);
      });
    });

    describe('Mode Switching', () => {
      it('should switch to insert mode with i key', () => {
        const { result } = renderHook(() => useVimMode());
        
        act(() => {
          result.current.setText('Hello');
          result.current.setCursorPosition(2);
        });
        
        // Press i key
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'i' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.mode).toBe('insert');
        expect(result.current.cursorPosition).toBe(2); // cursor doesn't move
      });

      it('should switch to insert mode after cursor with a key', () => {
        const { result } = renderHook(() => useVimMode());
        
        act(() => {
          result.current.setText('Hello');
          result.current.setCursorPosition(2);
        });
        
        // Press a key
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'a' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.mode).toBe('insert');
        expect(result.current.cursorPosition).toBe(3); // cursor moves forward
      });

      it('should create new line below and enter insert mode with o key', () => {
        const { result } = renderHook(() => useVimMode());
        
        act(() => {
          result.current.setText('Line 1\nLine 2');
          result.current.setCursorPosition(3); // in first line
        });
        
        // Press o key
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'o' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.mode).toBe('insert');
        expect(result.current.text).toBe('Line 1\n\nLine 2');
        expect(result.current.cursorPosition).toBe(7); // at start of new line
      });

      it('should return to normal mode with Escape key', () => {
        const { result } = renderHook(() => useVimMode());
        
        // Start in insert mode
        act(() => {
          result.current.setText('Hello');
          result.current.setMode('insert');
        });
        
        // Press Escape
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'Escape' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.mode).toBe('normal');
      });
    });

    describe('Delete/Copy/Paste Operations', () => {
      it('should delete character under cursor with x key', () => {
        const { result } = renderHook(() => useVimMode());
        
        act(() => {
          result.current.setText('Hello');
          result.current.setCursorPosition(1);
        });
        
        // Press x key
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'x' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.text).toBe('Hllo');
        expect(result.current.cursorPosition).toBe(1);
      });

      it.skip('should delete entire line with dd', () => {
        const { result } = renderHook(() => useVimMode());
        
        act(() => {
          result.current.setText('Line 1\nLine 2\nLine 3');
          result.current.setCursorPosition(8); // in second line
        });
        
        // Press d twice
        act(() => {
          const event1 = new KeyboardEvent('keydown', { key: 'd' });
          result.current.handleKeyDown(event1);
          const event2 = new KeyboardEvent('keydown', { key: 'd' });
          result.current.handleKeyDown(event2);
        });
        
        expect(result.current.text).toBe('Line 1\nLine 3');
        expect(result.current.register).toBe('Line 2\n'); // deleted line in register
      });

      it.skip('should yank entire line with yy', () => {
        const { result } = renderHook(() => useVimMode());
        
        act(() => {
          result.current.setText('Line 1\nLine 2\nLine 3');
          result.current.setCursorPosition(8); // in second line
        });
        
        // Press y twice
        act(() => {
          const event1 = new KeyboardEvent('keydown', { key: 'y' });
          result.current.handleKeyDown(event1);
          const event2 = new KeyboardEvent('keydown', { key: 'y' });
          result.current.handleKeyDown(event2);
        });
        
        expect(result.current.text).toBe('Line 1\nLine 2\nLine 3'); // text unchanged
        expect(result.current.register).toBe('Line 2\n'); // yanked line in register
      });

      it('should paste after cursor with p key', () => {
        const { result } = renderHook(() => useVimMode());
        
        act(() => {
          result.current.setText('Line 1\nLine 3');
          result.current.setCursorPosition(0);
          result.current.setRegister('Line 2\n');
        });
        
        // Press p key
        act(() => {
          const event = new KeyboardEvent('keydown', { key: 'p' });
          result.current.handleKeyDown(event);
        });
        
        expect(result.current.text).toBe('Line 1\nLine 2\nLine 3');
      });
    });
  });

  describe('Insert Mode', () => {
    it('should allow typing in insert mode', () => {
      const { result } = renderHook(() => useVimMode());
      
      act(() => {
        result.current.setText('Hello');
        result.current.setMode('insert');
        result.current.setCursorPosition(5);
      });
      
      // Type a character
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'a' });
        result.current.handleKeyDown(event);
      });
      
      // In insert mode, regular keys should not be handled by vim mode
      expect(result.current.text).toBe('Hello'); // text unchanged
    });

    it('should exit insert mode on Escape', () => {
      const { result } = renderHook(() => useVimMode());
      
      act(() => {
        result.current.setMode('insert');
      });
      
      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        result.current.handleKeyDown(event);
      });
      
      expect(result.current.mode).toBe('normal');
    });
  });
});