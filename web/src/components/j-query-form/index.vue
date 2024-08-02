<template>
  <a-form ref="queryRef" :model="queryModel" label-align="left">
    <a-grid :cols="{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 5 }" :col-gap="12">
      <a-grid-item
        v-for="(item, index) of fields"
        :key="index"
        :span="
          item.type === 'rangePicker'
            ? {
                xs: 2,
                sm: 2,
                md: 2,
                lg: 2,
                xl: 2,
                xxl: 2,
              }
            : {}
        "
      >
        <a-form-item
          :field="item.field"
          :label="item.label"
          :label-col-props="
            formColProps(item.label, item.type === 'rangePicker').labelColProps
          "
          :wrapper-col-props="
            formColProps(item.label, item.type === 'rangePicker')
              .wrapperColProps
          "
        >
          <a-input
            v-if="item.type === 'input'"
            v-model="queryModel[item.field]"
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-input-number
            v-else-if="item.type === 'inputNumber'"
            v-model="queryModel[item.field]"
            :precision="item?.inputNumber?.precision ?? 2"
            :min="item?.inputNumber?.min"
            :max="item?.inputNumber?.max"
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-input-tag
            v-else-if="item.type === 'inputTag'"
            v-model="queryModel[item.field]"
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-auto-complete
            v-else-if="item.type === 'autoComplete'"
            v-model="queryModel[item.field]"
            :data="item?.options?.data"
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-mention
            v-else-if="item.type === 'mention'"
            v-model="queryModel[item.field]"
            :data="item?.options?.data"
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-select
            v-else-if="item.type === 'select'"
            v-model="queryModel[item.field]"
            :options="item?.options?.data"
            :multiple="item?.options?.multiple ?? true"
            :max-tag-count="item?.options?.maxTagCount ?? 0"
            allow-clear
            allow-search
            :placeholder="$t('common.placeholder.select')"
          />

          <a-cascader
            v-else-if="item.type === 'cascader'"
            v-model="queryModel[item.field]"
            :options="item?.options?.data"
            :field-names="
              item?.options?.fieldNames ?? DICT_CASCADER_FIELD_NAMES
            "
            :multiple="item?.options?.multiple ?? true"
            :max-tag-count="item?.options?.maxTagCount ?? 0"
            :check-strictly="item?.options?.parent ?? true"
            allow-clear
            allow-search
            :placeholder="$t('common.placeholder.select')"
          />

          <a-tree-select
            v-else-if="item.type === 'treeSelect'"
            v-model="queryModel[item.field]"
            :data="item?.options?.data"
            :field-names="item?.options?.fieldNames ?? DICT_TREE_FIELD_NAMES"
            :multiple="item?.options?.multiple ?? true"
            :max-tag-count="item?.options?.maxTagCount ?? 0"
            allow-clear
            allow-search
            :placeholder="$t('common.placeholder.select')"
          />

          <a-range-picker
            v-else-if="item.type === 'rangePicker'"
            v-model="queryModel[item.field]"
            :format="item?.rangePicker?.format ?? 'YYYY-MM-DD HH:mm:ss'"
            show-time
            allow-clear
            :placeholder="[
              $t('common.placeholder.dateTimePicker.start'),
              $t('common.placeholder.dateTimePicker.end'),
            ]"
          />
        </a-form-item>
      </a-grid-item>

      <a-grid-item>
        <a-form-item
          :label-col-props="{
            offset: 1,
          }"
        >
          <a-space :size="18">
            <a-button
              v-permission="permission"
              type="primary"
              @click="clickSearch"
            >
              <template #icon>
                <icon-search />
              </template>
              {{ $t('common.action.search') }}
            </a-button>
            <a-button @click="queryModelReset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('common.action.reset') }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-grid-item>
    </a-grid>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, PropType, watch } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import type { JQueryFormField } from '@/global/j';
  import {
    DICT_TREE_FIELD_NAMES,
    DICT_CASCADER_FIELD_NAMES,
  } from '@/global/dict';
  import { formColProps } from '@/utils/grid';

  const props = defineProps({
    modelValue: {
      type: Object as PropType<any>,
      default: () => {
        return {};
      },
    },
    fields: {
      type: Array as PropType<JQueryFormField[]>,
      default: () => {
        return [];
      },
    },
    permission: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
  });

  const emit = defineEmits(['update:modelValue', 'clickSearch']);

  // 查询表单
  const queryModel = ref(props.modelValue);

  const queryRef = ref<FormInstance>();

  /**
   * 查询条件还原
   */
  const queryModelReset = () => {
    queryRef.value?.resetFields();
    emit('clickSearch');
  };

  const clickSearch = () => {
    emit('clickSearch');
  };

  watch(
    () => props.modelValue,
    (newValue) => {
      queryModel.value = newValue;
    }
  );
</script>

<script lang="ts">
  export default {
    name: 'JQueryForm',
  };
</script>
