# XMind Skill

XMindマインドマップファイル(.xmind)の読み込み・作成・編集を行うスキル for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## 機能

| 機能 | スクリプト | 説明 |
|------|-----------|------|
| 読み込み | `xmind_to_markdown.py` | XMind → Markdown変換 |
| 作成 | `xmind_editor.py` | 新規XMindファイル作成 |
| 編集 | `xmind_editor.py` | トピックの追加・変更・削除 |

## 対応フォーマット

| フォーマット | 読み込み | 書き込み |
|------------|:-------:|:-------:|
| XMind Zen (JSON) | ✅ | ✅ |
| XMind Legacy (XML) | ✅ | ❌ |

## インストール

### プロジェクトにインストール

```bash
npx add-skill inoue2002/xmind-skill
```

### グローバルにインストール

```bash
npx add-skill -g inoue2002/xmind-skill
```

### 依存関係（読み込み機能のみ）

```bash
pip install xmindparser
```

## 使い方

Claude Code で以下のような依頼をすると、このスキルが自動的に使用されます：

**読み込み：**
- 「XMindをMarkdownに変換して」
- 「マインドマップの内容を表示して」

**作成・編集：**
- 「マインドマップを作成して」
- 「XMindに新しいトピックを追加して」

## 出力例

**読み込み（Markdown変換）：**

```markdown
# 研究論文
## 1. はじめに
### 背景
### 問題設定
## 2. 関連研究
## 3. 提案手法
```

**編集（構造表示）：**

```
=== Sheet 1 ===
研究論文
  - 1. はじめに
    - 背景
    - 問題設定
  - 2. 関連研究
  - 3. 提案手法
```

## コマンド例

```bash
# 新規作成
python scripts/xmind_editor.py create output.xmind --root "中心トピック"

# トピック追加
python scripts/xmind_editor.py add output.xmind --parent "中心トピック" --topic "子トピック"

# Markdown変換
python scripts/xmind_to_markdown.py input.xmind
```

## ライセンス

MIT
