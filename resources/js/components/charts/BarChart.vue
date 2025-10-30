<template>
  <!-- 棒グラフコンポーネント -->
  <Bar :data="data" :options="chartOptions" />
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';

// ========================================
// 初期設定
// ========================================
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// ========================================
// 算出プロパティ
// ========================================
const chartOptions = computed(() => {
  // データの最大値を取得（エラー防止を追加）
  const maxValue = props.data?.datasets?.[0]?.data ? Math.max(...props.data.datasets[0].data, 0) : 0;

  // 最大値に基づいてstepSizeを決定（キリの良い数字）
  let stepSize;
  let suggestedMax;

  // 学習時間に応じてY軸の目盛りを動的に調整し、グラフの可読性を高める
  if (maxValue <= 300) {
    // 5時間以下
    stepSize = 60; // 1時間刻み
    suggestedMax = Math.ceil(maxValue / 60) * 60 + 60;
  } else if (maxValue <= 600) {
    // 10時間以下
    stepSize = 120; // 2時間刻み
    suggestedMax = Math.ceil(maxValue / 120) * 120 + 120;
  } else if (maxValue <= 1800) {
    // 30時間以下
    stepSize = 300; // 5時間刻み
    suggestedMax = Math.ceil(maxValue / 300) * 300 + 300;
  } else {
    stepSize = 600; // 10時間刻み
    suggestedMax = Math.ceil(maxValue / 600) * 600 + 600;
  }

  // 最小値の保証
  suggestedMax = Math.max(suggestedMax, 60); // 最低1時間は表示

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            if (value === 0) return '学習時間: 0分';

            // ツールチップに表示する学習時間を「時間:分」形式に変換し、ユーザーが理解しやすいようにする
            const hours = Math.floor(value / 60);
            const minutes = value % 60;

            // フォーマット
            if (hours > 0 && minutes > 0) {
              return `学習時間: ${hours}時間${minutes}分`;
            } else if (hours > 0) {
              return `学習時間: ${hours}時間`;
            } else {
              return `学習時間: ${minutes}分`;
            }
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax,
        ticks: {
          stepSize,
          callback: function (value) {
            if (value === 0) return '0時間';
            const hours = value / 60;
            // Y軸のラベルを「時間」単位で表示し、視覚的な一貫性を保つ
            return Number.isInteger(hours) ? `${hours}時間` : '';
          },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeOutCubic',
    },
  };
});
</script>
