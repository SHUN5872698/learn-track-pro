import { ref } from 'vue';

export const mockCategories = ref([
  {
    id: 1,
    name: 'Programming',
    icon: '...',
    description: 'プログラミング言語、フレームワーク、ライブラリ',
    created_at: '2023-01-01T00:00',
    updated_at: '2023-01-01T00:00',
  },
  {
    id: 2,
    name: 'Infrastructure',
    icon: '...',
    description: 'サーバー、ネットワーク、クラウド、コンテナ技術',
    created_at: '2023-01-01T00:00',
    updated_at: '2023-01-01T00:00',
  },
  {
    id: 3,
    name: 'Service',
    icon: '...',
    description: 'Webサービス、開発ツール、生産性向上ツール',
    created_at: '2023-01-01T00:00',
    updated_at: '2023-01-01T00:00',
  },
  {
    id: 4,
    name: 'Development',
    icon: '...',
    description: '設計、開発手法、プロジェクト管理、実践的な開発',
    created_at: '2023-01-01T00:00',
    updated_at: '2023-01-01T00:00',
  },
  {
    id: 5,
    name: 'AI',
    icon: '...',
    description: 'AI、機械学習、LLM、プロンプトエンジニアリング',
    created_at: '2023-01-01T00:00',
    updated_at: '2023-01-01T00:00',
  },
  {
    id: 6,
    name: 'Other',
    icon: '...',
    description: 'ビジネススキル、マインドセット、その他の学習',
    created_at: '2023-01-01T00:00',
    updated_at: '2023-01-01T00:00',
  },
]);
