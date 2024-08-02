<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.dev.empty')">
      <a-alert type="warning" banner center closable :show-icon="false">
        <template #title> {{ $t('common.tip') }} </template>
        {{ $t('common.test') }}
      </a-alert>
    </a-card>
  </div>
</template>

<script lang="ts" setup></script>

<script lang="ts">
  export default {
    name: 'Empty',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
