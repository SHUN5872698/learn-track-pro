import { ref } from 'vue';

// 現在開いているメニューのIDを管理するグローバルな状態
const activeMenuId = ref(null);

// 開くメニューを設定する関数
const setActiveMenu = (id) => {
  activeMenuId.value = id;
};

export function useMenuState() {
  return {
    activeMenuId,
    setActiveMenu,
  };
}
