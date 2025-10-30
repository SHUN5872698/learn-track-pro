import { reactive, computed, ref } from 'vue';

export function useLearningContentForm(initialData = null) {
  const defaultState = {
    technology_id: null,
    title: '',
    description: '',
    sections: [{ id: Date.now(), title: '', order: 1 }],
    status: 'not_started',
    startImmediately: true,
  };

  const form = reactive({ ...defaultState, ...initialData });
  const initialForm = ref(JSON.stringify(form));

  const hasUnsavedChanges = computed(() => {
    return JSON.stringify(form) !== initialForm.value;
  });

  const initializeForm = (data) => {
    Object.assign(form, { ...defaultState, ...data });
    initialForm.value = JSON.stringify(form);
  };

  const resetForm = () => {
    Object.assign(form, JSON.parse(initialForm.value));
  };

  return {
    form,
    hasUnsavedChanges,
    resetForm,
    initializeForm,
  };
}
