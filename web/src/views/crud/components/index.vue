<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.crud.components')">
      <j-query-form
        v-model="queryModel"
        :fields="queryFields"
        :permission="['CRUD:COMPONENTS:QUERY']"
        @click-search="tableExposeDataRequest"
      ></j-query-form>

      <a-row>
        <a-alert :title="$t('common.info.query')" closable>
          <a-typography-paragraph type="secondary" copyable>
            {{ qs.stringify(queryModel) }}
          </a-typography-paragraph>
        </a-alert>
      </a-row>

      <a-divider style="margin-top: 0" />

      <a-space>
        <j-button
          v-permission="['CRUD:COMPONENTS:ADD']"
          type="ADD"
          @click="jumpAdd"
        />

        <j-button
          v-permission="['CRUD:COMPONENTS:UPLOAD']"
          type="UPLOAD"
          @click="jumpUpload"
        />

        <j-batch-button
          :ids="tableSelectedKeys"
          :types="[
            {
              type: 'DELETE',
              permission: ['CRUD:COMPONENTS:BATCH:DELETE'],
              api: handleBatchDelete,
              okApi: tableExposeDataRequest,
            },
            {
              type: 'EXPORT',
              permission: ['CRUD:COMPONENTS:EXPORT'],
              api: handleExport,
            },
          ]"
        />
      </a-space>

      <j-table
        ref="tableRef"
        v-model:selectedKeys="tableSelectedKeys"
        v-model:current="tableCurrent"
        v-model:pageSize="tablePageSize"
        :query="queryModel"
        :columns="tableColumns"
        :data-api="crudPageApi"
        :refresh-permission="['CRUD:COMPONENTS:QUERY']"
        :scroll="{
          x: 2000,
        }"
        selection
        pagination
      >
        <template #operate="{ record }">
          <j-button
            v-permission="['CRUD:COMPONENTS:UPDATE']"
            type="UPDATE"
            @click="jumpUpdate(record.id)"
          />

          <j-delete
            :id="record.id"
            :permission="['CRUD:COMPONENTS:DELETE']"
            :api="handleDelete"
            @ok="tableExposeDataRequest"
          />
        </template>
      </j-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import qs from 'query-string';
  import useRouter from '@/hooks/router';
  import {
    crudPageApi,
    crudDeleteApi,
    crudBatchDeleteApi,
    crudExportApi,
    CrudQueryParams,
    CrudExportParams,
  } from '@/api/request/crud';
  import { crudOptions } from '@/data/crud';
  import { downloadXlsx } from '@/utils/blob';
  import { JQueryFormField, JTableColumn } from '@/global/j';

  const { t } = useI18n();

  const { router } = useRouter();

  const {
    crudListLabelsOptions,
    crudListOptions,
    crudSwitchInfoOptions,
    crudTreeOptions,
    crudTreeExpandedOptions,
  } = crudOptions();

  /**
   * 初始化查询条件
   */
  const queryModelDefault = (): CrudQueryParams => {
    return {
      input: '',
      inputTagList: [],
      autoComplete: '',
      mention: '',
      textArea: '',
      switchInfo: '',
      radioList: [],
      checkboxList: [],
      selectInfoList: [],
      cascaderList: [],
      treeSelectList: [],
      transferList: [],
      dateTimePickerRang: [],
    };
  };

  // 查询表单
  const queryModel = ref(queryModelDefault());

  // 查询字段
  const queryFields = ref<JQueryFormField[]>([
    {
      field: 'input',
      label: t('basic.crud.input'),
      type: 'input',
    },
    {
      field: 'inputNumberStart',
      label: t('basic.crud.inputNumberStart'),
      type: 'inputNumber',
    },
    {
      field: 'inputNumberEnd',
      label: t('basic.crud.inputNumberEnd'),
      type: 'inputNumber',
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
      type: 'input',
    },
    {
      field: 'rateStart',
      label: t('basic.crud.rateStart'),
      type: 'inputNumber',
      inputNumber: {
        precision: 1,
        min: 0,
        max: 5,
      },
    },
    {
      field: 'rateEnd',
      label: t('basic.crud.rateEnd'),
      type: 'inputNumber',
      inputNumber: {
        precision: 1,
        min: 0,
        max: 5,
      },
    },
    {
      field: 'sliderStart',
      label: t('basic.crud.sliderStart'),
      type: 'inputNumber',
      inputNumber: {
        precision: 0,
        min: 0,
        max: 100,
      },
    },
    {
      field: 'sliderEnd',
      label: t('basic.crud.sliderEnd'),
      type: 'inputNumber',
      inputNumber: {
        precision: 0,
        min: 0,
        max: 100,
      },
    },
    {
      field: 'switchInfo',
      label: t('basic.crud.switchInfo'),
      type: 'select',
      options: {
        data: crudSwitchInfoOptions.value,
        multiple: false,
      },
    },
    {
      field: 'radioList',
      label: t('basic.crud.radio'),
      type: 'select',
      options: {
        data: crudListOptions.value,
        maxTagCount: 1,
      },
    },
    {
      field: 'checkboxList',
      label: t('basic.crud.checkbox'),
      type: 'select',
      options: {
        data: crudListOptions.value,
        maxTagCount: 1,
      },
    },
    {
      field: 'selectInfoList',
      label: t('basic.crud.selectInfo'),
      type: 'select',
      options: {
        data: crudListOptions.value,
        maxTagCount: 1,
      },
    },
    {
      field: 'cascaderList',
      label: t('basic.crud.cascader'),
      type: 'cascader',
      options: {
        data: crudTreeOptions.value,
        maxTagCount: 1,
      },
    },
    {
      field: 'treeSelectList',
      label: t('basic.crud.treeSelect'),
      type: 'treeSelect',
      options: {
        data: crudTreeOptions.value,
        maxTagCount: 1,
      },
    },
    {
      field: 'transferList',
      label: t('basic.crud.transfer'),
      type: 'select',
      options: {
        data: crudListOptions.value,
        maxTagCount: 1,
      },
    },
    {
      field: 'dateTimePickerRang',
      label: t('basic.crud.dateTimePicker'),
      type: 'rangePicker',
    },
  ]);

  const tableRef = ref();

  // 列名
  const tableColumns = ref<JTableColumn[]>([
    {
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      slotType: '#',
      width: 65,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.input'),
      dataIndex: 'input',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.inputNumber'),
      dataIndex: 'inputNumber',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.inputTag'),
      dataIndex: 'inputTagList',
      slotName: 'inputTagList',
      slotType: 'tag',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.autoComplete'),
      dataIndex: 'autoComplete',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.mention'),
      dataIndex: 'mention',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.textArea'),
      dataIndex: 'textArea',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.rate'),
      dataIndex: 'rate',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.slider'),
      dataIndex: 'slider',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.switchInfo'),
      dataIndex: 'switchInfo',
      slotName: 'switchInfo',
      slotType: 'tag',
      ellipsis: true,
      tooltip: true,
      options: {
        data: crudSwitchInfoOptions.value,
      },
    },
    {
      title: t('basic.crud.radio'),
      dataIndex: 'radio',
      slotName: 'radio',
      slotType: 'tag',
      ellipsis: true,
      tooltip: true,
      options: {
        data: crudListOptions.value,
      },
    },
    {
      title: t('basic.crud.checkbox'),
      dataIndex: 'checkboxList',
      slotName: 'checkboxList',
      slotType: 'tag',
      ellipsis: true,
      tooltip: true,
      options: {
        data: crudListOptions.value,
      },
    },
    {
      title: t('basic.crud.selectInfo'),
      dataIndex: 'selectInfo',
      slotName: 'selectInfo',
      slotType: 'tag',
      ellipsis: true,
      tooltip: true,
      options: {
        data: crudListOptions.value,
      },
    },
    {
      title: t('basic.crud.cascader'),
      dataIndex: 'cascader',
      slotName: 'cascader',
      slotType: 'tag',
      ellipsis: true,
      tooltip: true,
      options: {
        data: crudTreeExpandedOptions.value,
      },
    },
    {
      title: t('basic.crud.treeSelect'),
      dataIndex: 'treeSelect',
      slotName: 'treeSelect',
      slotType: 'tag',
      ellipsis: true,
      tooltip: true,
      options: {
        data: crudTreeExpandedOptions.value,
      },
    },
    {
      title: t('basic.crud.transfer'),
      dataIndex: 'transferList',
      slotName: 'transferList',
      slotType: 'tag',
      ellipsis: true,
      tooltip: true,
      options: {
        data: crudTreeExpandedOptions.value,
      },
    },
    {
      title: t('basic.crud.dateTimePicker'),
      dataIndex: 'dateTimePicker',
      width: 180,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.action.operate'),
      slotName: 'operate',
      width: 160,
      fixed: 'right',
    },
  ]);

  const tableSelectedKeys = ref<string[]>([]);

  const tableCurrent = ref<number>();

  const tablePageSize = ref<number>();

  const tableExposeDataRequest = async () => {
    if (tableRef.value) {
      await tableRef.value.tableDataRequest();
    }
  };

  const tableExposeSelectionChange = (ids: any[]) => {
    if (tableRef.value) {
      tableRef.value.tableSelectionChange(ids);
    }
  };

  const jumpAdd = () => {
    router.push({ name: 'CrudComponentsAdd' });
  };

  const jumpUpdate = (recordId: string) => {
    router.push({ name: 'CrudComponentsUpdate', query: { id: recordId } });
  };

  const jumpUpload = () => {
    router.push({ name: 'CrudComponentsUpload' });
  };

  const handleDelete = async (id: any) => {
    await crudDeleteApi(id);
    tableExposeSelectionChange(
      tableSelectedKeys.value.filter((item) => item !== id)
    );
  };

  const handleBatchDelete = async (ids: any) => {
    await crudBatchDeleteApi({ value: ids });
    tableExposeSelectionChange([]);
  };

  const crudExportParams = (type: number): CrudExportParams => {
    // 导出全部
    if (type === 1) {
      return queryModel.value;
    }
    // 导出当前页
    if (type === 2) {
      return {
        current: tableCurrent.value,
        pageSize: tablePageSize.value,
        currentPage: true,
        ...queryModel.value,
      };
    }
    // 导出所选
    return {
      ids: tableSelectedKeys.value,
    };
  };

  const handleExport = async (type: number) => {
    try {
      const params: CrudExportParams = crudExportParams(type);
      const res: any = await crudExportApi(params);
      downloadXlsx(res);
    } catch (err) {
      // do err
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'CrudComponents',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
