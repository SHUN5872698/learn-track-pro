import { ref } from 'vue';

export const mockTechnologies = ref([
  // Programming
  { id: 1, category_id: 1, name: 'Laravel', icon: '/assets/icons/technologies/laravel-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 2, category_id: 1, name: 'Vue.js', icon: '/assets/icons/technologies/vue-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 3, category_id: 1, name: 'React', icon: '/assets/icons/technologies/react-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 4, category_id: 1, name: 'PHP', icon: '/assets/icons/technologies/php-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 5, category_id: 1, name: 'JavaScript', icon: '/assets/icons/technologies/javascript-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 6, category_id: 1, name: 'TypeScript', icon: '/assets/icons/technologies/typescript-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 7, category_id: 1, name: 'Python', icon: '/assets/icons/technologies/python-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 8, category_id: 1, name: 'Ruby', icon: '/assets/icons/technologies/ruby-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 9, category_id: 1, name: 'Java', icon: '/assets/icons/technologies/java-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 10, category_id: 1, name: 'HTML', icon: '/assets/icons/technologies/html-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 11, category_id: 1, name: 'CSS', icon: '/assets/icons/technologies/css-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 12, category_id: 1, name: 'Next.js', icon: '/assets/icons/technologies/next-js-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 13, category_id: 1, name: 'TailwindCSS', icon: '/assets/icons/technologies/tailwindcss-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },

  // Infrastructure
  { id: 14, category_id: 2, name: 'Linux', icon: '/assets/icons/technologies/linux-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 15, category_id: 2, name: 'Nginx', icon: '/assets/icons/technologies/nginx-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 16, category_id: 2, name: 'Apache', icon: '/assets/icons/technologies/apache-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 17, category_id: 2, name: 'Network', icon: '/assets/icons/technologies/network-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 18, category_id: 2, name: 'Docker', icon: '/assets/icons/technologies/docker-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 19, category_id: 2, name: 'AWS', icon: '/assets/icons/technologies/aws-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 20, category_id: 2, name: 'Azure', icon: '/assets/icons/technologies/azure-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },

  // Service
  { id: 21, category_id: 3, name: 'Git', icon: '/assets/icons/technologies/git-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 22, category_id: 3, name: 'GitHub', icon: '/assets/icons/technologies/github-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 23, category_id: 3, name: 'VSCode', icon: '/assets/icons/technologies/vscode-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 24, category_id: 3, name: 'Obsidian', icon: '/assets/icons/technologies/obsidian-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 25, category_id: 3, name: 'SendGrid', icon: '/assets/icons/technologies/sendgrid-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 26, category_id: 3, name: 'Figma', icon: '/assets/icons/technologies/figma-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },

  // Development
  { id: 27, category_id: 4, name: '開発', icon: '/assets/icons/technologies/agile-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 28, category_id: 4, name: 'システム設計', icon: '/assets/icons/technologies/development-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 29, category_id: 4, name: 'UI/UX設計', icon: '/assets/icons/technologies/system-design-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 30, category_id: 4, name: 'アジャイル開発', icon: '/assets/icons/technologies/ui:ux-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 31, category_id: 4, name: 'テスト駆動開発', icon: '/assets/icons/technologies/test-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  // AI
  { id: 32, category_id: 5, name: 'ChatGPT', icon: '/assets/icons/technologies/chatgpt-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 33, category_id: 5, name: 'Claude', icon: '/assets/icons/technologies/claude-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 34, category_id: 5, name: 'Gemini', icon: '/assets/icons/technologies/gemini-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 35, category_id: 5, name: 'LangChain', icon: '/assets/icons/technologies/langchain-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 36, category_id: 5, name: 'Prompt Engineering', icon: '/assets/icons/technologies/prompt-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  // Other
  { id: 37, category_id: 6, name: 'ビジネススキル', icon: '/assets/icons/technologies/business-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 38, category_id: 6, name: 'マインドセット', icon: '/assets/icons/technologies/mind-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
  { id: 39, category_id: 6, name: 'その他', icon: '/assets/icons/technologies/other-icon.png', created_at: '2023-01-01T00:00', updated_at: '2023-01-01T00:00' },
]);
