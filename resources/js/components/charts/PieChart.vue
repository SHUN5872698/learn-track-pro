<template>
  <!-- 円グラフコンポーネント -->
  <Pie :data="data" :options="chartOptions" />
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import { Pie } from 'vue-chartjs';

// ========================================
// 初期設定
// ========================================
// Chart.jsの必要なコンポーネントを登録
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

// ========================================
// Props定義
// ========================================
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// ========================================
// 算出プロパティ
// ========================================
// データの最大値に応じてY軸のスケール（目盛り間隔・最大値）を動的に調整
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 15,
        font: {
          size: 12,
        },
        // ラベルをカスタマイズ
        // データセットの合計値を計算し、各項目の割合（パーセンテージ）を表示
        generateLabels: function (chart) {
          const data = chart.data;
          if (!data.labels?.length || !data.datasets?.length) {
            return [];
          }
          const dataset = data.datasets[0];
          const total = dataset.data?.reduce((a, b) => a + b, 0) || 0;

          return data.labels.map((label, i) => {
            const value = dataset.data?.[i] || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return {
              text: `${label} (${percentage}%)`,
              fillStyle: dataset.backgroundColor?.[i] || '#999',
              hidden: false,
              index: i,
            };
          });
        },
      },
    },
    tooltip: {
      callbacks: {
        // グラフツールチップのラベルをカスタマイズ（学習時間を「時間:分」形式で表示）
        label: function (context) {
          const label = context.label || ''; // X軸のラベル（例: '月曜日'）
          const value = context.raw || 0; // Y軸の値（学習時間）
          const dataset = context.dataset; // データセット全体

          // 全体比率パーセンテージ計算
          const total = dataset.data?.reduce((a, b) => a + b, 0) || 0;
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';

          // 学習時間値（分）を「時間:分」の直感的な形式に変換
          if (value >= 60) {
            const hours = Math.floor(value / 60); // 時間部分を計算 (例: 135分 -> 2時間)
            const minutes = value % 60; // 分部分を計算 (例: 135分 -> 15分)
            const timeStr = minutes > 0 ? `${hours}時間${minutes}分` : `${hours}時間`;
            return `${label}: ${timeStr} (${percentage}%)`;
          }

          // 60分未満の場合は「分」としてそのまま表示
          // 例: 月曜日: 45分 (8.0%)
          return `${label}: ${value}分 (${percentage}%)`;
        },
      },
    },
  },
}));
</script>
