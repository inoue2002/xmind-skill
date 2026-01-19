# XMind Skill

XMindマインドマップファイル(.xmind)の読み込み・作成・編集を行うスキル。

Claude Code、Cursor、その他add-skill対応ツールで使用可能。

公式SDK（[xmind-sdk-python](https://github.com/xmindltd/xmind-sdk-python)）を使用。

> **⚠️ 対応バージョン: XMind 8**
>
> このスキルはXMind 8（XML形式）専用です。
> XMind Zen以降（2018年〜、JSON形式）には対応していません。

## 機能

| コマンド | 説明 |
|---------|------|
| `create` | 新規XMindファイル作成 |
| `show` | 構造をツリー表示 |
| `markdown` | Markdown形式に変換 |
| `add` | トピック追加（ノート・コメント対応） |
| `edit` | トピック編集 |

## 対応機能

| 機能 | 読み込み | 書き込み |
|------|:-------:|:-------:|
| トピック | ✅ | ✅ |
| ノート (notes) | ✅ | ✅ |
| コメント (comments) | ✅ | ✅ |
| マーカー (markers) | ✅ | ✅ |
| ラベル (labels) | ✅ | ✅ |

## インストール

### プロジェクトにインストール

```bash
npx add-skill inoue2002/xmind-skill
```

### グローバルにインストール

```bash
npx add-skill -g inoue2002/xmind-skill
```

### 依存関係（初回のみ）

```bash
# スキルディレクトリで実行
pip install -r requirements.txt

# または直接
python3 -m pip install xmind

# macOS (Homebrew Python) の場合
python3 -m pip install --user xmind
```

## 使い方

Claude Code で以下のような依頼をすると、このスキルが自動的に使用されます：

**読み込み：**
- 「XMindをMarkdownに変換して」
- 「マインドマップの内容を表示して」

**作成・編集：**
- 「マインドマップを作成して」
- 「XMindに新しいトピックを追加して」

## コマンド例

```bash
# 新規作成
python scripts/xmind_cli.py create output.xmind --root "中心トピック"

# 構造表示
python scripts/xmind_cli.py show file.xmind

# Markdown変換
python scripts/xmind_cli.py markdown file.xmind

# トピック追加（ノート・コメント付き）
python scripts/xmind_cli.py add file.xmind --parent "親" --topic "子" \
  --note "メモ" --comment "コメント"

# トピック編集
python scripts/xmind_cli.py edit file.xmind --target "対象" --title "新タイトル"
```

## 出力例

**ツリー表示：**

```
=== Sheet 1 ===
研究論文
  - 1. はじめに
    > 背景と目的
    // 要確認
    - 背景
    - 問題設定
  - 2. 関連研究
  - 3. 提案手法
```

**Markdown変換：**

```markdown
# 研究論文

## 1. はじめに

背景と目的

### 背景

### 問題設定

## 2. 関連研究

## 3. 提案手法
```

## ライセンス

MIT
