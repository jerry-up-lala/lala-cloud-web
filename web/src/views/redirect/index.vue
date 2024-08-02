<template>
  <div></div>
</template>

<script lang="ts" setup>
  import useRouter from '@/hooks/router';

  const { route, router } = useRouter();

  const gotoPath = route.params.path as string;

  router.replace({ path: gotoPath });
</script>

<script lang="ts">
  export default {
    name: 'Redirect',
  };
</script>

<style scoped lang="less"></style>
