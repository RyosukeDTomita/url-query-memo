# URLメモ

![mit license](https://img.shields.io/github/license/sigma/url-query-memo)

## INDEX

- [ABOUT](#about)
- [ENVIRONMENT](#environment)
- [PREPARING](#preparing)
- [HOW TO USE](#how-to-use)
- [FEATURES](#features)

---

## ABOUT

URLのクエリパラメータにメモの内容を保存するブラウザベースのメモアプリケーションです。サーバー不要で動作し、URLを保存・共有するだけで複数デバイス間でのメモ同期や他のユーザーとの共有が可能です。

https://sigma.github.io/url-query-memo/

---

## ENVIRONMENT

- [Next.js](https://nextjs.org/) 15
- TypeScript
- Tailwind CSS
- Jest + React Testing Library
- GitHub Pages

---

## PREPARING

### Local environment

```shell
cd url-memo-app
npm install
```

```shell
npm run dev
```

go to http://localhost:3000/url-query-memo/

### GitHub settings

1. GitHub Pages --> Build and deployment --> SourceをGitHub Actionsに
2. Actions --> Workflow permissions --> Read and write permissions

### Deploy to GitHub Pages via GitHub Actions

1. push to main branch
2. go to https://sigma.github.io/url-query-memo/

---

## HOW TO USE

1. **メモの作成・編集**
   - テキストエリアにメモを入力
   - 変更は自動的にURLに反映される

2. **保存**
   - 「ブックマークに保存」ボタンをクリック
   - 表示される指示に従ってブラウザのブックマークを更新

3. **共有**
   - 「共有」ボタンでURLをクリップボードにコピー
   - URLを他の人に送信してメモを共有

---

## FEATURES

- 📝 **シンプルなメモ作成**: テキストエリアにメモを入力するだけ
- 🔗 **URLベースの保存**: メモの内容が自動的にURLに保存される
- 🔖 **ブックマーク連携**: ブラウザのブックマーク機能で複数デバイス間同期
- 🌐 **簡単共有**: URLを共有するだけでメモを他の人と共有
- 📱 **レスポンシブデザイン**: モバイルデバイスにも対応
- 🔒 **プライバシー配慮**: データの暗号化と注意喚起
- ⚡ **軽量・高速**: Next.js + TypeScriptで高いパフォーマンス
- 🧪 **テスト駆動開発**: 79個のテストで品質を保証

## セキュリティとプライバシー

⚠️ **重要**: メモの内容はURLに含まれるため、以下の点にご注意ください：

- 機密情報（パスワード、個人情報等）は入力しないでください
- URLを共有する際は、内容が第三者に見られる可能性があります
- ブラウザの履歴にメモの内容が残ります
