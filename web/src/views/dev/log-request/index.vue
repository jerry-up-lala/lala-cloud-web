<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.dev.log.request')">
      <a-row>
        <a-col :flex="1">
          <a-form
            ref="queryRef"
            layout="inline"
            :model="queryModel"
            label-align="left"
          >
            <a-form-item field="input" :label="$t('dev.log.request.apiName')">
              <a-input
                v-model="queryModel.apiName"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="responseSuccess"
              :label="$t('dev.log.request.responseSuccess')"
            >
              <a-input
                v-model="queryModel.responseSuccess"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="responseErrorCode"
              :label="$t('dev.log.request.responseErrorCode')"
            >
              <a-input
                v-model="queryModel.responseErrorCode"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="responseErrorMsg"
              :label="$t('dev.log.request.responseErrorMsg')"
            >
              <a-input
                v-model="queryModel.responseErrorMsg"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="clientIp"
              :label="$t('dev.log.request.clientIp')"
            >
              <a-input
                v-model="queryModel.clientIp"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="tenantIds"
              :wrapper-col-style="{ width: '200px' }"
              :label="$t('dev.log.request.tenantName')"
            >
              <a-select
                v-model="queryModel.tenantIds"
                :options="tenantIdsOptions"
                :loading="tenantIdsOptionsLoading"
                :placeholder="$t('common.placeholder.select')"
                multiple
                allow-clear
                allow-search
              />
            </a-form-item>

            <a-form-item
              field="loginName"
              :label="$t('dev.log.request.loginName')"
            >
              <a-input
                v-model="queryModel.loginName"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item field="userId" :label="$t('dev.log.request.userId')">
              <a-input
                v-model="queryModel.userId"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="servletMethods"
              :wrapper-col-style="{ width: '120px' }"
              :label="$t('dev.log.request.servletMethod')"
            >
              <a-select
                v-model="queryModel.servletMethods"
                :options="servletMethodsOptions"
                :placeholder="$t('common.placeholder.select')"
                multiple
                allow-clear
                allow-search
              />
            </a-form-item>

            <a-form-item
              field="servletPath"
              :label="$t('dev.log.request.servletPath')"
            >
              <a-input
                v-model="queryModel.servletPath"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="requestTimeRange"
              :label="$t('dev.log.request.requestTime')"
            >
              <a-range-picker
                v-model="queryModel.requestTimeRange"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                :placeholder="[
                  $t('common.placeholder.dateTimePicker.start'),
                  $t('common.placeholder.dateTimePicker.end'),
                ]"
              />
            </a-form-item>

            <a-form-item
              field="responseTimeRange"
              :label="$t('dev.log.request.responseTime.ms')"
            >
              <a-input-number
                v-model="queryModel.responseTimeRange[0]"
                :precision="0"
                :placeholder="$t('common.placeholder.input')"
              />~
              <a-input-number
                v-model="queryModel.responseTimeRange[1]"
                :precision="0"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="classMethod"
              :label="$t('dev.log.request.classMethod')"
            >
              <a-input
                v-model="queryModel.classMethod"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="classParams"
              :label="$t('dev.log.request.classParams')"
            >
              <a-input
                v-model="queryModel.classParams"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="userAgent"
              :label="$t('dev.log.request.userAgent')"
            >
              <a-input
                v-model="queryModel.userAgent"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="requestParams"
              :label="$t('dev.log.request.requestParams')"
            >
              <a-input
                v-model="queryModel.requestParams"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="requestBody"
              :label="$t('dev.log.request.requestBody')"
            >
              <a-input
                v-model="queryModel.requestBody"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="requestUrlInfo"
              :label="$t('dev.log.request.requestUrlInfo')"
            >
              <a-input
                v-model="queryModel.requestUrlInfo"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="clientInfo"
              :label="$t('dev.log.request.clientInfo')"
            >
              <a-input
                v-model="queryModel.clientInfo"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>

            <a-form-item
              field="serverInfo"
              :label="$t('dev.log.request.serverInfo')"
            >
              <a-input
                v-model="queryModel.serverInfo"
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-form>
        </a-col>

        <a-divider style="height: 184px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button
              v-permission="['LOG:REQUEST:QUERY']"
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
              v-permission="['LOG:REQUEST:QUERY']"
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

        <template #responseSuccess="{ record }">
          <a-space>
            <a-tag :color="record.responseSuccess === true ? 'blue' : 'red'">
              {{
                operateOptions.find(
                  (item) => `${item?.value}` === `${record.responseSuccess}`
                )?.label
              }}
            </a-tag>

            <a-popover v-if="record.responseSuccess === false">
              <icon-info-circle />
              <template #content>
                <a-descriptions :column="1" :align="{ value: 'left' }">
                  <a-descriptions-item
                    :label="$t('dev.log.request.responseErrorCode')"
                  >
                    <a-typography-text>
                      {{ record.responseErrorCode }}
                    </a-typography-text>
                  </a-descriptions-item>

                  <a-descriptions-item
                    :label="$t('dev.log.request.responseErrorMsg')"
                  >
                    <a-typography-text>
                      {{ record.responseErrorMsg }}
                    </a-typography-text>
                  </a-descriptions-item>
                </a-descriptions>
              </template>
            </a-popover>
          </a-space>
        </template>

        <template #servletMethod="{ record }">
          <a-tag
            :color="
              servletMethodsTags.find(
                (item) => `${item.value}` === `${record.servletMethod}`
              )?.color
            "
          >
            {{ record.servletMethod }}
          </a-tag>
        </template>

        <template #operate="{ record }">
          <a-button
            v-permission="['LOG:REQUEST:INFO']"
            type="text"
            @click="showInfoDrawer(record)"
            >{{ $t('common.action.info') }}
          </a-button>
        </template>
      </a-table>

      <a-drawer
        :visible="infoDrawerVisible"
        :footer="false"
        :width="500"
        unmount-on-close
        @cancel="hideInfoDrawer"
      >
        <template #title>
          {{ $t('common.action.info') + '(' + infoData.id + ')' }}
        </template>
        <a-descriptions :column="1" bordered>
          <a-descriptions-item :label="t('dev.log.request.apiName')">
            {{ infoData.apiName }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.responseSuccess')">
            <a-space>
              <a-tag
                :color="infoData.responseSuccess === true ? 'blue' : 'red'"
              >
                {{
                  operateOptions.find(
                    (item) => `${item?.value}` === `${infoData.responseSuccess}`
                  )?.label
                }}
              </a-tag>

              <a-popover v-if="infoData.responseSuccess === false">
                <icon-info-circle />
                <template #content>
                  <a-descriptions :column="1" :align="{ value: 'left' }">
                    <a-descriptions-item
                      :label="$t('dev.log.request.responseErrorCode')"
                    >
                      <a-typography-text>
                        {{ infoData.responseErrorCode }}
                      </a-typography-text>
                    </a-descriptions-item>

                    <a-descriptions-item
                      :label="$t('dev.log.request.responseErrorMsg')"
                    >
                      <a-typography-text>
                        {{ infoData.responseErrorMsg }}
                      </a-typography-text>
                    </a-descriptions-item>
                  </a-descriptions>
                </template>
              </a-popover>
            </a-space>
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.clientIp')">
            {{ infoData.clientIp }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.servletMethod')">
            <a-tag
              :color="
                servletMethodsTags.find(
                  (item) => `${item.value}` === `${infoData.servletMethod}`
                )?.color
              "
            >
              {{ infoData.servletMethod }}
            </a-tag>
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.servletPath')">
            {{ infoData.servletPath }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.requestTime')">
            {{ infoData.requestTime }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.responseTimeFormat')">
            {{ infoData.responseTimeFormat }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.tenantId')">
            {{ infoData.tenantId }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.tenantName')">
            {{ infoData.tenantName }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.loginName')">
            {{ infoData.loginName }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.userInfo')">
            {{ infoData.userInfo }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.classMethod')">
            {{ infoData.classMethod }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.classParams')">
            <a-space direction="vertical">
              <a-button
                v-if="infoData.classParams"
                type="outline"
                size="mini"
                @click="copyAction(infoData.classParams)"
                >{{ $t('dev.log.request.classParams.copy') }}
              </a-button>
              <json-view
                v-if="jsonParse(infoData.classParams, true)"
                :data="jsonParse(infoData.classParams, true)"
              />
              <div v-else>{{ infoData.classParams }}</div>
            </a-space>
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.userAgent')">
            {{ infoData.userAgent }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.requestParams')">
            {{ infoData.requestParams }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.requestBody')">
            <a-space direction="vertical">
              <a-button
                v-if="infoData.requestBody"
                type="outline"
                size="mini"
                @click="copyAction(infoData.requestBody)"
                >{{ $t('dev.log.request.requestBody.copy') }}
              </a-button>
              <json-view
                v-if="jsonParse(infoData.requestBody, true)"
                :data="jsonParse(infoData.requestBody, true)"
              />
              <div v-else>{{ infoData.requestBody }}</div>
            </a-space>
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.requestUrlInfo')">
            {{ infoData.requestUrlInfo }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.clientInfo')">
            {{ infoData.clientInfo }}
          </a-descriptions-item>

          <a-descriptions-item :label="t('dev.log.request.serverInfo')">
            {{ infoData.serverInfo }}
          </a-descriptions-item>
        </a-descriptions>
      </a-drawer>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    TableColumn,
    PaginationDefault,
    TableSize,
    TableSizeType,
    tableSizeTypes,
  } from '@/global/table';
  import { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import { operateOptionsData } from '@/data';
  import { arrayExchange } from '@/utils/array';
  import { jsonParse } from '@/utils/json';
  import { copyAction } from '@/utils/copy';
  import { servletMethodsOptionsData } from '@/data/log-request';
  import {
    logRequestPageApi,
    LogRequestQuery,
    LogRequestPageQuery,
  } from '@/api/request/log-request';
  import { tenantListApi } from '@/api/request/tenant';

  const { t } = useI18n();

  // =========== 查询条件开始 ===========

  // 集团下拉列表加载中
  const tenantIdsOptionsLoading = ref(false);

  const tenantIdsOptions = ref<SelectOptionData[]>([]);

  const servletMethodsOptions = computed<SelectOptionData[]>(() =>
    servletMethodsOptionsData().map((item) => ({
      label: item.value,
      value: item.value,
    }))
  );

  const servletMethodsTags = computed<any[]>(() => servletMethodsOptionsData());

  const operateOptions = computed<SelectOptionData[]>(() =>
    operateOptionsData()
  );

  /**
   * 查询条件初始化
   */
  const tenantIdsOptionsData = async () => {
    tenantIdsOptionsLoading.value = true;
    try {
      const { data } = await tenantListApi();
      tenantIdsOptions.value = data.map((item) => ({
        label: item.tenantName,
        value: item.id,
      }));
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      tenantIdsOptionsLoading.value = false;
    }
  };

  /**
   * 初始化查询条件
   */
  const queryModelDefault = (): LogRequestQuery => {
    return {
      apiName: '',
      responseErrorCode: '',
      responseErrorMsg: '',
      clientIp: '',
      tenantIds: [],
      loginName: '',
      userId: '',
      servletMethods: [],
      servletPath: '',
      requestTimeRange: [],
      responseTimeRange: [],
      classMethod: '',
      classParams: '',
      userAgent: '',
      requestParams: '',
      requestBody: '',
      requestUrlInfo: '',
      clientInfo: '',
      serverInfo: '',
    };
  };

  // 查询表单
  const queryRef = ref<FormInstance>();
  // 查询表单
  const queryModel = ref(queryModelDefault());

  // =========== 查询条件结束 ===========

  // =========== 分页列表开始 ===========

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
  const tableData = ref<any[]>([]);
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
      title: t('dev.log.request.apiName'),
      dataIndex: 'apiName',
      width: 180,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.log.request.responseSuccess'),
      dataIndex: 'responseSuccess',
      slotName: 'responseSuccess',
      width: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.log.request.clientIp'),
      dataIndex: 'clientIp',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.log.request.tenantName'),
      dataIndex: 'tenantName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.log.request.loginName'),
      dataIndex: 'loginName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.log.request.servletMethod'),
      dataIndex: 'servletMethod',
      slotName: 'servletMethod',
      width: 120,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.log.request.servletPath'),
      dataIndex: 'servletPath',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.log.request.responseTimeFormat'),
      dataIndex: 'responseTimeFormat',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.log.request.requestTime'),
      dataIndex: 'requestTime',
      width: 180,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.action.operate'),
      slotName: 'operate',
      width: 90,
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
      const query: LogRequestPageQuery = {
        current: tablePagination.current,
        pageSize: tablePagination.pageSize,
        ...queryModel.value,
      };
      const { data } = await logRequestPageApi(query);
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

  tenantIdsOptionsData();
  tableDataRequest();

  // =========== 分页列表结束 ===========

  // =========== 详情开始 ===========
  // 是否显示详情
  const infoDrawerVisible = ref(false);

  // 详情表单
  const infoData = ref();

  const showInfoDrawer = (record: any) => {
    infoDrawerVisible.value = true;
    infoData.value = record;
  };

  const hideInfoDrawer = () => {
    infoDrawerVisible.value = false;
  };

  // =========== 详情结束 ===========

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
    name: 'LogRequest',
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
