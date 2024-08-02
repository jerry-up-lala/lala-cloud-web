<template>
  <a-form ref="saveRef" :model="saveModel" :rules="rules" @submit="saveSubmit">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-form-item
          v-for="(item, index) of fields"
          :key="index"
          :field="item.field"
          :label="item.label"
        >
          <a-input
            v-if="item.type === 'input'"
            v-model="saveModel[item.field]"
            :max-length="item.input?.maxLength"
            show-word-limit
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-input-number
            v-else-if="item.type === 'inputNumber'"
            v-model="saveModel[item.field]"
            :precision="item.inputNumber?.precision ?? 2"
            :min="item.inputNumber?.min"
            :max="item.inputNumber?.max"
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-input-tag
            v-else-if="item.type === 'inputTag'"
            v-model="saveModel[item.field]"
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-auto-complete
            v-else-if="item.type === 'autoComplete'"
            v-model="saveModel[item.field]"
            :data="item?.options?.data"
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-mention
            v-else-if="item.type === 'mention'"
            v-model="saveModel[item.field]"
            :data="item?.options?.data"
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-textarea
            v-else-if="item.type === 'textArea'"
            v-model="saveModel[item.field]"
            :max-length="item?.textarea?.maxLength"
            auto-size
            show-word-limit
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-rate
            v-else-if="item.type === 'rate'"
            v-model="saveModel[item.field]"
            allow-half
            allow-clear
            :placeholder="$t('common.placeholder.input')"
          />

          <a-slider
            v-else-if="item.type === 'slider'"
            v-model="saveModel[item.field]"
            show-input
          />

          <a-switch
            v-else-if="item.type === 'switch'"
            v-model="saveModel[item.field]"
            :checked-value="item?.options?.data[0]?.values"
            :unchecked-value="item?.options?.data[1]?.values"
            :checked-text="item?.options?.data[0]?.labels"
            :unchecked-text="item?.options?.data[1]?.labels"
          />

          <a-radio-group
            v-else-if="item.type === 'radioGroup'"
            v-model="saveModel[item.field]"
            :options="item?.options?.data"
          />

          <a-checkbox-group
            v-else-if="item.type === 'checkboxGroup'"
            v-model="saveModel[item.field]"
            :options="item?.options?.data"
          />

          <a-select
            v-else-if="item.type === 'select'"
            v-model="saveModel[item.field]"
            :options="item?.options?.data"
            :multiple="item?.options?.multiple ?? false"
            :max-tag-count="item?.options?.maxTagCount ?? 0"
            allow-search
            allow-clear
            :placeholder="$t('common.placeholder.select')"
          />

          <a-cascader
            v-else-if="item.type === 'cascader'"
            v-model="saveModel[item.field]"
            :options="item?.options?.data"
            :field-names="
              item?.options?.fieldNames ?? DICT_CASCADER_FIELD_NAMES
            "
            :multiple="item?.options?.multiple ?? false"
            :check-strictly="item?.options?.parent ?? true"
            allow-search
            allow-clear
            :placeholder="$t('common.placeholder.select')"
          />

          <a-tree-select
            v-else-if="item.type === 'treeSelect'"
            v-model="saveModel[item.field]"
            :data="item?.options?.data"
            :field-names="item?.options?.fieldNames ?? DICT_TREE_FIELD_NAMES"
            :multiple="item?.options?.multiple ?? false"
            :max-tag-count="item?.options?.maxTagCount ?? 0"
            allow-search
            allow-clear
            :placeholder="$t('common.placeholder.select')"
          />

          <a-transfer
            v-else-if="item.type === 'transfer'"
            v-model="saveModel[item.field]"
            :data="item?.options?.data"
            :title="[
              $t('common.transfer.source'),
              $t('common.transfer.target'),
            ]"
            show-search
          />

          <a-date-picker
            v-else-if="item.type === 'datePicker'"
            v-model="saveModel[item.field]"
            :format="item?.datePicker?.format ?? 'YYYY-MM-DD HH:mm:ss'"
            show-time
            allow-clear
            :placeholder="$t('common.placeholder.dateTimePicker')"
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="saveLoading">{{
          $t('common.action.save')
        }}</a-button>
        <a-button @click="saveReset">{{ $t('common.action.reset') }}</a-button>
        <a-button @click="saveCancel">{{
          $t('common.action.cancel')
        }}</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref, PropType, watch } from 'vue';
  import { FormInstance, FieldRule } from '@arco-design/web-vue/es/form';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import type { JSaveFormField } from '@/global/j';
  import {
    DICT_TREE_FIELD_NAMES,
    DICT_CASCADER_FIELD_NAMES,
  } from '@/global/dict';

  const props = defineProps({
    modelValue: {
      type: Object as PropType<any>,
      default: () => {
        return {};
      },
    },
    fields: {
      type: Array as PropType<JSaveFormField[]>,
      default: () => {
        return [];
      },
    },
    rules: {
      type: Object as PropType<
        Record<string, FieldRule<any> | FieldRule<any>[]>
      >,
      default: () => {
        return [];
      },
    },
    type: {
      type: String as PropType<'add' | 'update'>,
      default: 'add',
    },
  });

  const emit = defineEmits(['update:modelValue', 'submit', 'cancel']);

  // 保存表单
  const saveModel = ref(props.modelValue);

  const saveRef = ref<FormInstance>();

  const saveLoading = ref(false);

  const saveSubmit = async ({
    errors,
  }: {
    errors: Record<string, ValidatedError> | undefined;
  }) => {
    if (saveLoading.value) return;
    if (!errors) {
      saveLoading.value = true;
      try {
        emit('submit');
        saveCancel();
      } catch (err) {
        // err
      } finally {
        saveLoading.value = false;
      }
    }
  };

  const saveReset = () => {
    saveRef.value?.resetFields();
  };

  const saveCancel = () => {
    emit('cancel');
  };

  watch(
    () => props.modelValue,
    (newValue) => {
      saveModel.value = newValue;
    }
  );
</script>

<script lang="ts">
  export default {
    name: 'JSaveForm',
  };
</script>
