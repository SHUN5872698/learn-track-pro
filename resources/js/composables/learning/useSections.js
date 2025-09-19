import { computed } from 'vue';
import { useSectionStore } from '@/stores/sections';
import { useSectionStatus as useSectionStatusHelpers } from '@/composables/useSectionStatus';

// セクション関連のデータと操作ロジックを提供するコンポーザブル
export function useSections() {
  const sectionStore = useSectionStore();
  const { normalizeStatus, toggleSectionComplete } = useSectionStatusHelpers();

  const sections = computed(() => sectionStore.sections);

  const updateSectionStatus = (sectionId, newStatus) => {
    return sectionStore.updateSectionStatus(sectionId, newStatus);
  };


  const updateSections = (contentId, { sections: updatedSections, deletedIds }) => {
    const data = {
      sections: updatedSections.map((s, index) => ({
        // 新規セクションはIDが文字列で始まるため、nullに変換してバックエンドで新規作成を識別
        id: s.id.toString().startsWith('new_') ? null : s.id,
        title: s.title,
        order: index + 1,
      })),
      deleted_section_ids: deletedIds || [],
    };
    return sectionStore.bulkUpdateSections(contentId, data);
  };

  return {
    sections,
    updateSectionStatus,
    updateSections,
    normalizeStatus,
    toggleSectionComplete,
    fetchSections: (contentId) => sectionStore.fetchSections(contentId),
    loading: computed(() => sectionStore.loading),
    error: computed(() => sectionStore.error),
  };
}
