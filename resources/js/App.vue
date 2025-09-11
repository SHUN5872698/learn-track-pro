<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import DefaultLayout from './layouts/DefaultLayout.vue';
import AuthLayout from './layouts/AuthLayout.vue';
import { useAuth } from './composables/useAuth';

const { isAuthenticated } = useAuth();

const layout = computed(() => {
  return isAuthenticated.value ? DefaultLayout : AuthLayout;
});
</script>
