import type { CareerDetail, CareerItem } from "@/types/career";

export const Career: CareerItem[] = [
  {
    id: 1,
    title: "社内ポータルシステム開発",
    summary: "障害者支援業務にて利用するポータルサイト構築案件に参画中",
    keywords: "React, Laravel, Tailwind, Docker, AWS, PM, 要件定義〜保守",
    role: "SE兼EM",
    from: "2022/09",
  },
  {
    id: 2,
    title: "医薬品購入者向け問診システム開発",
    summary:
      "通販サイト（楽天、Shopify）の医薬品購入者向けのオンライン問診システム構築に参画",
    keywords: "Codeigniter, jQuery, LAMP, Docker, 要件定義〜実装",
    from: "2021/01",
    to: "2022/08",
  },
];

export const CareerDetailData: CareerDetail = {
  id: 1,
  title: "社内ポータルシステム開発",
  summary: "障がい者支援業務にて利用するポータルサイト構築案件に参画中",
  from: "2022/09",
  responsibility: [
    {
      item: "要件定義〜詳細設計、フロントおよびバックエンド開発〜テスト、および保守",
    },
    {
      item: "AWS(EC2、RDS、VPC等)およびLAMPやDockerを使った環境構築",
    },
    {
      item: "開発メンバーのタスク管理、開発オフショア（外国籍）メンバーへの作業指示",
    },
  ],
  technology: [
    {
      item: "AWS(EC2, RDS, VPC, ALB, CodeCommit, CodeBuild, CodeDeploy, CloudWatch, S3, CloudFront, Route53, WAF, Inspector, etc)",
    },
    {
      item: "Amazon Linux 2 & 2023, Apache2.4, PHP8.1, MySQL8.0",
    },
    {
      item: "React18(Redux, ESLint, Prettier, Vitest, React Testing Library, React Query, etc)",
    },
    {
      item: "Laravel11(PHPUnit)",
    },
    {
      item: "Docker, Slack, Backlog",
    },
  ],
  role: "SE兼EM",
  scale: "チーム6名",
  responsibleProcess:
    "要件定義、基本設計、詳細設計、実装/単体、結合テスト、保守運用",
  comment: [
    {
      item: "参画当初はいちメンバーとして実装メインの担当だったが、現在は下記業務をメインに担当",
      subItem: [
        {
          item: "開発系：上流設計、品質検証、開発チーム管理",
        },
        {
          item: "運用系：トラブルおよび脆弱性対応、AWS環境構築および改善",
        },
      ],
    },
    {
      item: "クライアント企業の採用面談(プロパー、業務委託エンジニア)も実施",
    },
  ],
};
