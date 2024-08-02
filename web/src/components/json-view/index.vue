<template>
  <vue-json-pretty
    :deep="3"
    :show-length="true"
    :show-icon="true"
    :data="data"
  />
</template>

<script lang="ts" setup>
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  defineProps({
    data: {
      type: Object,
      required: true,
    },
  });
</script>

<script lang="ts">
  export default {
    name: 'JsonView',
  };
</script>
