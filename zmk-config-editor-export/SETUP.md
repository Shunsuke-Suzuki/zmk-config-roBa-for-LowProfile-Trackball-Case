# セットアップ

## リポジトリ

https://github.com/Shunsuke-Suzuki/zmk-config-editor

## 初回 push（ローカルから）

```bash
cd trabomap-editor   # または clone 後のルート
git remote set-url origin https://github.com/Shunsuke-Suzuki/zmk-config-editor.git
git push -u origin main
```

リモートに README だけある場合:

```bash
git pull origin main --rebase --allow-unrelated-histories
# コンフリクトが出たら README を整理してから
git push -u origin main
```

## GitHub Pages

1. リポジトリ → **Settings** → **Pages**
2. Source: **GitHub Actions**
3. `main` への push で `.github/workflows/deploy.yml` がデプロイ

公開 URL: https://shunsuke-suzuki.github.io/zmk-config-editor/

## 開発

```bash
npm install
npm test
npm run dev
```
