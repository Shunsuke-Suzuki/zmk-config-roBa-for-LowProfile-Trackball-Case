# ZMK Config Editor

roBa（PMW3610 トラックボール付き分割 ZMK キーボード）向けのトラックボール設定エディタです。  
[Keymap Editor](https://nickcoutsos.github.io/keymap-editor/) が触れない `&trackball { }` ブロックを、キーマップの他の部分を壊さずに編集することを目指しています。

## リポジトリ

https://github.com/Shunsuke-Suzuki/zmk-config-editor

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

## GitHub Pages

`main` へ push 後: https://shunsuke-suzuki.github.io/zmk-config-editor/

Settings → Pages → Source: **GitHub Actions**

## 関連リポジトリ

- ファームウェア設定: [zmk-config-roBa-for-LowProfile-Trackball-Case](https://github.com/Shunsuke-Suzuki/zmk-config-roBa-for-LowProfile-Trackball-Case)

## ライセンス

MIT
