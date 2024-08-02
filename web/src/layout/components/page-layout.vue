<template>
  <router-view v-slot="{ Component, route }">
    <breadcrumb :items="loadMetaInfo(route).breadcrumb" />

    <transition name="fade" mode="out-in" appear>
      <component
        :is="Component"
        v-if="loadMetaInfo(route).ignoreCache"
        :key="route.fullPath"
      />
      <keep-alive v-else :include="cacheList">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useTabBarStore } from '@/store';
  import { loadMetaInfo } from '@/router/meta';
  import breadcrumb from './breadcrumb.vue';

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => tabBarStore.getCacheList);
</script>
