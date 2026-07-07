# zmk-config-roBa

<img src="keymap-drawer/roBa.svg" >

roBa（Seeed XIAO BLE）向け ZMK ファームウェア設定です。

このドキュメントは **`main` ブランチとの差分**（`cursor/inertia-scroll-034f` ブランチ時点）をまとめたものです。

---

## 変更の概要

| カテゴリ | 変更内容 |
|---|---|
| キーマップ | Mac 向けレイアウトへ刷新、コンボ追加、レイヤー再構成 |
| トラックボール | NUM / ARROW レイヤーでのフリック操作を追加 |
| トラックボール | 慣性スクロールは導入後に撤回（現状は従来方式） |
| 左エンコーダ | マウスホイール化を試行後、キー入力スクロールへ復帰 |
| PMW3610 ドライバ | オートマウスレイヤー競合のパッチを同梱 |
| ビルド | ZMK `v0.3-branch` 固定、ドライバをリポジトリ内モジュール化 |

---

## トラックボール操作

### レイヤー別の動作

| レイヤー | 入り方 | トラックボールの動作 |
|---|---|---|
| デフォルト | — | カーソル移動（オートマウス layer 4 が有効化） |
| NUM（layer 2） | Space 長押し | フリックで Mission Control 系ショートカット |
| ARROW（layer 3） | Tab 長押し | 右フリックで通知センター |
| MOUSE（layer 4） | トラボ操作で自動 | マウスボタン（`mkp`） |
| SCROLL（layer 5） | `&lt 5 I` | スクロール |

### NUM レイヤー（layer 2）のフリック

`config/roBa.keymap` の `desktop_swipe` 設定:

| フリック方向 | 送信キー | macOS での用途（要設定） |
|---|---|---|
| 右 | `Ctrl + ←` | 左のデスクトップへ移動 |
| 左 | `Ctrl + →` | 右のデスクトップへ移動 |
| 上 | `Ctrl + ↑` | Mission Control |
| 下 | `Ctrl + ↓` | アプリケーションウィンドウ |

### ARROW レイヤー（layer 3）のフリック

`notification_center_swipe` 設定:

| フリック方向 | 送信キー | macOS での用途（要設定） |
|---|---|---|
| 右 | `Ctrl + Option + Cmd + N` | 通知センター |
| その他 | なし | — |

### オートマウスレイヤー競合の修正

**問題:** トラックボールでカーソル移動した直後、オートマウスレイヤー（layer 4）が残っていると、NUM / ARROW のフリックが効かないことがあった。

**対応:** `modules/zmk-pmw3610-driver/` にパッチ済みドライバを同梱。NUM / ARROW を押している間はフリック操作を優先し、オートマウスレイヤーを自動解除する。

あわせて `CONFIG_PMW3610_AUTOMOUSE_TIMEOUT_MS` を `700` → `400` に短縮。

---

## キーマップの主な変更（`main` との差分）

### デフォルトレイヤー

- Mac 向け修飾キー配置（`LEFT_COMMAND` / `LEFT_CONTROL` など）
- 左エンコーダ: `DOWN_ARROW` / `UP_ARROW`（キー入力ベースのスクロール）
- サムキー: `&lt 2 SPACE`（NUM）、`&lt_to_layer_0 3 TAB`（ARROW）

### コンボ

| コンボ | キー |
|---|---|
| `0 + 1` | `ESCAPE` |
| `7 + 8` | `-` |
| `8 + 9` | `=` |
| `10 + 11` | `TAB` |
| `11 + 12` | `Shift + TAB` |
| `18 + 19` | `;` |
| `19 + 20` | `[` |
| `20 + 21` | `]` |
| `31 + 32` | `/` |

### レイヤー構成

| Index | 名前 | 主な用途 |
|---|---|---|
| 0 | default | 通常入力 |
| 1 | FUNCTION | F キー |
| 2 | NUM | 数字・メディアキー |
| 3 | ARROW | 矢印・Vim 風移動 |
| 4 | MOUSE | マウスボタン（オートマウス） |
| 5 | SCROLL | スクロール |
| 6 | layer_6 | Bluetooth / ブートローダー |
| 7 | layer_7 | 追加矢印キー |

---

## ビルド・インフラの変更

### `.github/workflows/build.yml`

- ZMK ビルドワークフローを `@main` → `@v0.3-branch` に変更

### `config/west.yml`

- 外部取得していた `kumamuk-git/zmk-pmw3610-driver` を削除
- 代わりに `modules/zmk-pmw3610-driver/` をリポジトリ内に同梱

### `build.yaml`

- `roBa_R` ビルド時にパッチ済みドライバを読み込む `cmake-args` を追加:
  ```
  -DZMK_EXTRA_MODULES="${GITHUB_WORKSPACE};${GITHUB_WORKSPACE}/modules/zmk-pmw3610-driver"
  ```

### `boards/shields/roBa/roBa_R.conf`

- `CONFIG_PMW3610_AUTOMOUSE_TIMEOUT_MS`: `700` → `400`

---

## 導入を試みたが撤回した変更

| 変更 | 状態 | 理由 |
|---|---|---|
| 慣性スクロール（`zmk-input-processor-scroll-inertia`） | **撤回** | 実機での体感が微妙 |
| 左エンコーダのマウスホイール（`&msc`） | **撤回** | 左手側で反応しなくなった |

現状のスクロール方式:

- トラックボール: PMW3610 ドライバ内蔵の `scroll-layers`（layer 5）
- 左エンコーダ: `&inc_dec_kp DOWN_ARROW UP_ARROW`

---

## フラッシュの目安

| 変更内容 | フラッシュが必要な側 |
|---|---|
| トラックボール・スクロール・オートマウス | 右 `roBa_R` |
| 左エンコーダ・キーマップ全般 | 左 `roBa_L` |
| 上記すべて | 左右両方 |

GitHub Actions のビルド成果物（Artifacts）から `.uf2` を取得して書き込みます。

---

## macOS 側で必要な設定

NUM / ARROW のフリックを使うには、システム設定で以下のショートカットを割り当ててください。

1. **左の操作スペースへ移動** → `Control + ←`
2. **右の操作スペースへ移動** → `Control + →`
3. **Mission Control** → `Control + ↑`
4. **アプリケーションウィンドウ** → `Control + ↓`
5. **通知センターを表示** → `Control + Option + Command + N`

---

## 既知の注意点

- **オートマウスタイムアウト短縮（400ms）:** カーソル移動後のクリック猶予が以前より短く感じる場合がある
- **NUM / ARROW 中:** トラックボールはフリック専用となり、カーソル移動はできない
- **PMW3610 ドライバ同梱:** 上流（kumamuk-git）の更新は自動では入らない。更新時は手動マージが必要
- **分割キーボード:** Space / Tab（左手）とトラックボール（右手）のレイヤー同期に BLE 遅延がわずかに残る

---

## 変更ファイル一覧（`main` との diff）

```
.github/workflows/build.yml
boards/shields/roBa/roBa_R.conf
build.yaml
config/roBa.keymap
config/west.yml
modules/zmk-pmw3610-driver/   ← 新規追加（パッチ済み）
```
