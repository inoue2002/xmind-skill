# XMind Skill

XMindマインドマップファイル(.xmind)をMarkdown形式に変換するスキル for [Claude Code](https://docs.anthropic.com/en/docs/claude-code).

## 機能

- XMindファイルをMarkdownに変換
- ヘッダー形式（`# ##`）と箇条書き形式（`-`）の選択
- ノート・ラベルの変換対応
- 複数シートの処理

## 対応フォーマット

| フォーマット | 内部構造 | 対応状況 |
|------------|---------|---------|
| XMind Zen | JSON (content.json) | ✅ |
| XMind Legacy | XML | ✅ |

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
pip install xmindparser
```

## 使い方

Claude Code で以下のような依頼をすると、このスキルが自動的に使用されます：

- 「XMindをMarkdownに変換して」
- 「マインドマップを読み込んで」
- 「.xmindファイルを解析」
- 「XMindの内容を表示」

## 出力例

**ヘッダー形式（デフォルト）：**

```markdown
# 研究論文の構成
## 1. はじめに
### 背景
### 問題設定
## 2. 関連研究
## 3. 提案手法
## 4. 実験
## 5. 結論
```

**箇条書き形式：**

```markdown
- 研究論文の構成
  - 1. はじめに
    - 背景
    - 問題設定
  - 2. 関連研究
  - 3. 提案手法
  - 4. 実験
  - 5. 結論
```

## ライセンス

MIT
