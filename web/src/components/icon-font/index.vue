<template>
  <icon-font :type="type" :size="size" />
</template>

<script lang="ts" setup>
  import { Icon } from '@arco-design/web-vue';

  defineProps({
    type: {
      type: String,
      default: '',
      required: true,
    },
    size: {
      type: Number,
      default: 20,
      required: false,
    },
  });

  const IconFont = Icon.addFromIconFontCn({
    src: 'https://at.alicdn.com/t/c/font_4421765_pmhmo5sq3gs.js',
  });
</script>

<script lang="ts">
  export default {
    name: 'IconFont',
  };
</script>
