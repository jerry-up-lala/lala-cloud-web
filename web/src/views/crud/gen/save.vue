<template>
  <div class="container">
    <a-spin
      style="width: 100%"
      :loading="formLoading"
      :tip="$t('common.loading.info')"
    >
      <a-card class="general-card" :title="cardTitle">
        <a-form
          ref="formRef"
          :model="formModel"
          :rules="saveRules"
          @submit="formSubmit"
        >
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="input" :label="$t('basic.crud.input')">
                <a-input
                  v-model="formModel.input"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="15"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="inputNumber"
                :label="$t('basic.crud.inputNumber')"
              >
                <a-input-number
                  v-model="formModel.inputNumber"
                  :placeholder="$t('common.placeholder.input')"
                  :precision="2"
                  :min="0"
                  :max="1000000000000"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="inputTagList"
                :label="$t('basic.crud.inputTag')"
              >
                <a-input-tag
                  v-model="formModel.inputTagList"
                  allow-clear
                  :placeholder="$t('common.placeholder.input')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="autoComplete"
                :label="$t('basic.crud.autoComplete')"
              >
                <a-auto-complete
                  v-model="formModel.autoComplete"
                  :data="crudOptions"
                  :placeholder="$t('common.placeholder.input')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="mention" :label="$t('basic.crud.mention')">
                <a-mention
                  v-model="formModel.mention"
                  :data="crudOptions"
                  :placeholder="$t('common.placeholder.input')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="textArea" :label="$t('basic.crud.textArea')">
                <a-textarea
                  v-model="formModel.textArea"
                  :max-length="200"
                  show-word-limit
                  allow-clear
                  :placeholder="$t('common.placeholder.input')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="rate" :label="$t('basic.crud.rate')">
                <a-rate v-model="formModel.rate" allow-half allow-clear />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="slider" :label="$t('basic.crud.slider')">
                <a-slider v-model="formModel.slider" show-input />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="switchInfo"
                :label="$t('basic.crud.switchInfo')"
              >
                <a-switch
                  v-model="formModel.switchInfo"
                  :checked-text="$t('common.enum.effective')"
                  :unchecked-text="$t('common.enum.invalid')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="radio" :label="$t('basic.crud.radio')">
                <a-radio-group
                  v-model="formModel.radio"
                  :options="crudArrayOptions"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="checkboxList"
                :label="$t('basic.crud.checkbox')"
              >
                <a-checkbox-group
                  v-model="formModel.checkboxList"
                  :options="crudArrayOptions"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="selectInfo"
                :label="$t('basic.crud.selectInfo')"
              >
                <a-select
                  v-model="formModel.selectInfo"
                  :options="crudSelectOptions"
                  :placeholder="$t('common.placeholder.select')"
                  allow-clear
                  allow-search
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="cascader" :label="$t('basic.crud.cascader')">
                <a-cascader
                  v-model="formModel.cascader"
                  :options="crudCascaderOptions"
                  :placeholder="$t('common.placeholder.select')"
                  allow-clear
                  allow-search
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="treeSelect"
                :label="$t('basic.crud.treeSelect')"
              >
                <a-tree-select
                  v-model="formModel.treeSelect"
                  :data="crudTreeOptions"
                  :placeholder="$t('common.placeholder.select')"
                  allow-clear
                  allow-search
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="transferList"
                :label="$t('basic.crud.transfer')"
              >
                <a-transfer
                  v-model="formModel.transferList"
                  :data="crudTransferOptions"
                  :title="[
                    $t('common.transfer.source'),
                    $t('common.transfer.target'),
                  ]"
                  show-search
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="dateTimePicker"
                :label="$t('basic.crud.dateTimePicker')"
              >
                <a-date-picker
                  v-model="formModel.dateTimePicker"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  :placeholder="$t('common.placeholder.dateTimePicker')"
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit" :loading="loading">{{
                $t('common.action.save')
              }}</a-button>
              <a-button @click="formModelReset">{{
                $t('common.action.reset')
              }}</a-button>
              <a-button @click="formCancel">{{
                $t('common.action.cancel')
              }}</a-button>
            </a-space>
          </a-form-item>
        </a-form>

        {{ formModel }}
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    crudOptionsData,
    crudListOptionsData,
    crudTreeOptionsData,
    crudTransferOptionsData,
  } from '@/data/crud';
  import useLoading from '@/hooks/loading';
  import useRouter from '@/hooks/router';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TreeNodeData } from '@arco-design/web-vue/es/tree/interface';
  import type { CascaderOption } from '@arco-design/web-vue/es/cascader';
  import type { RadioOption } from '@arco-design/web-vue/es/radio/interface';
  import type { CheckboxOption } from '@arco-design/web-vue/es/checkbox/interface';
  import type { TransferItem } from '@arco-design/web-vue/es/transfer/interface';
  import { Message } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import {
    crudInfoApi,
    crudAddApi,
    crudUpdateApi,
    CrudDataBody,
  } from '@/api/request/crud';

  const { t } = useI18n();

  const { route, tabClose } = useRouter();

  const id = ref<string>(route.query?.id ? String(route.query?.id) : '');

  const cardTitle = ref<string>(
    id.value
      ? `${t('common.action.update')}(${id.value})`
      : t('common.action.add')
  );

  const crudOptions = computed<string[]>(() => crudOptionsData(t));

  const crudSelectOptions = computed<SelectOptionData[]>(() =>
    crudListOptionsData(t)
  );

  const crudCascaderOptions = computed<CascaderOption[]>(() =>
    crudListOptionsData(t)
  );

  const crudTransferOptions = computed<TransferItem[]>(() =>
    crudTransferOptionsData(t)
  );

  const crudArrayOptions = computed<Array<RadioOption | CheckboxOption>>(() =>
    crudListOptionsData(t)
  );

  const crudTreeOptions = computed<TreeNodeData[]>(() =>
    crudTreeOptionsData(t)
  );

  const saveModelDefault = (): CrudDataBody => {
    return {
      id: '',
      input: '输入框',
      inputNumber: 1,
      inputTagList: ['标签输入框'],
      autoComplete: '自动补全',
      mention: '@编码',
      textArea: '文本域',
      rate: 0.5,
      slider: 1,
      switchInfo: 'false',
      radio: '1',
      checkboxList: ['1'],
      selectInfo: '1',
      cascader: '4',
      treeSelect: '4',
      transferList: ['1'],
      dateTimePicker: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      upload: '',
    };
  };

  // 加载详情
  const formLoading = ref(false);

  const { loading, setLoading } = useLoading();

  const formRef = ref<FormInstance>();

  const formModel = ref<CrudDataBody>(saveModelDefault());

  /**
   * 编辑初始化查询
   */
  const updateDefaultRequest = async () => {
    formLoading.value = true;
    try {
      const { data } = await crudInfoApi(id.value);
      formModel.value = data;
    } catch (err) {
      // catch
    } finally {
      formLoading.value = false;
    }
  };

  // 保存表单规则
  const saveRules = {
    input: [
      {
        required: true,
        message: t('basic.crud.input') + t('common.required.enter'),
      },
    ],
    inputNumber: [
      {
        required: true,
        message: t('basic.crud.inputNumber') + t('common.required.enter'),
      },
    ],
    inputTag: [
      {
        required: true,
        message: t('basic.crud.inputTag') + t('common.required.enter'),
      },
    ],
    autoComplete: [
      {
        required: true,
        message: t('basic.crud.autoComplete') + t('common.required.enter'),
      },
    ],
    mention: [
      {
        required: true,
        message: t('basic.crud.mention') + t('common.required.enter'),
      },
    ],
    textArea: [
      {
        required: true,
        message: t('basic.crud.textArea') + t('common.required.enter'),
      },
    ],
    rate: [
      {
        required: true,
        message: t('basic.crud.rate') + t('common.required.select'),
      },
    ],
    slider: [
      {
        required: true,
        message: t('basic.crud.slider') + t('common.required.select'),
      },
    ],
    switchInfo: [
      {
        required: true,
        message: t('basic.crud.switchInfo') + t('common.required.select'),
      },
    ],
    radio: [
      {
        required: true,
        message: t('basic.crud.radio') + t('common.required.select'),
      },
    ],
    checkbox: [
      {
        required: true,
        message: t('basic.crud.checkbox') + t('common.required.select'),
      },
    ],
    selectInfo: [
      {
        required: true,
        message: t('basic.crud.selectInfo') + t('common.required.select'),
      },
    ],
    cascader: [
      {
        required: true,
        message: t('basic.crud.cascader') + t('common.required.select'),
      },
    ],
    treeSelect: [
      {
        required: true,
        message: t('basic.crud.treeSelect') + t('common.required.select'),
      },
    ],
    transfer: [
      {
        required: true,
        message: t('basic.crud.transfer') + t('common.required.select'),
      },
    ],
    dateTimePicker: [
      {
        required: true,
        message: t('basic.crud.dateTimePicker') + t('common.required.select'),
      },
    ],
  };

  const formSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        if (id.value) {
          await crudUpdateApi(id.value, values as CrudDataBody);
          Message.success(t('common.success.update'));
        } else {
          await crudAddApi(values as CrudDataBody);
          Message.success(t('common.success.add'));
        }
        formCancel();
      } catch (err) {
        // err
      } finally {
        setLoading(false);
      }
    }
  };

  const formModelReset = () => {
    if (id.value) {
      updateDefaultRequest();
    } else {
      formRef.value?.resetFields();
    }
  };

  const formCancel = () => {
    tabClose('CrudGen');
  };

  onMounted(() => {
    if (id.value) {
      updateDefaultRequest();
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'CrudGenSave',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
