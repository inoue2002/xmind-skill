# XMind Skill

XMindマインドマップファイル(.xmind)の読み込み・作成・編集を行うスキル for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

公式SDK（[xmind](https://github.com/xmindltd/xmind-sdk-js)）を使用。

## 機能

| コマンド | 説明 |
|---------|------|
| `create` | 新規XMindファイル作成 |
| `show` | 構造をツリー表示 |
| `markdown` | Markdown形式に変換 |
| `add` | トピック追加（ノート対応） |

## インストール

### プロジェクトにインストール

```bash
npx add-skill inoue2002/xmind-skill
```

### グローバルにインストール

```bash
npx add-skill -g inoue2002/xmind-skill
```

### 依存関係

```bash
npm install
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
node scripts/xmind-cli.js create output.xmind --root "中心トピック"

# 構造表示
node scripts/xmind-cli.js show file.xmind

# Markdown変換
node scripts/xmind-cli.js markdown file.xmind

# トピック追加（ノート付き）
node scripts/xmind-cli.js add file.xmind --parent "親" --topic "子" --note "メモ"
```

## 出力例

**ツリー表示：**

```
=== Sheet 1 ===
研究論文
  - 1. はじめに
    > 研究の背景と目的
    - 背景
    - 問題設定
  - 2. 関連研究
  - 3. 提案手法
```

**Markdown変換：**

```markdown
# 研究論文

## 1. はじめに

研究の背景と目的

### 背景

### 問題設定

## 2. 関連研究

## 3. 提案手法
```

## ライセンス

MIT
