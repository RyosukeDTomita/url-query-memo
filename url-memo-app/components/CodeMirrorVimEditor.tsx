'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { vim, Vim, getCM } from '@replit/codemirror-vim';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';

interface CodeMirrorVimEditorProps {
  initialText: string;
  onChange: (text: string) => void;
  maxLength?: number;
}

export function CodeMirrorVimEditor({ initialText, onChange, maxLength }: CodeMirrorVimEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isVimEnabled, setIsVimEnabled] = useState(true);
  const [vimMode, setVimMode] = useState<string>('normal');
  const [charCount, setCharCount] = useState(initialText.length);

  useEffect(() => {
    if (!editorRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const text = update.state.doc.toString();
        onChange(text);
        setCharCount(text.length);
      }
    });

    const vimStatusUpdate = EditorView.updateListener.of(() => {
      if (viewRef.current && isVimEnabled) {
        const cm = getCM(viewRef.current);
        const mode = cm?.state?.vim?.mode || 'normal';
        setVimMode(mode);
      }
    });

    const extensions = [
      updateListener,
      vimStatusUpdate,
      basicSetup,
      EditorView.theme({
        '&': {
          fontSize: '14px',
          minHeight: '200px',
        },
        '.cm-content': {
          padding: '16px',
          minHeight: '200px',
          color: '#000000', // 黒色のテキスト
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-editor.cm-focused': {
          outline: '2px solid rgb(59 130 246)',
          borderRadius: '0.5rem',
        },
        '.cm-editor': {
          border: '1px solid rgb(209 213 219)',
          borderRadius: '0.5rem',
          backgroundColor: '#ffffff',
        },
        // Visual mode selection styling
        '.cm-selectionBackground': {
          backgroundColor: 'rgba(59, 130, 246, 0.3) !important',
        },
        // カーソルと行番号も黒色に
        '.cm-cursor': {
          borderLeftColor: '#000000',
        },
        '.cm-gutters': {
          color: '#000000',
        },
      }),
      EditorView.lineWrapping,
    ];

    // Add vim extension at the beginning if enabled
    if (isVimEnabled) {
      extensions.unshift(vim());
    } else {
      extensions.push(keymap.of(defaultKeymap));
    }

    const state = EditorState.create({
      doc: initialText,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // Set up custom Ex commands
    if (isVimEnabled) {
      const cm = getCM(view);
      // Custom save command
      Vim.defineEx('write', 'w', () => {
        console.log('Save command triggered');
      });
      
      // Map jj to escape in insert mode for convenience
      Vim.map('jj', '<Esc>', 'insert');
    }

    return () => {
      view.destroy();
    };
  }, [isVimEnabled]);

  // Update content when initialText changes
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== initialText) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: initialText,
        },
      });
    }
  }, [initialText]);

  const toggleVimMode = () => {
    setIsVimEnabled(!isVimEnabled);
  };

  const getModeIndicator = () => {
    if (!isVimEnabled) return null;
    
    const modeColors: Record<string, string> = {
      normal: 'bg-blue-500',
      insert: 'bg-green-500',
      visual: 'bg-purple-500',
      replace: 'bg-orange-500',
    };
    
    const modeDisplay = vimMode.charAt(0).toUpperCase() + vimMode.slice(1);
    
    return (
      <div className={`absolute top-2 right-2 px-2 py-1 text-xs text-white rounded ${modeColors[vimMode] || 'bg-gray-500'}`}>
        {modeDisplay.toUpperCase()}
      </div>
    );
  };

  const getCharacterCountClassName = () => {
    if (!maxLength) return '';
    
    const ratio = charCount / maxLength;
    
    if (ratio > 1) return 'text-red-500';
    if (ratio >= 0.9) return 'text-orange-500';
    return 'text-black';
  };

  return (
    <div className="w-full relative">
      <div className="relative">
        <div ref={editorRef} className="w-full" />
        {getModeIndicator()}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={toggleVimMode}
          className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
            isVimEnabled 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
          type="button"
        >
          Vim Mode: {isVimEnabled ? 'ON' : 'OFF'}
        </button>
        
        {maxLength && (
          <div className={`text-sm ${getCharacterCountClassName()}`}>
            {charCount} / {maxLength}
          </div>
        )}
      </div>
      
      {isVimEnabled && (
        <div className="text-xs text-gray-500 mt-1">
          ヒント: escでノーマルモードに戻る。i、aでインサートモードに入る。保存はvimモードからできません。
        </div>
      )}
    </div>
  );
}