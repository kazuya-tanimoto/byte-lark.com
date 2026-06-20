import type { CareerDetail, CareerItem } from "@/types/career";

// 出典: career-docs（非公開）の一次情報を横断集約（docs/career-source.md に保管）。
// - 全案件詳細: skill-sheet/spread-sheet-skill-sheet/スキルシート_20240802.xlsx（全案件を同一粒度で保持）
// - 直近案件（DMM 決済 等）: skill-sheet/html-skill-sheet/skill-sheet-pm.html（xlsx より新しい）
// - 初期キャリア補完: skill-sheet/for-gofield/職務経歴書_20141201.pdf
// master（AI 要約の二次情報）は不使用。公開不可情報（単価・個人特定情報・自己評価ネガ）は除外、顧客名は伏せる。
// 全 16 案件・新しい順。各 id に CareerDetails の詳細が対応（全件モーダルあり）。

export const Career: CareerItem[] = [
  {
    id: 1,
    title: "大規模決済プラットフォームの横断PM",
    summary:
      "複数プロダクトを横断するプロジェクトマネジメントと、AIを活用した品質改善施策の立案・展開を担当。",
    keywords: "横断PM, 品質改善, AI活用, Jira / Confluence",
    role: "横断PM",
    from: "2025/07",
    to: "2026/07",
  },
  {
    id: 2,
    title: "障がい者支援ポータルサイトの開発",
    summary:
      "立ち上げ期から要件定義〜運用までを一貫して主導。途中でスクラムへ移行し、PO的役割とAIによる開発自動化を推進。",
    keywords: "PM / PO / Dev, AWS, React / TypeScript, Laravel, スクラム",
    role: "PM / PO / Dev",
    from: "2022/09",
  },
  {
    id: 3,
    title: "医薬品購入者向けの問診システム開発",
    summary:
      "クライアント2社へのヒアリングから要件定義〜実装まで一気通貫で担当。モックを使ったUI設計手法を提案・導入。",
    keywords: "SE, PHP / CodeIgniter, MySQL, Docker, 要件定義〜実装",
    role: "SE",
    from: "2021/12",
    to: "2023/06",
  },
  {
    id: 4,
    title: "鉄道会社のキャンペーンに伴うシステム開発",
    summary:
      "キャンペーンの利用者増対策としてレンタカー予約システムを構築。要件定義〜リリースを一貫対応。",
    keywords: "PM / SE, PHP / CodeIgniter, MySQL, Docker, 要件定義〜リリース",
    role: "PM / SE",
    from: "2020/12",
    to: "2021/09",
  },
  {
    id: 5,
    title: "製薬会社向けシステム開発",
    summary:
      "製品情報・QA・問い合わせ管理のWebシステムを構築。エージェント経由の人材調達で不足を解消し納期を遵守。",
    keywords: "SE, PHP / CodeIgniter, MySQL, Docker, 人材調達",
    role: "SE",
    from: "2020/10",
    to: "2020/12",
  },
  {
    id: 6,
    title: "サーバー構築業務の自動化ツール作成",
    summary:
      "サーバー構築・CMS導入を自動化するツールをPythonで開発。年間50件超の作業の7割を自動化し約100時間を圧縮。",
    keywords: "SE, Python / Flask, Selenium, 業務自動化",
    role: "SE",
    from: "2020/12",
    to: "2021/04",
  },
  {
    id: 7,
    title: "民泊業者の清掃管理システム構築（副業）",
    summary:
      "予約サイトAPI連携とLINE通知で清掃管理を自動化。要件定義〜保守まで一人で一貫対応。",
    keywords: "SE, PHP / Laravel, GAS, LINE, 副業",
    role: "SE",
    from: "2017/11",
    to: "2020/03",
  },
  {
    id: 8,
    title: "Web制作のサーバーサイド業務／進行管理／各種改善施策",
    summary:
      "サーバーサイド開発に加え、複数ディレクターの案件管理や運用体制の整備を担当。会長から「会社を2度救った」と評される。",
    keywords: "SE / 部長 / PM, PHP, CodeIgniter, 脆弱性診断, 進行管理",
    role: "SE / 部長 / PM",
    from: "2015/03",
    to: "2021/11",
  },
  {
    id: 9,
    title: "病院向けパッケージソフトのカスタマイズ業務",
    summary:
      "産婦人科向けに自社パッケージをカスタマイズして導入。エコー機器ベンダーを含む関係者調整を重視し円滑に進行。",
    keywords: "PL / SE, PHP / CakePHP, PostgreSQL, 関係者調整",
    role: "PL / SE",
    from: "2014/07",
    to: "2015/02",
  },
  {
    id: 10,
    title: "電力会社基幹システム再構築",
    summary:
      "PLを2名配置した3チーム体制で、基本・詳細設計と進捗・品質管理を担当。緻密な進捗管理で納期を遵守。",
    keywords: "PM / SE, IBMメインフレーム, COBOL / DB2, 進捗・品質管理",
    role: "PM / SE",
    from: "2012/10",
    to: "2014/06",
  },
  {
    id: 11,
    title: "社内プロジェクトマネジメント標準策定",
    summary:
      "600名規模から選抜され、定量化・見える化に関するPM標準を策定。PM学会四国支部で発表。",
    keywords: "メンバー, PMBOK, 標準策定, 学会発表",
    role: "メンバー",
    from: "2012/07",
    to: "2013/02",
  },
  {
    id: 12,
    title: "Webシステムの設計開発業務",
    summary:
      "電力会社の新規Webシステムを顧客先常駐で基本設計〜結合テスト。納品前の最終検証で品質を担保。",
    keywords: "PM / SE, Java / Struts2 / Spring3, Oracle, 品質検証",
    role: "PM / SE",
    from: "2011/01",
    to: "2012/10",
  },
  {
    id: 13,
    title: "メインフレームシステムの再構築業務",
    summary:
      "口座振替データ管理システムをパッケージのC/Sへ再構築。COBOL解析・Fit&Gap分析からスクラッチ開発まで担当。",
    keywords: "SE, VB.NET / COBOL, Oracle, パッケージ導入",
    role: "SE",
    from: "2009/04",
    to: "2010/12",
  },
  {
    id: 14,
    title: "電力系クライアントサーバー・Webシステムの保守業務",
    summary:
      "電力系企業のC/S・Webシステム保守で詳細設計〜単体テストを担当。VBAで業務効率化ツールを作成。",
    keywords: "PG, VB / Java / JSP, Oracle, 保守",
    role: "PG",
    from: "2008/01",
    to: "2009/03",
  },
  {
    id: 15,
    title: "Webシステムの基本設計および開発管理業務",
    summary:
      "通信キャリア携帯ショップ窓口のWebシステム再構築に、リーダーとして途中参画。本番障害対応で立て直しを担う。",
    keywords: "PL / SE, Java / JSP / Struts1, Oracle, 顧客調整",
    role: "PL / SE",
    from: "2007/05",
    to: "2007/12",
  },
  {
    id: 16,
    title: "料金システムの開発業務／本番環境維持管理業務",
    summary:
      "通信キャリア料金システムの開発・ライブラリ管理から本番環境維持管理まで担当。同期80人で最も早く管理職に抜擢。",
    keywords: "PL / SE, C / Pro*C, Oracle, シェル自動化",
    role: "PL / SE",
    from: "2001/07",
    to: "2007/04",
  },
];

