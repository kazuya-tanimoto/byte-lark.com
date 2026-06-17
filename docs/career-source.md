# 経歴ソース（公開可・抽出版）

byte-lark.com のコンテンツ制作（Skills / Career / About）で再利用する、**公開してよい範囲だけ**の経歴データ。
PHASE1B-001 で起こし、以降の PBI（002 Career / 003 About）でも参照する。

## 取り扱い注意

- このリポジトリは公開前提。**ここには公開してよい情報しか書かない**。
- 除外する非公開情報（原本 `career-docs/` には存在するが、ここには載せない）:
  単価・年商・年齢・生年月日・住所・電話番号・個人メールアドレス・NG（避けたい）条件・性格診断の詳細。
- 原本（非公開・別リポジトリ `~/src/career-docs`）:
  - `master-career-data.md`（2026-04 更新、統合マスター。最も信頼できる現行ソース）
  - `skill-sheet/spread-sheet-skill-sheet/スキルシート_*.xlsx`（2022〜2024 のスナップショット。利用技術は習熟度 A/B/C 表記で年数は持たない）
  - 2014 職務経歴書 PDF（2001〜2014 の初期キャリア詳細）
- **note for future sessions**: `career-docs` の git log は 2026-02 以降しか無く、経歴の変遷は追えない。年代の裏取りは上記の xlsx スナップショットと 2014 PDF を直接読むこと。

## 基本情報（公開可）

- 氏名：谷本 和也
- 拠点：香川県高松市（フルリモート）
- 学歴：2001年3月 北九州大学（現 北九州市立大学）経済学部 卒業
- 業界経験：2001年〜（25年以上）
- 法人：合同会社設立（2026年6月）
- 契約形態：業務委託（準委任）、フルリモート・週3〜4日

## 保有資格

| 資格 | 取得 |
|---|---|
| プロジェクトマネージャ | 2011/06 |
| データベーススペシャリスト | 2010/06 |
| ORACLE MASTER Silver 10g | 2010/01 |
| システムアーキテクト | 2009/12 |
| ソフトウェア開発技術者 | 2008/12 |

2011年以降の新規取得なし（運営者確認済み 2026-06）。2014 職務経歴書にあった基本情報技術者 / カラーコーディネーター3級 / SystemWalker / 運転免許は、上位資格に集約のため非掲載。

## 技術スキル（実務経験年数・運営者確認済み 2026-06）

年数は「いつから実務で使っているか」をベースにした客観値。習熟度の自己評価（A/B/C）は主観が入るため非採用。`src/data/skills.ts` と一致させる。

- OS / Middleware：Linux 12 / Apache 12 / Nginx 2 / Oracle 12
- Languages：PHP 11 / JavaScript 10 / TypeScript 3 / Python 3 / Java 6 / C 6 / VB.Net 6 / ShellScript 10 / SQL 12
- Frameworks / Libraries：React 3 / TailwindCSS 3 / Laravel 5 / CodeIgniter 6 / Flask 2 / Struts 6
- Databases：MySQL 11 / PostgreSQL 2
- Tools：Git 12 / JetBrains 8 / Neovim 3 / Docker 6 / GAS 3 / Selenium 5
- AI 活用（年数表示なし・名前のみ）：Claude / Claude Code / Cursor / GitHub Copilot / ChatGPT / Gemini / MCP

補足:
- Kotlin は実務1年未満・今後の利用予定なしのため非掲載。Django / FastAPI は実スキルシート・master いずれにも無く非掲載。
- Neovim 3 年（Vim を含めると10年以上）。

## 経歴タイムライン（公開可・役割／ドメインベース）

直近を厚く、古い案件は圧縮。顧客の固有名は伏せている（公開時に顧客名を出すか否かは 002 で運営者判断）。

| 期間 | 役割 | ドメイン / 内容 | 主な技術 |
|---|---|---|---|
| 2022/09〜現在 | EM / SE | 障がい者支援ポータルの設計・開発（上流設計・品質検証・開発チーム管理・AWS環境構築） | React / TypeScript / Laravel / PHP / MySQL / Tailwind / AWS / Docker |
| 約1年（参画実績） | 横断PM | 決済プラットフォーム開発（複数チーム横断のプロジェクトマネジメント） | — |
| 2021/12〜2023/06 | SE | 医薬品購入者向けオンライン問診システム（要件定義〜実装・UI顧客レビュー手法の導入） | PHP / CodeIgniter / MySQL / Docker / Git |
| 2020/12〜2021/09 | PM / SE | 鉄道会社キャンペーンのレンタカー予約システム（非IT顧客向けの要件定義〜リリース） | PHP / CodeIgniter / MySQL / Docker |
| 2015/03〜2021/11 | SE / Web制作管理 / 部長 | Web制作のサーバーサイド・進行管理・各種改善施策・採用選考 | PHP / Python / JavaScript |
| 2012/07〜2013/02 | メンバー | 社内プロジェクトマネジメント標準策定（PMBOK 準拠、学会発表） | — |
| 2008/01〜2014/06 | SE / PM | 電力系 SIer（基幹システム再構築・保守、要件定義〜、リーダー） | Java / VB.Net / Struts1&2 / Spring / Oracle |
| 2001/04〜2007/12 | SE / PM（後半リーダー） | 携帯キャリア料金系 SIer（C/S・Web、設計〜結合、本番維持） | C / Pro*C / Java / Oracle |

## マネジメント・プロセス

- PM 経験：約7年
- 開発手法：ウォーターフォール、スクラム（PO 側）
- チーム規模：3〜17名程度
- 業界：通信（キャリア）、電力、福祉、交通、決済プラットフォーム など B2B 領域

## AI 活用（実務実績）

- ツール：Claude / Claude Code / MCP / ChatGPT / Cursor / Gemini / Perplexity / GitHub Copilot / JetBrains AI
- 実績：
  - PR レビュー指摘傾向の分析 → AI レビュー観点の整備
  - 設計書をもとにしたコードレビュー観点の自動生成
  - 設計書 AI レビューフローを部門ルールとして制定
  - 現場ヒアリング音声の文字起こし → PBI ドラフト自動生成パイプライン構築
