<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.crud.gen')">
      TBD
      <!-- <j-table ref="tableRef" :columns="tableColumns" :data-api="crudPageApi">
      </j-table> -->
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { JTableColumn, JOption } from '@/global/j';
  import { loadJTableColumns, Gen, GenField } from '@/global/gen';
  import { stateOptionsData } from '@/data';
  import {
    crudOptionsData,
    crudListOptionsData,
    crudTreeOptionsData,
  } from '@/data/crud';
  import {
    crudPageApi,
    crudDeleteApi,
    crudBatchDeleteApi,
    crudExportApi,
    CrudQueryParams,
    CrudExportParams,
  } from '@/api/request/crud';
  import { treeExpanded } from '@/utils/array';

  const { t } = useI18n();

  const tableRef = ref();

  const tableOptions = computed<JOption>(() => {
    return {
      state: stateOptionsData(),
      list: crudListOptionsData(t),
      tree: treeExpanded(crudListOptionsData(t)),
    };
  });

  const fields: GenField[] = [
    {
      fieldName: 'input',
      i18n: 'basic.crud.input',
    },
    {
      fieldName: 'inputNumber',
      i18n: 'basic.crud.inputNumber',
    },
    {
      fieldName: 'inputTagList',
      i18n: 'basic.crud.inputTag',
      slotType: 'tag',
    },
    {
      fieldName: 'autoComplete',
      i18n: 'basic.crud.autoComplete',
    },
    {
      fieldName: 'mention',
      i18n: 'basic.crud.mention',
    },
    {
      fieldName: 'textArea',
      i18n: 'basic.crud.textArea',
    },
    {
      fieldName: 'rate',
      i18n: 'basic.crud.rate',
    },
    {
      fieldName: 'slider',
      i18n: 'basic.crud.slider',
    },
    {
      fieldName: 'switchInfo',
      i18n: 'basic.crud.switchInfo',
    },
    {
      fieldName: 'radio',
      i18n: 'basic.crud.radio',
    },
    {
      fieldName: 'checkboxList',
      i18n: 'basic.crud.checkbox',
    },
    {
      fieldName: 'selectInfo',
      i18n: 'basic.crud.selectInfo',
    },
    {
      fieldName: 'cascader',
      i18n: 'basic.crud.cascader',
    },
    {
      fieldName: 'treeSelect',
      i18n: 'basic.crud.treeSelect',
    },
    {
      fieldName: 'transferList',
      i18n: 'basic.crud.transfer',
    },
    {
      fieldName: 'dateTimePicker',
      i18n: 'basic.crud.dateTimePicker',
    },
  ];

  // 列名
  const tableColumns = ref<JTableColumn[]>(
    loadJTableColumns({
      fields,
    })
  );
</script>

<script lang="ts">
  export default {
    name: 'CrudGen',
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
