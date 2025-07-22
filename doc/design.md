# 設計ドキュメント: URL メモアプリ

## 概要

URL メモアプリは、メモの内容を URL のクエリパラメータに保存するブラウザベースのアプリケーションです。ユーザーはメモを作成・編集し、保存ボタンを押すことで現在の URL をブックマークとして更新できます。これにより、ブラウザのブックマーク機能を利用して複数デバイス間でメモを同期したり、URL を共有するだけで他のユーザーとメモを共有することができます。

このアプリケーションは Next.js（TypeScript）で開発され、GitHub Pages でデプロイされます。

## アーキテクチャ

このアプリケーションはクライアントサイドのみで動作するシングルページアプリケーション（SPA）として設計されます。サーバーサイドの実装は不要です。

### 技術スタック

- **フロントエンド**: Next.js（TypeScript）
- **スタイリング**: CSS Modules または Tailwind CSS
- **デプロイ**: GitHub Pages
- **状態管理**: React の useState と useEffect フック
- **URL 操作**: Next.js の Router と window.history API

### アプリケーション構造

```
url-memo-app/
├── public/
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Editor.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ShareButton.tsx
│   │   ├── SaveButton.tsx
│   │   └── StatusMessage.tsx
│   ├── hooks/
│   │   ├── useUrlState.ts
│   │   └── useBookmark.ts
│   ├── utils/
│   │   ├── urlEncoder.ts
│   │   ├── urlDecoder.ts
│   │   └── clipboard.ts
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   └── index.tsx
│   └── styles/
│       ├── globals.css
│       └── Home.module.css
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## コンポーネントとインターフェース

### 主要コンポーネント

#### 1. Editor コンポーネント

メモの作成と編集を担当するメインコンポーネント。

```typescript
interface EditorProps {
  initialText: string;
  onChange: (text: string) => void;
  maxLength?: number;
}
```

#### 2. SaveButton コンポーネント

現在の URL をブックマークとして保存するための指示を表示するボタン。

```typescript
interface SaveButtonProps {
  currentUrl: string;
  onSave: () => void;
}
```

#### 3. ShareButton コンポーネント

現在の URL をクリップボードにコピーするボタン。

```typescript
interface ShareButtonProps {
  currentUrl: string;
  onShare: () => void;
}
```

#### 4. StatusMessage コンポーネント

ユーザーアクションに対するフィードバックを表示するコンポーネント。

```typescript
interface StatusMessageProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
```

### カスタムフック

#### 1. useUrlState フック

URL クエリパラメータと React の状態を同期させるカスタムフック。

```typescript
function useUrlState<T>(
  key: string,
  initialValue: T,
  options?: {
    encode?: (value: T) => string;
    decode?: (value: string) => T;
  }
): [T, (newValue: T) => void];
```

#### 2. useBookmark フック

ブックマークの操作を管理するカスタムフック。

```typescript
function useBookmark(): {
  updateBookmark: (url: string) => void;
  hasBookmark: () => boolean;
};
```

### ユーティリティ関数

#### 1. urlEncoder

メモのテキストを URL クエリパラメータに変換する関数。

```typescript
function encodeTextToUrl(text: string): string;
```

#### 2. urlDecoder

URL クエリパラメータからメモのテキストを復元する関数。

```typescript
function decodeTextFromUrl(urlParam: string): string;
```

#### 3. clipboard

テキストをクリップボードにコピーする関数。

```typescript
function copyToClipboard(text: string): Promise<boolean>;
```

## データモデル

このアプリケーションでは、主に以下のデータを扱います：

### メモデータ

```typescript
interface MemoData {
  text: string;
  lastModified: number; // タイムスタンプ
}
```

### アプリケーション状態

```typescript
interface AppState {
  memoData: MemoData;
  statusMessage: {
    text: string;
    type: 'success' | 'error' | 'info' | 'warning';
    visible: boolean;
  };
  isOffline: boolean;
}
```

## URL 構造

メモデータは URL のクエリパラメータとして保存されます：

```
https://example.com/?memo=エンコードされたメモテキスト&ts=タイムスタンプ
```

- `memo`: Base64 でエンコードされたメモのテキスト
- `ts`: 最終更新のタイムスタンプ（オプション）

## エラー処理

### 想定されるエラーシナリオ

1. **URL 長さ制限の超過**:
   - ブラウザの URL 長さ制限（約 2,000～8,000 文字）を超えた場合
   - 対応: 警告を表示し、テキストを分割するオプションを提供

2. **クリップボード操作の失敗**:
   - ブラウザの権限不足などでクリップボード操作が失敗した場合
   - 対応: エラーメッセージを表示し、手動でのコピー方法を案内

3. **オフライン状態**:
   - インターネット接続がない場合
   - 対応: オフライン状態を通知し、ローカルでの編集を許可

### エラー処理戦略

- ユーザーフレンドリーなエラーメッセージを表示
- 可能な場合は代替手段を提案
- エラー状態からの回復メカニズムを提供

## テスト戦略

### ユニットテスト

- **対象**: 個々のコンポーネント、フック、ユーティリティ関数
- **ツール**: Jest, React Testing Library
- **重点領域**:
  - URL エンコード/デコード関数
  - カスタムフックのロジック
  - コンポーネントの表示と動作

### 統合テスト

- **対象**: コンポーネント間の相互作用
- **ツール**: React Testing Library
- **重点領域**:
  - エディタとURL状態の同期
  - ボタンアクションとフィードバックメッセージ

### E2Eテスト

- **対象**: エンドツーエンドのユーザーフロー
- **ツール**: Cypress
- **重点領域**:
  - メモの作成から共有までの完全なフロー
  - ブックマーク更新プロセス
  - 異なるデバイスサイズでのレスポンシブ動作

## パフォーマンス最適化

1. **URL エンコーディングの最適化**:
   - 効率的なエンコーディング方式を使用（Base64 + 圧縮アルゴリズム）
   - 長いテキストの分割メカニズム

2. **レンダリングパフォーマンス**:
   - メモリ使用量の最適化
   - 不要な再レンダリングの防止

3. **オフラインサポート**:
   - Service Worker を使用したオフライン機能
   - ローカルでの状態保持

## セキュリティ考慮事項

1. **データプライバシー**:
   - URL パラメータは公開情報であることをユーザーに通知
   - 機密情報の入力に関する警告

2. **XSS 対策**:
   - ユーザー入力のサニタイズ
   - URL パラメータのエスケープ処理

3. **オプションの暗号化**:
   - 機密性の高いメモのための簡易暗号化オプション
   - パスワードベースの暗号化（オプション機能）

## アクセシビリティ

1. **キーボードナビゲーション**:
   - すべての機能をキーボードで操作可能に
   - ショートカットキーのサポート

2. **スクリーンリーダー対応**:
   - 適切な ARIA ラベルと役割
   - 意味のあるフォーカス順序

3. **コントラストと可読性**:
   - WCAG 2.1 AA 準拠のコントラスト比
   - 調整可能なフォントサイズ

## デプロイ戦略

GitHub Pages を使用してデプロイするための設定：

1. **Next.js の静的エクスポート**:
   - `next.config.js` で静的エクスポートを設定
   - `next export` コマンドを使用してビルド

2. **GitHub Actions ワークフロー**:
   - プッシュ時に自動ビルドとデプロイ
   - カスタムドメイン設定（オプション）

3. **SEO 最適化**:
   - 適切なメタタグ
   - OGP（Open Graph Protocol）タグ