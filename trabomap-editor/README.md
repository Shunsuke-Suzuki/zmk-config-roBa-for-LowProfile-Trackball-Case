# TraboMap Editor

roBa（PMW3610 トラックボール付き分割 ZMK キーボード）向けのトラックボール設定エディタです。  
[Keymap Editor](https://nickcoutsos.github.io/keymap-editor/) が触れない `&trackball { }` ブロックを、キーマップの他の部分を壊さずに編集することを目指しています。

## リポジトリ構成

このプロジェクトは **zmk-config とは別リポジトリ** で運用する想定です。

独立リポジトリとして公開する場合:

```bash
cd trabomap-editor
git init
git branch -M main
git remote add origin https://github.com/Shunsuke-Suzuki/trabomap-editor.git
git add -A && git commit -m "feat: Phase 0"
git push -u origin main
```

GitHub で `trabomap-editor` リポジトリを先に作成してください。  
Pages 有効化後、`main` への push でデプロイワークフローが走ります。

## Phase 0（現在）

- `.keymap` ファイルの読み込み
- `&trackball` ブロックのパースと表示
- 変更なしでの再出力（round-trip で元ファイルと同一）
- Vitest によるフィクスチャテスト

## 開発

```bash
npm install
npm test
npm run dev
npm run build
```

## 関連リポジトリ

- ファームウェア設定: [zmk-config-roBa-for-LowProfile-Trackball-Case](https://github.com/Shunsuke-Suzuki/zmk-config-roBa-for-LowProfile-Trackball-Case)

## ライセンス

MIT
