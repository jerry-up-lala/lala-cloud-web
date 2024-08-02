<template>
  <div class="container">
    <a-row>
      <a-col :flex="1">
        <a-form
          ref="queryRef"
          layout="inline"
          :model="queryModel"
          label-align="left"
        >
          <a-form-item
            field="loginName"
            :label="$t('system.notice.user.loginName')"
          >
            <a-input
              v-model="queryModel.loginName"
              :placeholder="$t('common.placeholder.input')"
            />
          </a-form-item>

          <a-form-item
            field="realName"
            :label="$t('system.notice.user.realName')"
          >
            <a-input
              v-model="queryModel.realName"
              :placeholder="$t('common.placeholder.input')"
            />
          </a-form-item>

          <a-form-item
            field="readState"
            :label="$t('system.notice.user.readState')"
          >
            <a-select
              v-model="queryModel.readState"
              :options="userReadStateOptions"
              :placeholder="$t('common.placeholder.select')"
              allow-clear
              allow-search
            />
          </a-form-item>

          <a-form-item
            field="readTime"
            :label="$t('system.notice.user.readTime')"
          >
            <a-range-picker
              v-model="queryModel.readTimeRang"
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
            v-permission="['NOTICE:USER']"
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
            v-permission="['NOTICE:USER']"
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

      <template #readState="{ record }">
        <a-tag
          :color="
            userReadStateOptions.find(
              (item) => `${item?.value}` === `${record.readState}`
            )?.color
          "
        >
          {{
            userReadStateOptions.find(
              (item) => `${item?.value}` === `${record.readState}`
            )?.label
          }}
        </a-tag>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
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
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { userReadStateOptionsData } from '@/data/notice-user';
  import {
    noticeUserPageApi,
    NoticeUserAllQueryParams,
    NoticeUserAllPageParams,
    NoticeUserAllResponseBody,
  } from '@/api/request/notice';

  const { t } = useI18n();

  const props = defineProps({
    noticeId: {
      type: Number,
      required: false,
      default() {
        return null;
      },
    },
  });

  const userReadStateOptions = computed<SelectOptionData[]>(() =>
    userReadStateOptionsData(t)
  );

  // =========== 分页列表开始 ===========
  /**
   * 初始化查询条件
   */
  const queryModelDefault = (): NoticeUserAllQueryParams => {
    return {
      loginName: '',
      realName: '',
      readTimeRang: [],
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
  // 配置字段
  const settingColumns = ref<TableColumn[]>([]);
  // 列表字段
  const tableColumns = ref<TableColumn[]>([]);
  // 列表数据
  const tableData = ref<NoticeUserAllResponseBody[]>([]);
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
      title: t('system.notice.user.loginName'),
      dataIndex: 'loginName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.notice.user.realName'),
      dataIndex: 'realName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.notice.user.readState'),
      dataIndex: 'readState',
      slotName: 'readState',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.notice.user.readTime'),
      dataIndex: 'readTime',
      ellipsis: true,
      tooltip: true,
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
      const query: NoticeUserAllPageParams = {
        current: tablePagination.current,
        pageSize: tablePagination.pageSize,
        noticeId: props.noticeId,
        ...queryModel.value,
      };
      const { data } = await noticeUserPageApi(query);
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
    name: 'NoticeUserList',
  };
</script>
