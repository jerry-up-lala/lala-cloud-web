<template>
  <a-space>
    <a-tag v-for="(tag, index) of tagList" :key="index" :color="tag.color">
      {{ tag.label }}
    </a-tag>
  </a-space>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { randomColor } from '@/utils/color';
  import { isArray } from '@/utils/is';

  const props = defineProps({
    value: {
      type: [Number, String, Boolean, Object, Array] as PropType<
        number | string | boolean | object | number[] | string[] | object[]
      >,
      default: () => {
        return {};
      },
    },
    options: {
      type: Array as PropType<any[]>,
      default: () => {
        return [];
      },
    },
    valueField: {
      type: String as PropType<string>,
      default: 'values',
    },
    labelField: {
      type: String as PropType<string>,
      default: 'label',
    },
  });

  interface JTagValue {
    color?: string;
    label?: object;
  }

  const findTag = (
    options: any[],
    value: any,
    valueField = 'values',
    labelField = 'label',
    colorIndex = 0
  ): JTagValue => {
    const tag: JTagValue = {};
    const option = options?.find(
      (item) => `${item[valueField]}` === `${value}`
    );
    if (option) {
      tag.label = option[labelField];
      tag.color =
        option?.color ??
        randomColor(
          options?.findIndex((item) => `${item[valueField]}` === `${value}`)
        );
    } else {
      tag.label = value;
      tag.color = randomColor(colorIndex);
    }
    return tag;
  };

  const tagDefault = (): JTagValue[] => {
    const { options, value, valueField, labelField } = props;
    if (isArray(value)) {
      return value.map((item, index) =>
        findTag(options, item, valueField, labelField, index)
      );
    }
    return [findTag(options, value, valueField, labelField)];
  };

  // 标签值
  const tagList = ref<JTagValue[]>(tagDefault());
</script>

<script lang="ts">
  export default {
    name: 'JTag',
  };
</script>
