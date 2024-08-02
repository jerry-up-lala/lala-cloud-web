<template>
  <div class="content">
    <a-result
      class="result"
      status="404"
      :subtitle="$t('common.error.not.found')"
    >
    </a-result>
    <div class="operation-row">
      <a-button key="back" type="primary" @click="back">
        {{ $t('common.action.back') }}
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import useRouter from '@/hooks/router';

  const { router } = useRouter();
  const back = () => {
    // warning： Go to the node that has the permission
    router.push({ name: 'Workplace' });
  };
</script>

<script lang="ts">
  export default {
    name: 'NotFound',
  };
</script>

<style scoped lang="less">
  .content {
    // padding-top: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -95px;
    margin-top: -121px;
    text-align: center;
  }
</style>
