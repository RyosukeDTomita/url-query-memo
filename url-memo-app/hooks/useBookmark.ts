export function useBookmark(): {
  updateBookmark: (url: string) => void;
  hasBookmark: () => boolean;
} {
  const updateBookmark = (url: string) => {
    const message = `メモの保存について:

メモはURLのクエリパラメータに保存されています。
そのためURLを保存しておき、再度アクセスすることで現在のメモを復元することができます。

ブラウザのブックマークにメモを保存するのが想定される使い方になりますが、
メモを更新するたびにブックマークのURLを更新する必要があることにご留意ください。

【ブックマークの保存方法】
1. 新規作成: Ctrl+D (Windows/Linux) または Cmd+D (Mac)
2. 既存の更新: ブックマークマネージャーでURLを更新

現在のURL: ${url}`;

    alert(message);
  };

  const hasBookmark = (): boolean => {
    // ブラウザのセキュリティ制限により、
    // JavaScriptからブックマークの存在を確認することはできません
    return false;
  };

  return {
    updateBookmark,
    hasBookmark,
  };
}