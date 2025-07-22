'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Editor } from '@/components/Editor';
import { SaveButton } from '@/components/SaveButton';
import { ShareButton } from '@/components/ShareButton';
import { ResetButton } from '@/components/ResetButton';
import { StatusMessage } from '@/components/StatusMessage';
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            URLメモ
          </h1>
          <p className="text-black">
            メモをURLに保存して、どこからでもアクセス。共有も簡単。
          </p>
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
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <Editor
            initialText={memoText}
            onChange={handleMemoChange}
            maxLength={5000} // Increased limit with compression
          />
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