'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { CodeMirrorVimEditor } from '@/components/CodeMirrorVimEditor';
import { SaveButton } from '@/components/SaveButton';
import { ShareButton } from '@/components/ShareButton';
import { ResetButton } from '@/components/ResetButton';
import { StatusMessage } from '@/components/StatusMessage';
import { SplitLayout } from '@/components/SplitLayout';
import { MarkdownPreview } from '@/components/MarkdownPreview';
import { useUrlState } from '@/hooks/useUrlState';
import { useBookmark } from '@/hooks/useBookmark';
import { encodeTextToUrl } from '@/utils/urlEncoder';
import { decodeTextFromUrl } from '@/utils/urlDecoder';

const URL_LENGTH_LIMIT = 8192; // 8KB - supported by most modern browsers and servers

interface StatusMessageState {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
}

function MemoApp() {
  const [statusMessage, setStatusMessage] = useState<StatusMessageState>({
    message: '',
    type: 'info',
    visible: false,
  });

  const [memoText, setMemoText] = useUrlState('memo', '', {
    encode: encodeTextToUrl,
    decode: decodeTextFromUrl,
  });

  const { updateBookmark } = useBookmark();

  const showStatusMessage = (message: string, type: StatusMessageState['type']) => {
    setStatusMessage({ message, type, visible: true });
    setTimeout(() => {
      setStatusMessage(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const handleMemoChange = (text: string) => {
    try {
      const encodedLength = encodeTextToUrl(text).length;
      if (encodedLength > URL_LENGTH_LIMIT) {
        showStatusMessage(
          'メモが長すぎます。URLの制限を超えてしまいます。',
          'warning'
        );
        return;
      }
      setMemoText(text);
    } catch (error) {
      showStatusMessage(
        'メモの保存に失敗しました。',
        'error'
      );
    }
  };

  const handleSave = () => {
    const currentUrl = window.location.href;
    updateBookmark(currentUrl);
    showStatusMessage('ブックマークの更新方法が表示されました。', 'success');
  };

  const handleShare = () => {
    showStatusMessage('URLがクリップボードにコピーされました。', 'success');
  };

  const handleReset = () => {
    setMemoText('');
    // Clear URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('memo');
    window.history.replaceState({}, '', url.toString());
    showStatusMessage('メモがリセットされました。', 'info');
  };

  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            URLメモ
          </h1>
          <p className="text-black mb-4">
            メモをURLに保存して、どこからでもアクセス。共有も簡単。
          </p>
          <a 
            href="https://github.com/RyosukeDTomita/url-query-memo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">GitHub</span>
          </a>
        </header>

        {/* Status Message */}
        {statusMessage.visible && (
          <div className="mb-6">
            <StatusMessage
              message={statusMessage.message}
              type={statusMessage.type}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-2 mb-6 h-[70vh]">
          <SplitLayout>
            <CodeMirrorVimEditor
              initialText={memoText}
              onChange={handleMemoChange}
              maxLength={5000} // Increased limit with compression
            />
            <MarkdownPreview content={memoText} />
          </SplitLayout>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <SaveButton
            currentUrl={getCurrentUrl()}
            onSave={handleSave}
          />
          <ShareButton
            currentUrl={getCurrentUrl()}
            onShare={handleShare}
          />
          <ResetButton
            onReset={handleReset}
          />
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-black mb-2">
            使い方
          </h2>
          <ul className="text-black space-y-1 text-sm">
            <li>• テキストエリアにメモを入力すると、自動的にURLに保存されます</li>
            <li>• 「ブックマークに保存」ボタンでブックマークを更新できます</li>
            <li>• 「共有」ボタンでURLをクリップボードにコピーできます</li>
            <li>• このURLを保存したり共有すれば、どこからでもメモにアクセスできます</li>
            <li>• Vimモードは青色のボタンからオフにできます</li>
          </ul>
        </div>

        {/* Privacy Notice */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-black mb-1">
            プライバシーについて
          </h3>
          <p className="text-black text-xs">
            メモの内容はURLに含まれるため、機密情報は入力しないでください。
            URLを共有する際は、内容が第三者に見られる可能性があることをご注意ください。
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-black">読み込み中...</div>
    </div>}>
      <MemoApp />
    </Suspense>
  );
}