<template>
  <!-- 折れ線グラフコンポーネント -->
  <Line :data="data" :options="chartOptions" />
</template>

<script setup>
// ========================================
// 外部インポート
// ========================================
import { computed } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler } from 'chart.js';
import { Line } from 'vue-chartjs';

// ========================================
// 初期設定
// ========================================
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

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
const chartOptions = computed(() => {
  // データの最大値を取得（エラー防止を追加）
  const allData = props.data?.datasets?.flatMap((d) => d.data) || [0];
  const maxValue = Math.max(...allData, 0);

  // 最大値に基づいてstepSizeを決定
  let stepSize;
  let suggestedMax;

  // 学習時間に応じてY軸の目盛りを動的に調整
  // 日別データは短時間の学習が多いため、BarChartより細かい単位（15分・30分刻み）で変動を可視化する
  if (maxValue <= 60) {
    // 1時間以下
    stepSize = 15; // 15分刻み
    suggestedMax = Math.ceil(maxValue / 15) * 15 + 15;
  } else if (maxValue <= 180) {
    // 3時間以下
    stepSize = 30; // 30分刻み
    suggestedMax = Math.ceil(maxValue / 30) * 30 + 30;
  } else if (maxValue <= 360) {
    // 6時間以下
    stepSize = 60; // 1時間刻み
    suggestedMax = Math.ceil(maxValue / 60) * 60 + 60;
  } else if (maxValue <= 720) {
    // 12時間以下
    stepSize = 120; // 2時間刻み
    suggestedMax = Math.ceil(maxValue / 120) * 120 + 120;
  } else {
    stepSize = 180; // 3時間刻み
    suggestedMax = Math.ceil(maxValue / 180) * 180 + 180;
  }

  // 最小値の保証
  suggestedMax = Math.max(suggestedMax, 30); // 最低30分は表示

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax,
        ticks: {
          stepSize,
          callback: function (value) {
            if (value === 0) return '0分';
            if (value < 60) {
              return `${value}分`;
            }
            // Y軸のラベルを「時間:分」形式で表示し、視覚的な一貫性を保つ
            const hours = Math.floor(value / 60);
            const minutes = value % 60;
            if (minutes === 0) {
              return `${hours}時間`;
            }
            return `${hours}時間${minutes}分`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            if (value < 60) {
              return `${context.dataset.label}: ${value}分`;
            }
            // ツールチップに表示する学習時間を「時間:分」形式に変換し、ユーザーが理解しやすいようにする
            const hours = Math.floor(value / 60);
            const minutes = value % 60;
            if (minutes === 0) {
              return `${context.dataset.label}: ${hours}時間`;
            }
            return `${context.dataset.label}: ${hours}時間${minutes}分`;
          },
        },
      },
    },
  };
});
</script>
