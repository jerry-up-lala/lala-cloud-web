<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.system.user')">
      <a-row>
        <a-col :flex="1">
          <a-form
            ref="queryRef"
            layout="inline"
            :model="queryModel"
            label-align="left"
          >
            <a-form-item field="loginName" :label="$t('system.user.loginName')">
              <a-input
                v-model="queryModel.loginName"
                :placeholder="$t('common.placeholder.input')"
                allow-clear
              />
            </a-form-item>

            <a-form-item field="realName" :label="$t('system.user.realName')">
              <a-input
                v-model="queryModel.realName"
                :placeholder="$t('common.placeholder.input')"
                allow-clear
              />
            </a-form-item>

            <a-form-item field="state" :label="$t('system.user.state')">
              <a-select
                v-model="queryModel.state"
                :options="stateOptions"
                :placeholder="$t('common.placeholder.select')"
                allow-clear
                allow-search
              />
            </a-form-item>

            <a-form-item
              field="tenantAdmin"
              :label="$t('system.user.tenantAdmin')"
            >
              <a-select
                v-model="queryModel.tenantAdmin"
                :options="booleanOptions"
                :placeholder="$t('common.placeholder.select')"
                allow-clear
                allow-search
              />
            </a-form-item>

            <a-form-item
              field="createTimeRang"
              :label="$t('system.user.createTime')"
            >
              <a-range-picker
                v-model="queryModel.createTimeRang"
                show-time
                allow-clear
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
              v-permission="['USER:QUERY']"
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
        <a-col :span="12">
          <a-space>
            <a-button
              v-permission="['USER:ADD']"
              type="primary"
              @click="jumpAdd"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('common.action.add') }}
            </a-button>

            <a-dropdown-button>
              {{
                arrayActionInfo($t('common.action.batch'), tableSelectedRowKeys)
              }}
              <template #content>
                <a-doption
                  v-permission="['USER:STATE:ACTIVATION']"
                  :disabled="tableSelectedRowKeys.length === 0"
                  @click="handleBatchState(true)"
                >
                  {{ $t('common.action.batch.activation') }}
                </a-doption>

                <a-doption
                  v-permission="['USER:STATE:ACTIVATION']"
                  :disabled="tableSelectedRowKeys.length === 0"
                  @click="handleBatchState(false)"
                >
                  {{ $t('common.action.batch.deactivation') }}
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
            <div
              v-permission="['USER:QUERY']"
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
                          handleChangTableColumnShow($event, item, index)
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

        <template #state="{ record }">
          <a-tag :color="record.state === true ? 'blue' : 'gray'">
            {{
              stateOptions.find(
                (item) => `${item?.value}` === `${record.state}`
              )?.label
            }}
          </a-tag>
        </template>

        <template #tenantAdmin="{ record }">
          <a-tag :color="record.tenantAdmin === true ? 'blue' : 'gray'">
            {{
              booleanOptions.find(
                (item) => `${item?.value}` === `${record.tenantAdmin}`
              )?.label
            }}
          </a-tag>
        </template>

        <template #operate="{ record }">
          <a-button
            v-permission="['USER:INFO']"
            type="text"
            @click="jumpInfo(record.id)"
            >{{ $t('common.action.info') }}</a-button
          >
          <a-button
            v-permission="['USER:PASSWORD']"
            type="text"
            @click="passwordCopyAction(record)"
          >
            {{ $t('system.user.password.copy') }}
          </a-button>
          <a-button
            v-permission="['USER:UPDATE']"
            type="text"
            @click="jumpUpdate(record.id)"
          >
            {{ $t('common.action.update') }}
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
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import {
    TableColumn,
    PaginationDefault,
    TableRowSelectionDefault,
    TableSize,
    TableSizeType,
    tableSizeTypes,
  } from '@/global/table';
  import { TableRowSelection } from '@arco-design/web-vue/es/table';
  import { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import {
    userPageApi,
    userPasswordApi,
    userStateApi,
    UserQueryParams,
    UserPageQueryParams,
    UserResponseBody,
  } from '@/api/request/user';
  import { stateOptionsData, booleanOptionsData } from '@/data';
  import { arrayExchange, arrayActionInfo } from '@/utils/array';
  import { copyAction } from '@/utils/copy';
  import { Message } from '@arco-design/web-vue';
  import Sortable from 'sortablejs';
  import cloneDeep from 'lodash/cloneDeep';

  const { t } = useI18n();

  const { router } = useRouter();

  const stateOptions = computed<SelectOptionData[]>(() => stateOptionsData());

  const booleanOptions = computed<SelectOptionData[]>(() =>
    booleanOptionsData()
  );

  // =========== 分页列表开始 ===========

  /**
   * 初始化查询条件
   */
  const queryModelDefault = (): UserQueryParams => {
    return {
      loginName: '',
      realName: '',
      createTimeRang: [],
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
  const tableSelectedRowKeys = ref<string[]>([]);
  // 配置字段
  const settingColumns = ref<TableColumn[]>([]);
  // 列表字段
  const tableColumns = ref<TableColumn[]>([]);
  // 列表数据
  const tableData = ref<UserResponseBody[]>([]);
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
      title: t('system.user.id'),
      dataIndex: 'id',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.user.loginName'),
      dataIndex: 'loginName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.user.realName'),
      dataIndex: 'realName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.user.mail'),
      dataIndex: 'mail',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.user.nickName'),
      dataIndex: 'nickName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.user.state'),
      dataIndex: 'state',
      slotName: 'state',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.user.tenantAdmin'),
      dataIndex: 'tenantAdmin',
      slotName: 'tenantAdmin',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.user.createTime'),
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.action.operate'),
      slotName: 'operate',
      width: 250,
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
      const query: UserPageQueryParams = {
        current: tablePagination.current,
        pageSize: tablePagination.pageSize,
        ...queryModel.value,
      };
      const { data } = await userPageApi(query);
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

  // =========== 跳转页面开始 ===========
  const jumpInfo = (recordId: string) => {
    router.push({ name: 'UserInfo', query: { id: recordId } });
  };

  const jumpAdd = () => {
    router.push({ name: 'UserAdd' });
  };

  const jumpUpdate = (recordId: string) => {
    router.push({ name: 'UserUpdate', query: { id: recordId } });
  };
  // =========== 跳转页面结束 ===========

  // =========== 批量启用/禁用开始 ===========
  const handleBatchState = async (state: boolean) => {
    try {
      await userStateApi({
        userIdList: tableSelectedRowKeys.value,
        state,
      });
      tableSelectedRowKeys.value = [];
      Message.success(t('common.success.operation'));
      tableDataRequest();
    } catch (err) {
      // do err
    }
  };
  // =========== 批量启用/禁用结束 ===========

  // ========== 复制密码开始 ===========
  const passwordCopyAction = async (record: UserResponseBody) => {
    try {
      const { data } = await userPasswordApi(record.id);
      copyAction(data);
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  // =========== 复制密码结束 ===========

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
    name: 'User',
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
