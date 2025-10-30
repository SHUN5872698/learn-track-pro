// src/utils/chartColors.js
export const generateTechColor = (techName) => {
  // 主要技術には固定色を割り当て
  const priorityColors = {
    'Laravel': 'rgba(239, 68, 68, 0.8)',
    'Vue.js': 'rgba(16, 185, 129, 0.8)',
    'React': 'rgba(59, 130, 246, 0.8)',
    'Docker': 'rgba(107, 114, 128, 0.8)',
    'PHP': 'rgba(139, 92, 246, 0.8)',
    'Python': 'rgba(251, 191, 36, 0.8)',
    'TypeScript': 'rgba(49, 196, 141, 0.8)',
    'Node.js': 'rgba(34, 197, 94, 0.8)',
  };

  // 優先色がある場合はそれを返す
  if (priorityColors[techName]) {
    return priorityColors[techName];
  }

  // その他の技術用のカラーパレット
  const fallbackPalette = [
    'rgba(236, 72, 153, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(249, 115, 22, 0.8)',
    'rgba(84, 56, 220, 0.8)',
    'rgba(132, 204, 22, 0.8)',
    'rgba(225, 29, 72, 0.8)',
  ];

  // 文字列からハッシュ値を生成（同じ名前は常に同じ色）
  let hash = 0;
  for (let i = 0; i < techName.length; i++) {
    hash = techName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % fallbackPalette.length;
  return fallbackPalette[index];
};
