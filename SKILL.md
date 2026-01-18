---
name: xmind
description: XMindマインドマップファイル(.xmind)をMarkdown形式に変換するスキル。論文のシナリオ構成、アイデア整理、研究の構造化などに使用するマインドマップをテキストベースで扱う。「XMindをMarkdownに変換」「マインドマップを読み込んで」「.xmindファイルを解析」「XMindの内容を表示」などの依頼時に使用。
---

# XMind

XMindファイルの読み込み・作成・編集を行うスキル。

## スクリプト

| スクリプト | 用途 |
|-----------|------|
| `xmind_to_markdown.py` | XMind → Markdown変換（読み込み専用） |
| `xmind_editor.py` | XMindファイルの作成・編集 |

## 依存関係

```bash
pip install xmindparser  # xmind_to_markdown.py用
```

`xmind_editor.py`は標準ライブラリのみで動作。

---

## xmind_to_markdown.py（読み込み）

XMindファイルをMarkdownに変換。XMind LegacyとXMind Zen両対応。

```bash
# 基本
python scripts/xmind_to_markdown.py input.xmind

# ファイル出力
python scripts/xmind_to_markdown.py input.xmind output.md

# 箇条書き形式
python scripts/xmind_to_markdown.py input.xmind --style bullets
```

---

## xmind_editor.py（作成・編集）

XMindファイルの作成と編集。依存関係なし。

### 新規作成

```bash
python scripts/xmind_editor.py create output.xmind --root "中心トピック"
```

### 構造表示

```bash
python scripts/xmind_editor.py show file.xmind
```

### トピック追加

```bash
python scripts/xmind_editor.py add file.xmind --parent "親トピック" --topic "新しいトピック"
```

### トピック名変更

```bash
python scripts/xmind_editor.py edit file.xmind --target "現在の名前" --title "新しい名前"
```

### トピック削除

```bash
python scripts/xmind_editor.py delete file.xmind --target "削除するトピック"
```

---

## 使用例

論文の構成をマインドマップで作成：

```bash
# 作成
python scripts/xmind_editor.py create paper.xmind --root "研究論文"

# 章を追加
python scripts/xmind_editor.py add paper.xmind --parent "研究論文" --topic "1. はじめに"
python scripts/xmind_editor.py add paper.xmind --parent "研究論文" --topic "2. 関連研究"
python scripts/xmind_editor.py add paper.xmind --parent "研究論文" --topic "3. 提案手法"

# サブトピック追加
python scripts/xmind_editor.py add paper.xmind --parent "1. はじめに" --topic "背景"
python scripts/xmind_editor.py add paper.xmind --parent "1. はじめに" --topic "問題設定"

# 確認
python scripts/xmind_editor.py show paper.xmind
```

出力：
```
=== Sheet 1 ===
研究論文
  - 1. はじめに
    - 背景
    - 問題設定
  - 2. 関連研究
  - 3. 提案手法
```
