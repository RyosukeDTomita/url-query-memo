export function useBookmark(): {
  updateBookmark: (url: string) => void;
  hasBookmark: () => boolean;
} {
  const updateBookmark = (url: string) => {
    const message = `ブックマークを更新してください:

1. 既存のブックマークがある場合:
   - ブックマークマネージャーを開く
   - このページのブックマークを見つける
   - URLを以下に更新: ${url}

2. 新しくブックマークを作成する場合:
   - Ctrl+D (Windows/Linux) または Cmd+D (Mac) を押す
   - ブックマークの名前を入力
   - 保存先フォルダを選択
   - 保存をクリック

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