// 各案件の詳細（Career.id と対応）。全 16 案件にモーダルあり。
export const CareerDetails: CareerDetail[] = [
  {
    id: 1,
    role: "横断PM",
    scale: "チーム7名 / 業務委託",
    technology: ["Jira, Confluence, Slack", "Cursor, Gemini"],
    responsibilities: [
      "複数プロダクト間の横断課題の整理と経営層への報告",
      "事業部と決済基盤の複数プロダクト担当チーム間の横断マネジメント",
      "AIを活用した品質改善施策の立案・実装・展開",
    ],
    achievements: [
      "根拠ベースの意思決定：外部決済SDKのUX劣化について、各プロダクトのリードやベンダーへのヒアリングと文献からメリット・デメリットを整理。UXが劣化する箇所は見送り、コンバージョン貢献の大きい箇所のみ導入する方針で部長・マネージャーの決裁を得た",
      "リリース前の齟齬解消：Slack中心で連携が疎だったことに起因するインターフェース認識の食い違いを本番リリース前に検知。両チームを招集して優先対応を調整し、リリースを守った",
      "PRレビューのAI改善：PRの指摘傾向をAIで分析してレビュー観点を作成・展開。開発者がローカルで回せる仕組みを構築し、リードから「手戻りが明らかに減った」と評価を得た",
      "決済基盤観点のQA整備：事業部のQAに無かった決済基盤の観点を整理・提供し、基盤起因の不具合を事前に検知",
      "設計書AIレビューの制度化：設計書のAIレビューフローを整備し、部門のルールとして制定",
      "運用業務の自動化：本番障害当番のシフト作成やSaaS登録をGASで1クリック化し、マニュアルも整備",
    ],
  },
  {
    id: 2,
    role: "PM / PO / Dev",
    scale: "チーム17名 / 業務委託",
    technology: [
      "AWS（EC2, RDS, VPC 等）",
      "PHP 8.1, MySQL 8.0",
      "React 18, TypeScript, Laravel 11, TailwindCSS",
    ],
    responsibilities: [
      "プロジェクト初期はウォーターフォールで進行し、約2年前からスクラム開発へ移行",
      "（ウォーターフォール期）タスク管理と日本・ベトナムの開発メンバーへの指示、要件定義〜運用までの一貫対応、FigmaによるUI設計、フロント/バックエンド開発、AWS環境の構築・管理",
      "（スクラム期）ビジネス側と対話してニーズを整理、ユーザーストーリーマッピング、プロダクトバックログ整備、モック作成、業務知識の展開、フロントエンドの自動テスト導入",
    ],
    achievements: [
      "立ち上げ期のPMとして要件定義〜運用まで一貫して主導",
      "業務委託の立場ながら、エンジニア採用面接やオンボーディングを任される",
      "本番の重大障害発生時にチームを主導し、迅速な復旧に貢献",
      "業務知識をドキュメント化して開発チームに展開し、組織全体の業務理解向上に寄与",
      "PBIの執筆からレビュー・Backlog同期までをClaude Code Skillsで自動化し、体感2倍以上の生産性と受け入れ条件の記述粒度向上を両立",
      "受け入れ条件（Gherkin）からAIでテストケースを自動生成し、E2E自動化へ広げる構想を推進",
      "構築したAI活用ノウハウを同職種へ共有し、属人化を防いで組織のPBI品質を底上げ",
    ],
  },
  {
    id: 3,
    role: "SE",
    scale: "チーム4名",
    technology: [
      "FreeBSD, Apache 2.4, MySQL 5.6",
      "PHP 7.4, CodeIgniter 3, jQuery, Bootstrap",
      "Docker, Git",
    ],
    responsibilities: [
      "クライアント企業2社の担当者へのヒアリング、画面およびバッチの設計（要件定義〜詳細設計）",
      "画面モック作成やUIの顧客説明、画面・バッチの実装〜テスト",
      "ローカル開発用のDocker環境やテストサーバーの構築",
    ],
    achievements: [
      "薬事法とユーザーの利便性のバランスを取りながら顧客調整や設計を実施",
      "参画企業の開発業務に、モックを使ったUI設計および顧客レビューの手法を提案・導入",
      "Git経験の少ないメンバー向けにGit Hooksを活用して誤更新を防ぐ環境を整備",
    ],
  },
  {
    id: 4,
    role: "PM / SE",
    scale: "チーム4名",
    technology: [
      "CentOS 8, Apache 2.4, MySQL 8.0",
      "PHP 7.3, CodeIgniter 3, jQuery, Bootstrap",
      "Docker, Git",
    ],
    responsibilities: [
      "エンドユーザーヒアリングおよび画面の設計（要件定義〜詳細設計）",
      "画面の実装〜結合テスト、本番リリース、ローカル開発用のDocker環境構築",
      "他メンバーへの開発タスクの割当および進捗管理",
    ],
    achievements: [
      "エンドユーザーが非IT人材のため、技術的な内容を噛み砕き、他のものに例えるなどして分かりやすく説明",
      "変更要望の費用対効果や対応案のメリット・デメリットを説明して納得いただく",
      "Docker未経験のメンバー向けに導入手順を作成して促進し、開発効率を向上",
    ],
  },
  {
    id: 5,
    role: "SE",
    scale: "チーム7名",
    technology: [
      "FreeBSD, Apache 2.2, MySQL 5.6",
      "PHP 7.0, CodeIgniter 3, jQuery, Bootstrap",
      "Docker, Git",
    ],
    responsibilities: [
      "製品情報・QA・問い合わせ管理を行うWebシステムの画面開発・単体テスト",
      "ローカル開発用のDocker環境構築と開発ノウハウの社内共有",
      "クラウドソーシングや人材紹介エージェント経由での人材調達",
    ],
    achievements: [
      "エージェント経由で人材を確保して人材不足を解消し、納期を遵守",
      "自身が窓口となり、社内のコスト折衝や各種契約手続きを実施",
      "人材確保のノウハウをドキュメント化し、所属企業の人材確保手段の1つとして確立",
    ],
  },
  {
    id: 6,
    role: "SE",
    scale: "チーム1名",
    technology: [
      "Windows, Mac, Python 3.8, Flask 2.0",
      "BeautifulSoup 4.10, Selenium 4.1",
      "JavaScript, jQuery, Bootstrap, Docker, Git",
    ],
    responsibilities: [
      "管理画面GUIを使ったサーバー構築やSSL導入申請を自動化するツールの作成・導入",
      "CMS（WordPress / a-blog CMS）のインストール自動化",
    ],
    achievements: [
      "年間50件以上のサーバー構築業務の7割程度を自動化し、年間100時間程度の工数圧縮を実現",
      "Python習得を目的とし、プライベートの自主学習として開発",
    ],
  },
  {
    id: 7,
    role: "SE",
    scale: "チーム1名",
    technology: [
      "Ubuntu, Apache 2.4, MySQL 5.6",
      "PHP 7.2, Laravel 5.8, SQL",
      "LINE Notify, GoogleAppsScript, Docker, Git",
    ],
    responsibilities: [
      "旅行予約サイトのAPIを使った予約データの取得・更新",
      "スプレッドシートに清掃予定表を作成し、関係者へLINE通知する清掃管理業務の自動化（要件定義〜リリース・保守まで一貫対応）",
    ],
    achievements: [
      "各APIは日本語情報が無いため、英語ドキュメントやStackOverflowを読み込んで実装",
      "LINE通知機能はリアルタイム性が高く便利なため、所属企業のサーバー障害検知にも適用",
      "顧客管理サイト（WordPress）のセキュリティ対策も併せて実施",
    ],
  },
  {
    id: 8,
    role: "SE / 部長 / PM",
    scale: "チーム15名 / 会社員",
    technology: [
      "Linux, Apache, PHP, Perl, Bash, SQL, GoogleAppsScript",
      "CodeIgniter 3, jQuery, Bootstrap",
      "Git, Docker, OWASP ZAP",
    ],
    responsibilities: [
      "サーバー構築、CMS導入／カスタマイズ、CodeIgniterでのシステム開発",
      "複数Webディレクターの案件進行管理、運用メンバーの業務管理",
      "Webサイトのセキュリティ設定やツールによる脆弱性診断",
    ],
    achievements: [
      "大口顧客の契約終了時に過剰な受託案件を抱えるも、Webディレクターの鼓舞と案件管理で乗り越える（所属企業の会長から「会社を2度救った」と評される）",
      "技術的な相談相手がおらず、Web系の知識は全て自分で調査・検証して習得",
      "非技術者とのやり取りが多く、技術の話を身近なものに例えるなど、分かりやすく伝えることで納得感を重視",
      "クラウドストレージ・Docker・Gitや自動化の導入、エージェント活用での人材発掘、運用業務のアウトソースまでノウハウを整備",
    ],
  },
  {
    id: 9,
    role: "PL / SE",
    scale: "チーム6名 / 会社員",
    technology: ["WindowsServer, Apache, PostgreSQL", "PHP, SQL, CakePHP 2"],
    responsibilities: [
      "産婦人科向けに自社パッケージをカスタマイズして導入（基本設計〜システムテスト・現地導入）",
      "開発メンバーの作業管理",
      "病院の情シス責任者やエコー機器ベンダー等、関係者との各種調整",
    ],
    achievements: [
      "エコー機器ベンダーの設定作業まで管理範囲に含むため、早めの関係者調整を意識してプロジェクトを進行",
    ],
  },
  {
    id: 10,
    role: "PM / SE",
    scale: "チーム15名 / 会社員",
    technology: [
      "IBMメインフレーム, WindowsServer",
      "DB2, COBOL, SQL, JCL",
      "HTML, JavaScript",
    ],
    responsibilities: [
      "基本設計および詳細設計",
      "開発チームの責任者として、基本設計〜単体テスト工程の進捗・品質管理・成果物検証",
      "顧客や他開発ベンダーとの仕様・スケジュール調整",
    ],
    achievements: [
      "PLを2名配置した3チーム体制で、各チームの細かな管理と全体管理を担当",
      "参画人数が多く遅延がコストに直結するため、PLと連携して日々の進捗管理を緻密に行い、問題点の早期発見に注力",
    ],
  },
  {
    id: 11,
    role: "メンバー",
    scale: "チーム10名",
    technology: [],
    responsibilities: [
      "定量化や見える化に関するマネジメント標準の作成",
      "プロジェクトマネジメント学会四国支部 年次研究大会にてプレゼンを実施",
    ],
    achievements: [
      "600名規模の従業員の中から選抜され策定業務に従事",
      "定量データや客観的証拠を揃えた上での判断力・提案力が向上",
    ],
  },
  {
    id: 12,
    role: "PM / SE",
    scale: "チーム8名",
    technology: [
      "WindowsServer, Oracle",
      "Java, JSP, JavaScript, jQuery, Struts2, Spring3, MyBatis",
      "SQL, PL/SQL, VBA, SVN, Redmine",
    ],
    responsibilities: [
      "顧客先に常駐してヒアリングを行いながらの基本設計",
      "詳細設計〜結合テスト工程の設計および実装",
      "開発メンバーの進捗・品質管理・成果物検証、顧客との仕様・スケジュール調整",
    ],
    achievements: [
      "成果物を納品前に最終検証する立場として、細かい検証で不具合を炙り出し品質を担保",
    ],
  },
  {
    id: 13,
    role: "SE",
    scale: "チーム8名",
    technology: [
      "WindowsServer, Oracle",
      "VB, YSP/COBOL, SQL, MS-DOS",
      "VB.NET, Microsoft-VSS, SystemWalker",
    ],
    responsibilities: [
      "COBOLソース解析による現行システムの仕様調査",
      "再構築に関わる要件定義およびパッケージのFit&Gap分析",
      "パッケージで満たせない機能のスクラッチ開発（基本設計〜リリース）、システムテスト・パッケージベンダーとの仕様調整",
    ],
    achievements: [
      "パッケージ品質が悪く、独自構築部分とのインターフェース不具合時にはエビデンスを詳細に取得し、ベンダーへ改修を折衝",
    ],
  },
  {
    id: 14,
    role: "PG",
    scale: "チーム最大10名程度",
    technology: [
      "WindowsServer, Oracle",
      "VB, VBA, Java, JSP, SQL",
      "VB.NET, Struts1, CVS",
    ],
    responsibilities: [
      "電力系企業のC/S・Webシステム保守における詳細設計〜単体テスト（当期間内に5プロジェクトに所属）",
      "VBAによる業務効率化ツールの作成",
      "新入社員へのコーディング指導",
    ],
    achievements: ["VB型の画面やWebシステムの設計開発スキルを習得"],
  },
  {
    id: 15,
    role: "PL / SE",
    scale: "チーム11名",
    technology: [
      "HP-UX, Oracle",
      "Java, JSP, C++, Ksh, SQL",
      "Struts1, JobCenter",
    ],
    responsibilities: [
      "進行中の開発チームにリーダーとして途中参画し、結合テストを担当",
      "詳細設計〜結合テスト工程のスケジュール・作業管理および顧客調整",
    ],
    achievements: [
      "参画直後の本番リリース後、連日の本番障害対応に追われるも、状況のヒアリングや社内・顧客・他ベンダーとの調整で対応",
      "この経験から、悪い状況を立て直すための立ち回り力が向上",
    ],
  },
  {
    id: 16,
    role: "PL / SE",
    scale: "チーム最大8名",
    technology: ["HP-UX, Oracle", "C, Pro*C, Ksh, VBA, SQL", "JP1-AJS2"],
    responsibilities: [
      "通信キャリア料金システムの開発・ライブラリ管理",
      "エンドユーザーからの調査依頼対応、DBリカバリ、本番環境での作業自動化の検討・開発",
      "担当プロジェクトの管理職として予算管理・メンバーの勤務管理",
    ],
    achievements: [
      "シェル等でコマンド発行作業を半自動化し、手作業のリスクを軽減",
      "本プロジェクトへのアサイン時、所属企業で80人程いた同期のうち最も早く管理職に抜擢",
    ],
  },
];
