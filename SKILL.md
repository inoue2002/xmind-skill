---
name: xmind
description: XMindマインドマップファイル(.xmind)をMarkdown形式に変換するスキル。論文のシナリオ構成、アイデア整理、研究の構造化などに使用するマインドマップをテキストベースで扱う。「XMindをMarkdownに変換」「マインドマップを読み込んで」「.xmindファイルを解析」「XMindの内容を表示」などの依頼時に使用。
---

# XMind

XMindファイルの読み込み・作成・編集を行うスキル。公式SDK（xmind）を使用。

## 依存関係

```bash
npm install
```

## コマンド

### 新規作成

```bash
node scripts/xmind-cli.js create output.xmind --root "中心トピック"
```

### 構造表示

```bash
node scripts/xmind-cli.js show file.xmind
```

出力例：
```
=== Sheet 1 ===
研究論文
  - 1. はじめに
    > 研究の背景と目的
    - 背景
  - 2. 関連研究
```

### Markdown変換

```bash
# ヘッダー形式（デフォルト）
node scripts/xmind-cli.js markdown file.xmind

# 箇条書き形式
node scripts/xmind-cli.js markdown file.xmind --style bullets
```

### トピック追加

```bash
# 基本
node scripts/xmind-cli.js add file.xmind --parent "親トピック" --topic "新トピック"

# ノート付き
node scripts/xmind-cli.js add file.xmind --parent "親" --topic "子" --note "メモ内容"
```

---

## 使用例

論文構成のマインドマップを作成：

```bash
# 作成
node scripts/xmind-cli.js create paper.xmind --root "研究論文"

# 章を追加
node scripts/xmind-cli.js add paper.xmind --parent "研究論文" --topic "1. はじめに" --note "背景と目的"
node scripts/xmind-cli.js add paper.xmind --parent "研究論文" --topic "2. 関連研究"
node scripts/xmind-cli.js add paper.xmind --parent "研究論文" --topic "3. 提案手法"

# サブトピック
node scripts/xmind-cli.js add paper.xmind --parent "1. はじめに" --topic "背景"
node scripts/xmind-cli.js add paper.xmind --parent "1. はじめに" --topic "問題設定"

# 確認
node scripts/xmind-cli.js show paper.xmind

# Markdown出力
node scripts/xmind-cli.js markdown paper.xmind
```

## 対応機能

- XMind Zen形式の読み書き
- ノート（notes）の読み書き
- 階層構造の作成・編集
- Markdown変換（headers/bullets形式）
