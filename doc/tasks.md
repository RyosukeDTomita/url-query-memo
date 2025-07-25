# 実装計画

- [ ] 1. プロジェクト構造のセットアップ
  - Next.jsプロジェクトの初期化（TypeScript設定含む）
  - 必要なディレクトリ構造の作成
  - GitHub Pagesデプロイ用の設定
  - _要件: 全体_

- [ ] 2. URLエンコーディング/デコーディングユーティリティの実装
  - [ ] 2.1 テキストをURLクエリパラメータにエンコードする関数の実装
    - Base64エンコーディングの実装
    - 長いテキストの処理方法の実装
    - エンコード関数のユニットテスト作成
    - _要件: 2.1, 2.3_
  
  - [ ] 2.2 URLクエリパラメータからテキストをデコードする関数の実装
    - Base64デコーディングの実装
    - デコード関数のユニットテスト作成
    - _要件: 1.4, 2.3_

- [ ] 3. カスタムフックの実装
  - [ ] 3.1 useUrlStateフックの実装
    - URLクエリパラメータと状態の同期ロジック
    - 状態変更時のURL更新ロジック
    - フックのユニットテスト作成
    - _要件: 2.1, 2.2_
  
  - [ ] 3.2 useBookmarkフックの実装
    - ブックマーク更新のロジック
    - ブックマーク存在確認のロジック
    - フックのユニットテスト作成
    - _要件: 3.1, 3.2, 3.3_

- [ ] 4. コアコンポーネントの実装
  - [ ] 4.1 Editorコンポーネントの実装
    - テキスト入力エリアの実装
    - リアルタイム編集機能の実装
    - 文字数制限と警告表示の実装
    - コンポーネントのユニットテスト作成
    - _要件: 1.1, 1.2, 1.3, 2.4_
  
  - [ ] 4.2 SaveButtonコンポーネントの実装
    - ブックマーク更新指示UIの実装
    - ブックマーク作成ガイダンスの実装
    - コンポーネントのユニットテスト作成
    - _要件: 3.1, 3.2, 3.3_
  
  - [ ] 4.3 ShareButtonコンポーネントの実装
    - クリップボードコピー機能の実装
    - 成功/失敗フィードバックの実装
    - コンポーネントのユニットテスト作成
    - _要件: 4.1, 4.2_
  
  - [ ] 4.4 StatusMessageコンポーネントの実装
    - 通知メッセージ表示の実装
    - タイプ別スタイリングの実装
    - 自動消去機能の実装
    - コンポーネントのユニットテスト作成
    - _要件: 3.3, 4.2, 5.3_

- [ ] 5. メインページの実装
  - [ ] 5.1 レイアウトとスタイリングの実装
    - レスポンシブデザインの実装
    - アクセシビリティ対応
    - ダークモード/ライトモードの実装（オプション）
    - _要件: 5.1, 5.2, 5.3_
  
  - [ ] 5.2 コンポーネントの統合
    - 各コンポーネントの配置と接続
    - 状態管理の統合
    - イベントハンドラの接続
    - _要件: 全体_

- [ ] 6. オフライン機能の実装
  - [ ] 6.1 オフライン状態検出の実装
    - ネットワーク状態監視の実装
    - オフライン通知UIの実装
    - _要件: 6.1, 6.2_
  
  - [ ] 6.2 オフラインでの編集機能の実装
    - ローカルでの状態保持の実装
    - オンライン復帰時の同期ロジック
    - _要件: 6.1, 6.2, 6.3_

- [ ] 7. セキュリティとプライバシー機能の実装
  - [ ] 7.1 データプライバシー警告の実装
    - プライバシーリスク通知UIの実装
    - _要件: 7.2_
  
  - [ ] 7.2 オプションの暗号化機能の実装
    - 簡易暗号化ロジックの実装
    - 暗号化/復号化UIの実装
    - _要件: 7.1, 7.3_

- [ ] 8. テストとデバッグ
  - [ ] 8.1 統合テストの実装
    - コンポーネント間の相互作用テスト
    - フォーム送信とURL更新のテスト
    - _要件: 全体_
  
  - [ ] 8.2 E2Eテストの実装
    - 完全なユーザーフローのテスト
    - 異なるデバイスサイズでのテスト
    - _要件: 全体_
  
  - [ ] 8.3 エラーケースのテストと修正
    - エッジケースの特定と対応
    - エラーハンドリングの改善
    - _要件: 2.4, 4.2, 6.2_

- [ ] 9. パフォーマンス最適化
  - [ ] 9.1 レンダリングパフォーマンスの最適化
    - 不要な再レンダリングの防止
    - メモ化の適用
    - _要件: 5.3_
  
  - [ ] 9.2 URLエンコーディングの最適化
    - 長いテキストの効率的な処理
    - 圧縮アルゴリズムの検討と実装
    - _要件: 2.3, 2.4_

- [ ] 10. デプロイとドキュメント作成
  - [ ] 10.1 GitHub Pagesへのデプロイ設定
    - GitHub Actionsワークフローの設定
    - カスタムドメイン設定（オプション）
    - _要件: 全体_
  
  - [ ] 10.2 ユーザードキュメントの作成
    - 使用方法の説明
    - よくある質問（FAQ）
    - _要件: 5.4_