---
name: xmind
description: XMindマインドマップファイル(.xmind)をMarkdown形式に変換するスキル。論文のシナリオ構成、アイデア整理、研究の構造化などに使用するマインドマップをテキストベースで扱う。「XMindをMarkdownに変換」「マインドマップを読み込んで」「.xmindファイルを解析」「XMindの内容を表示」などの依頼時に使用。
---

# XMind

XMindファイルをMarkdownに変換するスキル。XMind LegacyとXMind Zen両方の形式に対応。

## 依存関係

```bash
pip install xmindparser
```

## 使い方

### 基本的な変換

```bash
python scripts/xmind_to_markdown.py input.xmind
```

### ファイルに出力

```bash
python scripts/xmind_to_markdown.py input.xmind output.md
```

### 出力形式の選択

**ヘッダー形式（デフォルト）**：Markdownの見出しを使用
```bash
python scripts/xmind_to_markdown.py input.xmind --style headers
```

出力例：
```markdown
# Root Topic
## Child 1
### Grandchild
## Child 2
```

**箇条書き形式**：インデント付き箇条書きのみ使用
```bash
python scripts/xmind_to_markdown.py input.xmind --style bullets
```

出力例：
```markdown
- Root Topic
  - Child 1
    - Grandchild
  - Child 2
```

### 特定のシートのみ変換

複数シートがある場合、シートインデックスを指定：
```bash
python scripts/xmind_to_markdown.py input.xmind --sheet 0
```

## Pythonから使用

```python
from scripts.xmind_to_markdown import xmind_to_markdown

# 文字列として取得
markdown = xmind_to_markdown("input.xmind")
print(markdown)

# ファイルに保存
xmind_to_markdown("input.xmind", "output.md")

# 箇条書き形式で取得
markdown = xmind_to_markdown("input.xmind", format_style="bullets")
```

## 対応機能

- XMind Legacy形式（.xmind、XML内部構造）
- XMind Zen形式（.xmind、JSON内部構造）
- ノート（notes）の変換
- ラベル（labels）の変換
- 複数シートの処理
