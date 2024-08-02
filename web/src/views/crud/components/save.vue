<template>
  <div class="container">
    <a-spin
      style="width: 100%"
      :loading="loading"
      :tip="$t('common.loading.info')"
    >
      <a-card class="general-card" :title="cardTitle">
        <a-row :gutter="24">
          <a-col :span="12">
            <j-save-form
              v-model="saveModel"
              :type="saveType"
              :fields="saveFields"
              :rules="saveRules"
              @submit="handleSubmit"
              @cancel="handleCancel"
            ></j-save-form>
          </a-col>

          <a-col :span="12">
            <a-card :title="$t('common.info.requestBody')">
              <a-space direction="vertical">
                <a-button
                  type="outline"
                  size="mini"
                  @click="copyAction(JSON.stringify(saveModel))"
                  >{{
                    $t('common.action.copy') + $t('common.info.requestBody')
                  }}
                </a-button>
                <json-view :data="saveModel" />
              </a-space>
            </a-card>
          </a-col>
        </a-row>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import useRouter from '@/hooks/router';
  import { Message } from '@arco-design/web-vue';
  import { JSaveFormField } from '@/global/j';
  import dayjs from 'dayjs';
  import { copyAction } from '@/utils/copy';
  import { crudOptions } from '@/data/crud';
  import {
    crudInfoApi,
    crudAddApi,
    crudUpdateApi,
    CrudDataBody,
  } from '@/api/request/crud';

  const { t } = useI18n();

  const { route, tabClose } = useRouter();

  const {
    crudListLabelsOptions,
    crudListOptions,
    crudSwitchInfoOptions,
    crudTreeOptions,
  } = crudOptions();

  const id = ref<string>(route.query?.id ? String(route.query?.id) : '');

  const cardTitle = ref<string>(
    id.value
      ? `${t('common.action.update')}(${id.value})`
      : t('common.action.add')
  );

  const saveModelDefault = (): CrudDataBody => {
    return {
      id: '',
      input: '输入框',
      inputNumber: 1,
      inputTagList: ['标签输入框'],
      autoComplete: 'F1',
      mention: '@编码',
      textArea: '文本域',
      rate: 0.5,
      slider: 1,
      switchInfo: 'true',
      radio: '1',
      checkboxList: ['1'],
      selectInfo: '1',
      cascader: '1-4',
      treeSelect: '1-4',
      transferList: ['1'],
      dateTimePicker: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      upload: '',
    };
  };

  // 加载详情
  const { loading, setLoading } = useLoading();

  const saveType = computed(() => {
    return id.value ? 'update' : 'add';
  });

  const saveModel = ref<CrudDataBody>(saveModelDefault());

  /**
   * 编辑初始化查询
   */
  const crudInfoRequest = async () => {
    setLoading(true);
    try {
      const { data } = await crudInfoApi(id.value);
      saveModel.value = data;
    } catch (err) {
      // catch
    } finally {
      setLoading(false);
    }
  };

  // 查询字段
  const saveFields = ref<JSaveFormField[]>([
    {
      field: 'input',
      label: t('basic.crud.input'),
      type: 'input',
      input: {
        maxLength: 15,
      },
    },
    {
      field: 'inputNumber',
      label: t('basic.crud.inputNumber'),
      type: 'inputNumber',
      inputNumber: {
        precision: 2,
        min: 0,
        max: 10000,
      },
    },
    {
      field: 'inputTagList',
      label: t('basic.crud.inputTag'),
      type: 'inputTag',
    },
    {
      field: 'autoComplete',
      label: t('basic.crud.autoComplete'),
      type: 'autoComplete',
      options: {
        data: crudListLabelsOptions.value,
      },
    },
    {
      field: 'mention',
      label: t('basic.crud.mention'),
      type: 'mention',
      options: {
        data: crudListLabelsOptions.value,
      },
    },
    {
      field: 'textArea',
      label: t('basic.crud.textArea'),
      type: 'textArea',
      textarea: {
        maxLength: 200,
      },
    },
    {
      field: 'rate',
      label: t('basic.crud.rate'),
      type: 'rate',
    },
    {
      field: 'slider',
      label: t('basic.crud.slider'),
      type: 'slider',
    },
    {
      field: 'switchInfo',
      label: t('basic.crud.switchInfo'),
      type: 'switch',
      options: {
        data: crudSwitchInfoOptions.value,
      },
    },
    {
      field: 'radio',
      label: t('basic.crud.radio'),
      type: 'radioGroup',
      options: {
        data: crudListOptions.value,
      },
    },
    {
      field: 'checkboxList',
      label: t('basic.crud.checkbox'),
      type: 'checkboxGroup',
      options: {
        data: crudListOptions.value,
      },
    },
    {
      field: 'selectInfo',
      label: t('basic.crud.selectInfo'),
      type: 'select',
      options: {
        data: crudListOptions.value,
      },
    },
    {
      field: 'cascader',
      label: t('basic.crud.cascader'),
      type: 'cascader',
      options: {
        data: crudTreeOptions.value,
      },
    },
    {
      field: 'treeSelect',
      label: t('basic.crud.treeSelect'),
      type: 'treeSelect',
      options: {
        data: crudTreeOptions.value,
      },
    },
    {
      field: 'transferList',
      label: t('basic.crud.transfer'),
      type: 'transfer',
      options: {
        data: crudListOptions.value,
      },
    },
    {
      field: 'dateTimePicker',
      label: t('basic.crud.dateTimePicker'),
      type: 'datePicker',
    },
  ]);

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
    inputTagList: [
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
    checkboxList: [
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
    transferList: [
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

  const handleSubmit = async () => {
    if (id.value) {
      await crudUpdateApi(id.value, saveModel.value);
      Message.success(t('common.success.update'));
    } else {
      await crudAddApi(saveModel.value);
      Message.success(t('common.success.add'));
    }
  };

  const handleCancel = () => {
    tabClose('CrudComponents');
  };

  onMounted(() => {
    if (id.value) {
      crudInfoRequest();
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'CrudComponentsSave',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
