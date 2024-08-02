<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.dev.gen')">
      <a-row>
        <a-col :flex="1">
          <a-form
            ref="queryRef"
            layout="inline"
            :model="queryModel"
            label-align="left"
          >
            <a-form-item field="tableName" :label="$t('dev.gen.tableName')">
              <a-input
                v-model="queryModel.tableName"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item field="className" :label="$t('dev.gen.className')">
              <a-input
                v-model="queryModel.className"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="functionName"
              :label="$t('dev.gen.functionName')"
            >
              <a-input
                v-model="queryModel.functionName"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item field="author" :label="$t('dev.gen.author')">
              <a-input
                v-model="queryModel.author"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="tableComment"
              :label="$t('dev.gen.tableComment')"
            >
              <a-input
                v-model="queryModel.tableComment"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item field="tableEngine" :label="$t('dev.gen.tableEngine')">
              <a-input
                v-model="queryModel.tableEngine"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="tableCollation"
              :label="$t('dev.gen.tableCollation')"
            >
              <a-input
                v-model="queryModel.tableCollation"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item field="packageName" :label="$t('dev.gen.packageName')">
              <a-input
                v-model="queryModel.packageName"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="tableCreateTimeRang"
              :label="$t('dev.gen.tableCreateTime')"
            >
              <a-range-picker
                v-model="queryModel.tableCreateTimeRang"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="[
                  $t('common.placeholder.dateTimePicker.start'),
                  $t('common.placeholder.dateTimePicker.end'),
                ]"
              />
            </a-form-item>

            <a-form-item
              field="tableUpdateTimeRang"
              :label="$t('dev.gen.tableUpdateTime')"
            >
              <a-range-picker
                v-model="queryModel.tableUpdateTimeRang"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="[
                  $t('common.placeholder.dateTimePicker.start'),
                  $t('common.placeholder.dateTimePicker.end'),
                ]"
              />
            </a-form-item>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button
              v-permission="['GEN:QUERY']"
              type="primary"
              @click="tableDataRequest"
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
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12"> </a-col>

        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <!-- 刷新按钮 -->
          <a-tooltip :content="$t('common.action.refresh')">
            <div
              v-permission="['GEN:QUERY']"
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
                            item as TableColumnData,
                            index
                          )
                        "
                      >
                      </a-checkbox>
                    </div>
                    <div class="title">
                      {{ item.title === '#' ? '序列号' : item.title }}
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
        row-key="id"
        :loading="tableLoading"
        :pagination="tablePagination"
        :columns="tableColumns"
        :data="tableData"
        :scroll="tableScroll"
        :size="tableSize"
        stripe
        column-resizable
        table-layout-fixed
        :bordered="{ cell: true }"
        @page-change="tablePageCurrentChange"
        @page-size-change="tablePageSizeChange"
      >
        <template #index="{ rowIndex }">
          {{
            rowIndex +
            1 +
            ((tablePagination?.current ?? 0) - 1) *
              (tablePagination?.pageSize ?? 0)
          }}
        </template>

        <template #operate="{ record }">
          <a-button
            v-permission="['GEN:OPERATE']"
            type="text"
            @click="jumpOperate(record.tableName)"
          >
            {{ $t('menu.dev.gen.operate') }}
          </a-button>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import useRouter from '@/hooks/router';
  import { useI18n } from 'vue-i18n';
  import {
    TableColumn,
    PaginationDefault,
    TableSize,
    TableSizeType,
    tableSizeTypes,
  } from '@/global/table';
  import { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import { arrayExchange } from '@/utils/array';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    genTablePageApi,
    GenTableQueryParams,
    GenPageParams,
    GenTableBody,
  } from '@/api/request/gen';

  const { t } = useI18n();

  const { router } = useRouter();

  // =========== 分页列表开始 ===========

  /**
   * 初始化查询条件
   */
  const queryModelDefault = (): GenTableQueryParams => {
    return {
      tableName: '',
      tableComment: '',
      tableEngine: '',
      tableCollation: '',
      packageName: '',
      className: '',
      functionName: '',
      author: '',
      tableCreateTimeRang: [],
      tableUpdateTimeRang: [],
    };
  };

  // 查询表单
  const queryRef = ref<FormInstance>();
  // 查询表单
  const queryModel = ref(queryModelDefault());
  // 列表分页参数
  const tablePagination = reactive<PaginationProps>({
    ...PaginationDefault,
  });
  // 列表加载中
  const tableLoading = ref(false);
  // 列表滚动条
  const tableScroll = {
    x: 1800,
  };
  // 配置字段
  const settingColumns = ref<TableColumn[]>([]);
  // 列表字段
  const tableColumns = ref<TableColumn[]>([]);
  // 列表数据
  const tableData = ref<GenTableBody[]>([]);
  // 列表密度
  const tableSize = ref<TableSize>('medium');
  // 列表密度选择项
  const tableSizeList = computed<TableSizeType[]>(tableSizeTypes);
  // 列名
  const defaultColumns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      width: 65,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.gen.tableInfo'),
      children: [
        {
          title: t('dev.gen.tableSchema'),
          dataIndex: 'tableSchema',
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.tableName'),
          dataIndex: 'tableName',
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.tableComment'),
          dataIndex: 'tableComment',
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.tableEngine'),
          dataIndex: 'tableEngine',
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.tableCollation'),
          dataIndex: 'tableCollation',
          width: 165,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.tableCreateTime'),
          dataIndex: 'tableCreateTime',
          width: 180,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.tableUpdateTime'),
          dataIndex: 'tableUpdateTime',
          width: 180,
          ellipsis: true,
          tooltip: true,
        },
      ],
    },
    {
      title: t('dev.gen.configInfo'),
      children: [
        {
          title: t('dev.gen.className'),
          dataIndex: 'className',
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.functionName'),
          dataIndex: 'functionName',
          slotName: 'functionName',
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.author'),
          dataIndex: 'author',
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.packageName'),
          dataIndex: 'packageName',
          ellipsis: true,
          tooltip: true,
        },
      ],
    },
    {
      title: t('common.action.operate'),
      slotName: 'operate',
      width: 160,
      fixed: 'right',
    },
  ]);

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
    column: TableColumn,
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

  /**
   * 列表查询
   */
  const tableDataRequest = async () => {
    tableLoading.value = true;
    try {
      const query: GenPageParams = {
        current: tablePagination.current,
        pageSize: tablePagination.pageSize,
        ...queryModel.value,
      };
      const { data } = await genTablePageApi(query);
      tableData.value = data.list;
      tablePagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      tableLoading.value = false;
    }
  };

  /**
   * 页码修改
   */
  const tablePageCurrentChange = (current: number) => {
    tablePagination.current = current;
    tableDataRequest();
  };

  /**
   * 页大小修改
   */
  const tablePageSizeChange = (pageSize: number) => {
    tablePagination.current = 1;
    tablePagination.pageSize = pageSize;
    tableDataRequest();
  };

  /**
   * 查询条件还原
   */
  const queryModelReset = () => {
    queryRef.value?.resetFields();
    tableDataRequest();
  };

  tableDataRequest();

  // =========== 分页列表结束 ===========

  // =========== 跳转生成开始 ===========
  const jumpOperate = (tableName: string) => {
    router.push({ name: 'GenOperate', query: { tableName } });
  };

  // =========== 跳转生成结束 ===========

  // =========== 操作结束 ===========

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
    name: 'Gen',
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
