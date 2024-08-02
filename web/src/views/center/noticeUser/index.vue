<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.center.notice')">
      <a-row>
        <a-col :flex="1">
          <a-form
            ref="queryRef"
            layout="inline"
            :model="queryModel"
            label-align="left"
          >
            <a-form-item field="title" :label="$t('system.notice.title')">
              <a-input
                v-model="queryModel.title"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item field="noticeType" :label="$t('system.notice.type')">
              <a-select
                v-model="queryModel.noticeType"
                :options="noticeTypeOptions"
                :placeholder="$t('common.placeholder.select')"
                allow-clear
                allow-search
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
              field="sendTimeRang"
              :label="$t('system.notice.sendTime')"
            >
              <a-range-picker
                v-model="queryModel.sendTimeRang"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="[
                  $t('common.placeholder.dateTimePicker.start'),
                  $t('common.placeholder.dateTimePicker.end'),
                ]"
              />
            </a-form-item>

            <a-form-item
              field="readTimeRang"
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
            <a-button type="primary" @click="tableDataRequest">
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
        <a-col :span="12">
          <a-space>
            <a-dropdown-button>
              {{
                arrayActionInfo($t('common.action.batch'), tableSelectedRowKeys)
              }}
              <template #icon>
                <icon-down />
              </template>
              <template #content>
                <a-doption
                  :disabled="tableSelectedRowKeys.length === 0"
                  @click="showBatchDeleteModal"
                >
                  {{ $t('common.action.batch.delete') }}
                </a-doption>

                <a-divider :margin="1" />

                <a-doption
                  :disabled="tableSelectedRowKeys.length === 0"
                  @click="readAction"
                >
                  {{ $t('common.action.batch.read.selected') }}
                </a-doption>

                <a-doption>
                  {{ $t('common.action.allRead') }}
                </a-doption>
              </template>
            </a-dropdown-button>
          </a-space>
        </a-col>

        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <!-- 刷新按钮 -->
          <a-tooltip :content="$t('common.action.refresh')">
            <div class="action-icon" @click="tableDataRequest">
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
        v-model:selected-keys="tableSelectedRowKeys"
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
        :row-selection="tableRowSelection"
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

        <template #noticeType="{ record }">
          <a-tag
            :color="
              noticeTypeOptions.find(
                (item) => `${item?.value}` === `${record.noticeType}`
              )?.color
            "
          >
            {{
              noticeTypeOptions.find(
                (item) => `${item?.value}` === `${record.noticeType}`
              )?.label
            }}
          </a-tag>
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

        <template #operate="{ record }">
          <a-button type="text" @click="jumpInfo(record)">
            {{ $t('common.action.info') }}
          </a-button>

          <a-popconfirm
            :content="$t('common.confirm.delete')"
            type="error"
            :ok-loading="deleteLoading"
            :on-before-ok="deleteBeforeOk"
            @show="deleteShow(record)"
            @ok="tableDataRequest"
            @cancel="deleteCancel"
          >
            <a-button type="text">
              {{ $t('common.action.delete') }}
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>

      <!-- 批量删除警告 -->
      <a-modal
        v-model:visible="batchDeleteVisible"
        :title="
          arrayActionInfo(
            $t('common.action.batch.delete'),
            tableSelectedRowKeys
          )
        "
        title-align="start"
        :width="200"
        message-type="error"
        draggable
        :ok-loading="batchDeleteLoading"
        :on-before-ok="batchDeleteBeforeOk"
        @ok="tableDataRequest"
        @cancel="batchDeleteCancel"
      >
        <div>{{ $t('common.confirm.delete') }}</div>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    TableColumn,
    PaginationDefault,
    TableRowSelectionDefault,
    TableSize,
    TableSizeType,
    tableSizeTypes,
  } from '@/global/table';
  import { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import { TableRowSelection } from '@arco-design/web-vue/es/table';
  import { arrayExchange, arrayActionInfo } from '@/utils/array';
  import { isUndefined } from '@/utils/is';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { useAppStore } from '@/store';
  import useRouter from '@/hooks/router';
  import { userReadStateOptionsData } from '@/data/notice-user';
  import { noticeTypeOptionsData } from '@/data/notice';
  import {
    noticeUserPageApi,
    noticeUserReadApi,
    noticeUserDeleteApi,
    noticeUserBatchDeleteApi,
    NoticeUserQueryParams,
    NoticeUserPageParams,
    NoticeUserResponseBody,
  } from '@/api/request/notice-user';

  const { t } = useI18n();

  const appStore = useAppStore();

  const { route, router } = useRouter();

  const noticeTypeOptions = computed<SelectOptionData[]>(() =>
    noticeTypeOptionsData(t)
  );

  const userReadStateOptions = computed<SelectOptionData[]>(() =>
    userReadStateOptionsData(t)
  );

  // =========== 分页列表开始 ===========
  /**
   * 初始化查询条件
   */
  const queryModelDefault = (): NoticeUserQueryParams => {
    return {
      title: '',
      noticeType:
        isUndefined(route.query?.noticeType) || route.query?.noticeType === '0'
          ? undefined
          : Number(route.query?.noticeType),
      sendTimeRang: [],
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
  // 选择行配置
  const tableRowSelection = reactive<TableRowSelection>({
    ...TableRowSelectionDefault,
  });
  // 已选择行
  const tableSelectedRowKeys = ref<number[]>([]);
  // 配置字段
  const settingColumns = ref<TableColumn[]>([]);
  // 列表字段
  const tableColumns = ref<TableColumn[]>([]);
  // 列表数据
  const tableData = ref<NoticeUserResponseBody[]>([]);
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
      title: t('system.notice.title'),
      dataIndex: 'title',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.notice.type'),
      dataIndex: 'noticeType',
      slotName: 'noticeType',
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
      title: t('system.notice.sendTime'),
      dataIndex: 'sendTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.notice.user.readTime'),
      dataIndex: 'readTime',
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
      const query: NoticeUserPageParams = {
        current: tablePagination.current,
        pageSize: tablePagination.pageSize,
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

  // =========== 操作开始 ===========

  const jumpInfo = (record: NoticeUserResponseBody) => {
    router.push({ name: 'NoticeUserInfo', query: { id: record.id } });
  };

  // =========== 批量删除开始 ===========

  // 是否显示批量删除弹出框
  const batchDeleteVisible = ref(false);
  // 确认删除按钮加载
  const batchDeleteLoading = ref(false);

  const showBatchDeleteModal = () => {
    batchDeleteVisible.value = true;
  };

  const batchDeleteCancel = () => {
    batchDeleteVisible.value = false;
  };

  const batchDeleteBeforeOk = async () => {
    if (batchDeleteLoading.value) {
      return false;
    }
    batchDeleteLoading.value = true;
    try {
      await noticeUserBatchDeleteApi({ value: tableSelectedRowKeys.value });
      tableSelectedRowKeys.value = [];
      appStore.noticeUserUnreadCountRequest();
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      batchDeleteLoading.value = false;
    }
  };

  // =========== 批量删除结束 ===========

  // =========== 阅读所选开始 ===========
  const readAction = async () => {
    noticeUserReadApi({ value: tableSelectedRowKeys.value });
    appStore.noticeUserUnreadCountRequest();
    Message.success(t('common.success.operation'));
  };

  // =========== 阅读所选开始 ===========

  // =========== 删除开始 ===========
  // 删除按钮加载
  const deleteLoading = ref(false);
  // 删除ID
  const deleteId = ref<number | null>(null);

  const deleteShow = (record: NoticeUserResponseBody) => {
    deleteId.value = record.id;
  };

  const deleteCancel = () => {
    deleteId.value = null;
  };

  const deleteBeforeOk = async () => {
    if (deleteLoading.value) {
      return false;
    }
    deleteLoading.value = true;
    try {
      await noticeUserDeleteApi(deleteId.value);
      tableSelectedRowKeys.value = tableSelectedRowKeys.value.filter(
        (item) => item !== deleteId.value
      );
      deleteId.value = null;
      appStore.noticeUserUnreadCountRequest();
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      deleteLoading.value = false;
    }
  };
  // =========== 删除结束 ===========

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
    name: 'NoticeUser',
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
