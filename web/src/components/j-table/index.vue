<template>
  <a-row align="center">
    <a-col :span="12" :offset="12" class="setting-col">
      <!-- 刷新按钮 -->
      <a-tooltip :content="$t('common.action.refresh')">
        <div
          v-permission="refreshPermission"
          class="action-icon"
          @click="tableDataRequest"
        >
          <icon-refresh size="18" />
        </div>
      </a-tooltip>
      <!-- 密度 -->
      <a-dropdown @select="handleSelectTableSize">
        <a-tooltip :content="$t('common.table.density')">
          <div class="action-icon"><icon-line-height size="18" /></div>
        </a-tooltip>
        <template #content>
          <a-doption
            v-for="item in tableSizeList"
            :key="item.value"
            :value="item.value"
            :class="{ active: item.value === tableSize }"
          >
            <span>{{ item.name }}</span>
          </a-doption>
        </template>
      </a-dropdown>
      <!-- 列设置 -->
      <a-tooltip :content="$t('common.table.columnSetting')">
        <a-popover
          trigger="click"
          position="bl"
          @popup-visible-change="handleChangeTableColumnSort"
        >
          <div class="action-icon"><icon-settings size="18" /></div>
          <template #content>
            <div id="tableSetting">
              <div
                v-for="(item, index) in settingColumns"
                :key="item.dataIndex"
                class="setting"
              >
                <div style="margin-right: 4px; cursor: move">
                  <icon-drag-arrow />
                </div>
                <div>
                  <a-checkbox
                    v-model="item.checked"
                    @change="
                      handleChangTableColumnShow(
                        $event,
                        item as JTableColumn,
                        index
                      )
                    "
                  >
                  </a-checkbox>
                </div>
                <div class="title">
                  {{ item.title }}
                </div>
              </div>
            </div>
          </template>
        </a-popover>
      </a-tooltip>
    </a-col>
  </a-row>

  <!-- 分页列表 -->
  <a-table
    v-model:selected-keys="tableSelectedKeys"
    :loading="loading || tableLoading"
    :pagination="pagination ? tablePagination : false"
    :row-selection="tableRowSelection"
    :size="tableSize"
    :data="dataApi ? tableData : data"
    :columns="tableColumns"
    :row-key="rowKey"
    :scroll="scroll"
    stripe
    column-resizable
    table-layout-fixed
    :bordered="{ cell: true }"
    @page-change="tablePageCurrentChange"
    @page-size-change="tablePageSizeChange"
    @selection-change="tableSelectionChange"
  >
    <template
      v-for="tableCellSlotName in tableCellSlotNames"
      :key="tableCellSlotName"
      #[tableCellSlotName]="{ record, column, rowIndex }"
    >
      <slot
        :name="tableCellSlotName"
        :record="record"
        :column="column"
        :row-index="rowIndex"
      >
        <div v-if="column.slotType && column.slotType === 'tag'">
          <j-tag
            :value="record[tableCellSlotName]"
            :options="column?.options?.data"
            :value-field="column.valueField"
            :label-field="column.labelField"
          />
        </div>
        <div v-else-if="column.slotType && column.slotType === '#'">
          {{
            rowIndex +
            1 +
            (pagination
              ? ((tablePagination?.current ?? 0) - 1) *
                (tablePagination?.pageSize ?? 0)
              : 0)
          }}
        </div>
        <div v-else> {{ record[tableCellSlotName] }}</div>
      </slot>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
  import { ref, computed, reactive, nextTick, watch, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import Sortable from 'sortablejs';
  import cloneDeep from 'lodash/cloneDeep';
  import type {
    TableData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import { arrayExchange } from '@/utils/array';
  import { PageR, R } from '@/global/body';
  import { TableSize, TableRowSelectionDefault } from '@/global/table';
  import { JTableColumn } from '@/global/j';

  const { t } = useI18n();

  const props = defineProps({
    scroll: {
      type: Object as PropType<{
        x?: number | string;
        y?: number | string;
        minWidth?: number | string;
        maxHeight?: number | string;
      }>,
      default: () => {
        return {};
      },
    },
    loading: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    selection: {
      type: [Object, Boolean] as PropType<boolean | TableRowSelection>,
      default: false,
    },
    selectedKeys: {
      type: Array as PropType<(string | number)[]>,
      default: () => {
        return [];
      },
    },
    current: {
      type: Number as PropType<number>,
    },
    pageSize: {
      type: Number as PropType<number>,
    },
    pagination: {
      type: [Boolean, Object] as PropType<boolean | PaginationProps>,
      default: false,
    },
    columns: {
      type: Array as PropType<JTableColumn[]>,
      default: () => {
        return [];
      },
    },
    data: {
      type: Array as PropType<TableData[]>,
      default: () => {
        return [];
      },
    },
    dataApi: {
      type: Function as PropType<(param: any) => Promise<PageR<any> | R<any>>>,
    },
    query: {
      type: [String, Number, Object] as PropType<any>,
      default: () => {
        return {};
      },
    },
    refreshPermission: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
  });

  const emit = defineEmits([
    'update:selectedKeys',
    'update:current',
    'update:pageSize',
  ]);

  const tableSelectedKeys = ref<(string | number)[]>(props.selectedKeys);

  const tableSelectionChange = (rowKeys: (string | number)[]) => {
    tableSelectedKeys.value = rowKeys;
    emit('update:selectedKeys', rowKeys);
  };

  const tableRowSelectionDefault = () => {
    if (!props.selection) {
      return undefined;
    }
    return props.selection === true
      ? { ...TableRowSelectionDefault }
      : props.selection;
  };

  const tableCellSlotNamesDefault = (): string[] => {
    const tableCellSlotNames: string[] = [];
    props.columns.forEach((columns) => {
      if (columns.slotName) {
        tableCellSlotNames.push(columns.slotName);
      }
    });
    return tableCellSlotNames;
  };

  const tablePaginationDefault = (): PaginationProps => {
    if (props.pagination === true) {
      emit('update:current', 1);
      emit('update:pageSize', 20);
      return {
        current: 1,
        pageSize: 20,
        showTotal: true,
        showJumper: true,
        showPageSize: true,
        pageSizeOptions: [20, 50, 100, 200],
      };
    }
    if (props.pagination) {
      emit('update:current', props.pagination.current);
      emit('update:pageSize', props.pagination.pageSize);
      return props.pagination;
    }
    return {};
  };

  // 列名
  const defaultColumns = computed<JTableColumn[]>(() => props.columns);

  // 配置字段
  const settingColumns = ref<JTableColumn[]>([]);

  // 列表字段
  const tableColumns = ref<JTableColumn[]>([]);

  // 列表密度
  const tableSize = ref<TableSize>('medium');

  // 列表密度选择项
  const tableSizeList = computed(() => [
    {
      name: t('common.table.size.mini'),
      value: 'mini',
    },
    {
      name: t('common.table.size.small'),
      value: 'small',
    },
    {
      name: t('common.table.size.medium'),
      value: 'medium',
    },
    {
      name: t('common.table.size.large'),
      value: 'large',
    },
  ]);

  // 列表数据
  const tableData = ref<TableData[]>();

  // 选择行配置
  const tableRowSelection = ref(tableRowSelectionDefault());

  const tableLoading = ref(false);

  // 单元格插槽名
  const tableCellSlotNames = ref<string[]>(tableCellSlotNamesDefault());

  // 列表分页参数
  const tablePagination = reactive<PaginationProps>(tablePaginationDefault());

  /**
   * 列表查询
   */
  const tableDataRequest = async () => {
    if (!props.dataApi) {
      return;
    }
    tableLoading.value = true;
    try {
      const query: any = { ...props.query };
      if (tablePagination) {
        query.current = tablePagination.current;
        query.pageSize = tablePagination.pageSize;
      }
      const { data } = await props.dataApi(query);
      tableData.value = data.list;
      if (tablePagination) {
        tablePagination.total = data.total;
      }
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      tableLoading.value = false;
    }
  };

  defineExpose({ tableDataRequest, tableSelectionChange });

  tableDataRequest();

  /**
   * 页码修改
   */
  const tablePageCurrentChange = (current: number) => {
    tablePagination.current = current;
    emit('update:current', current);
    tableDataRequest();
  };

  /**
   * 页大小修改
   */
  const tablePageSizeChange = (pageSize: number) => {
    tablePagination.current = 1;
    tablePagination.pageSize = pageSize;
    emit('update:current', 1);
    emit('update:pageSize', pageSize);
    tableDataRequest();
  };

  /**
   * 列表大小
   */
  const handleSelectTableSize = (
    val: string | number | Record<string, any> | undefined,
    e: Event
  ) => {
    tableSize.value = val as TableSize;
  };

  /**
   * 列名排序
   */
  const handleChangeTableColumnSort = (val: boolean) => {
    if (val) {
      nextTick(() => {
        const el = document.getElementById('tableSetting') as HTMLElement;
        const sortable = new Sortable(el, {
          onEnd(e: any) {
            const { oldIndex, newIndex } = e;
            arrayExchange(tableColumns.value, oldIndex, newIndex);
            arrayExchange(settingColumns.value, oldIndex, newIndex);
          },
        });
      });
    }
  };

  /**
   * 列名显示
   */
  const handleChangTableColumnShow = (
    checked: boolean | (string | boolean | number)[],
    column: JTableColumn,
    index: number
  ) => {
    if (!checked) {
      tableColumns.value = settingColumns.value.filter(
        (item) => item.dataIndex !== column.dataIndex
      );
    } else {
      tableColumns.value.splice(index, 0, column);
    }
  };

  watch(
    () => defaultColumns.value,
    (val) => {
      tableColumns.value = cloneDeep(val);
      tableColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      settingColumns.value = cloneDeep(tableColumns.value);
    },
    { deep: true, immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'JTable',
  };
</script>

<style scoped lang="less">
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

  .setting-col {
    height: 10px;
    line-height: 5px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 150px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
