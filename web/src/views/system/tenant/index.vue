<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.system.tenant')">
      <a-row>
        <a-col :flex="1">
          <a-form
            ref="queryRef"
            :model="queryModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="5">
                <a-form-item
                  field="tenantName"
                  :label="$t('system.tenant.tenantName')"
                >
                  <a-input
                    v-model="queryModel.tenantName"
                    :placeholder="$t('common.placeholder.input')"
                  />
                </a-form-item>
              </a-col>

              <a-col :span="4">
                <a-form-item field="state" :label="$t('system.tenant.state')">
                  <a-select
                    v-model="queryModel.state"
                    :options="stateOptions"
                    :placeholder="$t('common.placeholder.select')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button
              v-permission="['TENANT:QUERY']"
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
              v-permission="['TENANT:ADD']"
              type="primary"
              @click="showSaveModal()"
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
              <template #icon>
                <icon-down />
              </template>
              <template #content>
                <a-doption
                  v-permission="['TENANT:BATCH:DELETE']"
                  :disabled="tableSelectedRowKeys.length === 0"
                  @click="showBatchDeleteModal"
                  >{{ $t('common.action.batch.delete') }}
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
              v-permission="['TENANT:QUERY']"
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
        v-model:selected-keys="tableSelectedRowKeys"
        row-key="id"
        :loading="tableLoading"
        :pagination="tablePagination"
        :columns="(tableColumns as TableColumnData[])"
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
              $t(
                `common.enum.${record.state === true ? 'effective' : 'invalid'}`
              )
            }}
          </a-tag>
        </template>

        <template #loginName="{ record }">
          <a-space>
            <a-typography-text>{{ record.loginName }}</a-typography-text>
            <a-popover>
              <icon-info-circle />
              <template #content>
                <a-descriptions :column="1" :align="{ value: 'left' }">
                  <a-descriptions-item
                    :label="$t('system.tenant.admin.userId')"
                  >
                    <a-typography-text>
                      {{ record.userId }}
                    </a-typography-text>
                  </a-descriptions-item>

                  <a-descriptions-item
                    :label="$t('system.tenant.admin.loginName')"
                  >
                    <a-typography-text>
                      {{ record.loginName }}
                    </a-typography-text>
                  </a-descriptions-item>

                  <a-descriptions-item
                    :label="$t('system.tenant.admin.realName')"
                  >
                    <a-typography-text>
                      {{ record.realName }}
                    </a-typography-text>
                  </a-descriptions-item>

                  <a-descriptions-item
                    :label="$t('system.tenant.admin.userState')"
                  >
                    <a-typography-text>
                      <a-tag
                        :color="record.userState === true ? 'blue' : 'gray'"
                      >
                        {{
                          $t(
                            `common.enum.${
                              record.userState === true
                                ? 'effective'
                                : 'invalid'
                            }`
                          )
                        }}
                      </a-tag>
                    </a-typography-text>
                  </a-descriptions-item>
                </a-descriptions>
              </template>
            </a-popover>
          </a-space>
        </template>

        <template #operate="{ record }">
          <a-button
            v-permission="['TENANT:INFO']"
            type="text"
            @click="showInfoModal(record)"
            >{{ $t('common.action.info') }}</a-button
          >
          <a-button
            v-permission="['TENANT:PASSWORD']"
            type="text"
            @click="passwordCopyAction(record)"
            >{{ $t('system.tenant.admin.password.copy') }}</a-button
          >
          <a-button
            v-permission="['TENANT:UPDATE']"
            type="text"
            @click="showSaveModal(record)"
            >{{ $t('common.action.update') }}</a-button
          >
          <a-popconfirm
            :content="$t('common.confirm.delete')"
            type="error"
            :ok-loading="deleteLoading"
            :on-before-ok="deleteBeforeOk"
            @show="deleteShow(record)"
            @ok="tableDataRequest"
            @cancel="deleteCancel"
          >
            <a-button
              v-permission="['TENANT:DELETE']"
              type="text"
              status="danger"
              >{{ $t('common.action.delete') }}</a-button
            >
          </a-popconfirm>
        </template>
      </a-table>

      <!-- 详情 -->
      <a-modal
        v-model:visible="infoVisible"
        :title="$t('common.action.info')"
        title-align="start"
        draggable
        @cancel="infoCancel"
      >
        <a-descriptions :data="infoDescData" size="medium" :column="1">
          <template #value="{ data }">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>

            <span v-els e>
              <span v-if="data.label === t('system.tenant.state')">
                <a-tag :color="data.value === 'true' ? 'blue' : 'gray'">
                  {{
                    $t(
                      `common.enum.${
                        data.value === 'true' ? 'effective' : 'invalid'
                      }`
                    )
                  }}
                </a-tag>
              </span>
              <span v-else>{{ data.value }}</span>
            </span>
          </template>
        </a-descriptions>
      </a-modal>

      <!-- 保存表单 -->
      <a-modal
        v-model:visible="saveVisible"
        :title="saveTitle"
        title-align="start"
        width="auto"
        draggable
        :ok-loading="saveLoading"
        :on-before-ok="saveBeforeOk"
        @ok="tableDataRequest"
        @cancel="saveCancel"
      >
        <a-spin :loading="saveDefaultLoading" :tip="$t('common.loading.info')">
          <a-form
            ref="saveRef"
            :model="saveModel"
            :style="{ width: '600px' }"
            :rules="saveRules"
          >
            <a-form-item
              field="tenantName"
              :label="$t('system.tenant.tenantName')"
              :tooltip="
                $t('system.tenant.tenantName') + $t('common.info.cannot.repeat')
              "
              :validate-status="saveTenantNameValidateStatus"
              :validate-trigger="['blur']"
              feedback
            >
              <a-input
                v-model="saveModel.tenantName"
                :placeholder="$t('common.placeholder.input')"
                allow-clear
              />
            </a-form-item>

            <a-form-item field="state" :label="$t('system.tenant.state')">
              <a-switch v-model="saveModel.state">
                <template #checked>
                  {{ $t('common.enum.effective') }}
                </template>
                <template #unchecked>
                  {{ $t('common.enum.invalid') }}
                </template>
              </a-switch>
            </a-form-item>

            <a-divider>{{ $t('system.tenant.admin.info') }}</a-divider>

            <a-form-item
              v-if="!saveModel.id"
              field="loginName"
              :label="$t('system.tenant.admin.loginName')"
              feedback
            >
              <a-input
                v-model="saveModel.loginName"
                :placeholder="$t('common.placeholder.input')"
                allow-clear
              />
            </a-form-item>

            <a-form-item
              v-if="!saveModel.id"
              field="passWord"
              :label="$t('system.tenant.admin.password')"
              :validate-status="passWordValidateStatus"
              validate-trigger="blur"
              feedback
            >
              <a-input-password
                v-model="saveModel.passWord"
                :placeholder="$t('common.placeholder.input')"
                :max-length="20"
                allow-clear
                show-word-limit
              />
            </a-form-item>

            <a-form-item
              v-if="!saveModel.id"
              field="rePassWord"
              :label="$t('system.tenant.admin.password.confirm')"
              :validate-status="passWordValidateStatus"
              validate-trigger="blur"
              feedback
            >
              <a-input-password
                v-model="saveModel.rePassWord"
                :placeholder="$t('common.placeholder.input')"
                :max-length="20"
                allow-clear
                show-word-limit
              />
            </a-form-item>

            <a-form-item
              v-if="!saveModel.id"
              field="realName"
              :label="$t('system.tenant.admin.realName')"
              feedback
            >
              <a-input
                v-model="saveModel.realName"
                :placeholder="$t('common.placeholder.input')"
                allow-clear
              />
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>

      <!-- 删除警告 -->
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
  import { TableRowSelection } from '@arco-design/web-vue/es/table';
  import { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import { stateOptionsData } from '@/data';
  import { apiErrorRMsg } from '@/global/body';
  import { arrayExchange, arrayActionInfo } from '@/utils/array';
  import { copyAction } from '@/utils/copy';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { DescData } from '@arco-design/web-vue/es/descriptions';
  import { Message } from '@arco-design/web-vue';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    tenantPageApi,
    tenantInfoApi,
    tenantPasswordApi,
    tenantVerifyApi,
    tenantAddApi,
    tenantUpdateApi,
    tenantBatchDeleteApi,
    tenantDeleteApi,
    TenantQuery,
    TenantPageQuery,
    TenantInfoResponseBody,
  } from '@/api/request/tenant';

  const { t } = useI18n();

  const stateOptions = computed<SelectOptionData[]>(() => stateOptionsData());

  // =========== 分页列表开始 ===========

  /**
   * 初始化查询条件
   */
  const queryModelDefault = (): TenantQuery => {
    return {
      tenantName: '',
      state: undefined,
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
  const tableData = ref<TenantInfoResponseBody[]>([]);
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
      title: t('system.tenant.id'),
      dataIndex: 'id',
      width: 210,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.tenant.tenantName'),
      dataIndex: 'tenantName',
      width: 210,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.tenant.state'),
      dataIndex: 'state',
      slotName: 'state',
      width: 100,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.tenant.admin'),
      dataIndex: 'loginName',
      slotName: 'loginName',
      width: 230,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.tenant.createTime'),
      dataIndex: 'createTime',
      width: 180,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.tenant.createUser'),
      dataIndex: 'createUser',
      width: 80,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.tenant.updateTime'),
      dataIndex: 'updateTime',
      width: 180,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.tenant.updateUser'),
      dataIndex: 'updateUser',
      width: 80,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('common.action.operate'),
      slotName: 'operate',
      width: 350,
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
      const query: TenantPageQuery = {
        current: tablePagination.current,
        pageSize: tablePagination.pageSize,
        ...queryModel.value,
      };
      const { data } = await tenantPageApi(query);
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

  // =========== 详情开始 ===========

  // 详情标题
  const infoDescDataLabel = (): DescData[] => {
    return [
      {
        label: t('system.tenant.tenantName'),
        value: '',
      },
      {
        label: t('system.tenant.state'),
        value: '',
      },
      {
        label: t('system.tenant.createTime'),
        value: '',
      },
      {
        label: t('system.tenant.createUser'),
        value: '',
      },
      {
        label: t('system.tenant.updateTime'),
        value: '',
      },
      {
        label: t('system.tenant.updateUser'),
        value: '',
      },
    ];
  };

  // 是否显示详情
  const infoVisible = ref(false);
  // 加载详情
  const infoSkeleton = ref(false);
  // 详情表单
  const infoDescData = ref<DescData[]>(infoDescDataLabel());

  const showInfoModal = (record: any) => {
    infoVisible.value = true;
    infoRequest(record.id);
  };

  const infoCancel = () => {
    infoVisible.value = false;
    infoDescData.value = infoDescDataLabel();
  };

  /**
   * 详情查询
   */
  const infoRequest = async (id: string) => {
    infoSkeleton.value = true;
    try {
      const { data } = await tenantInfoApi(id);
      const tenantState: string = data.state ? 'true' : 'false';
      infoDescData.value = [
        {
          label: t('system.tenant.tenantName'),
          value: data?.tenantName || '-',
        },
        {
          label: t('system.tenant.state'),
          value: tenantState,
        },
        {
          label: t('system.tenant.createTime'),
          value: data?.createTime || '-',
        },
        {
          label: t('system.tenant.createUser'),
          value: data?.createUser || '-',
        },
        {
          label: t('system.tenant.updateTime'),
          value: data?.updateTime || '-',
        },
        {
          label: t('system.tenant.updateUser'),
          value: data?.updateUser || '-',
        },
      ];
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      infoSkeleton.value = false;
    }
  };

  // =========== 详情结束 ===========

  // =========== 批量删除开始 ===========

  // 是否显示批量删除弹出框
  const batchDeleteVisible = ref(false);
  // 确认删除按钮加载
  const batchDeleteLoading = ref(false);

  const showBatchDeleteModal = (record: any) => {
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
      await tenantBatchDeleteApi({ value: tableSelectedRowKeys.value });
      tableSelectedRowKeys.value = [];
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      batchDeleteLoading.value = false;
    }
  };
  // =========== 批量删除结束 ===========

  // =========== 删除开始 ===========

  // 删除按钮加载
  const deleteLoading = ref(false);
  // 删除ID
  const deleteId = ref('');

  const deleteShow = (record: TenantInfoResponseBody) => {
    deleteId.value = record.id;
  };

  const deleteCancel = () => {
    deleteId.value = '';
  };

  const deleteBeforeOk = async () => {
    if (deleteLoading.value) {
      return false;
    }
    deleteLoading.value = true;
    try {
      await tenantDeleteApi(deleteId.value);
      tableSelectedRowKeys.value = tableSelectedRowKeys.value.filter(
        (item) => item !== deleteId.value
      );
      deleteId.value = '';
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      deleteLoading.value = false;
    }
  };

  // =========== 删除结束 ===========

  // =========== 保存开始 ===========
  /**
   * 保存表单初始化
   */
  const saveModelDefault = () => {
    return {
      id: '',
      tenantName: '',
      state: true,
      loginName: '',
      passWord: '',
      rePassWord: '',
      realName: '',
    };
  };
  // 是否显示保存表单
  const saveVisible = ref(false);
  // 保存标题
  const saveTitle = ref();
  // 保存表单加载
  const saveDefaultLoading = ref(false);
  // 保存按钮加载
  const saveLoading = ref(false);
  // 保存ref
  const saveRef = ref<FormInstance>();
  // 保存表单
  const saveModel = ref(saveModelDefault());
  // 保存集团名称校验
  const saveTenantNameValidateStatus = ref();
  // 密码校验
  const passWordValidateStatus = ref();
  // 保存表单规则
  const saveRules = {
    loginName: [
      {
        required: true,
        message:
          t('system.tenant.admin.loginName') + t('common.required.enter'),
      },
    ],
    passWord: [
      {
        required: true,
        message: t('system.tenant.admin.password') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg?: string) => void
        ) => {
          checkPassWord(callback);
        },
      },
    ],
    rePassWord: [
      {
        required: true,
        message:
          t('system.tenant.admin.password.confirm') +
          t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg?: string) => void
        ) => {
          checkPassWord(callback);
        },
      },
    ],
    realName: [
      {
        required: true,
        message: t('system.tenant.admin.realName') + t('common.required.enter'),
      },
    ],
    tenantName: [
      {
        required: true,
        message: t('system.tenant.tenantName') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg: string) => void
        ) => {
          return new Promise((resolve) => {
            saveTenantNameValidateStatus.value = 'validating';
            tenantVerifyApi({
              id: saveModel.value?.id,
              value,
            })
              .then((res) => {
                saveTenantNameValidateStatus.value = 'success';
                resolve('');
              })
              .catch((err) => {
                callback(apiErrorRMsg(err));
                saveTenantNameValidateStatus.value = 'error';
                resolve('');
              });
          });
        },
      },
    ],
  };

  const checkPassWord = (callback: (apiErrorRMsg?: string) => void) => {
    if (
      saveModel.value.passWord &&
      saveModel.value.rePassWord &&
      saveModel.value.passWord !== saveModel.value.rePassWord
    ) {
      passWordValidateStatus.value = 'error';
      callback(t('system.tenant.admin.password.different'));
    } else {
      passWordValidateStatus.value = 'success';
      callback();
    }
  };

  const showSaveModal = (record?: TenantInfoResponseBody) => {
    if (record) {
      updateDefaultRequest(record.id);
      saveTitle.value = t('common.action.update');
    } else {
      saveTitle.value = t('common.action.add');
      saveModel.value = saveModelDefault();
    }
    saveVisible.value = true;
    saveTenantNameValidateStatus.value = '';
  };

  /**
   * 编辑初始化查询
   */
  const updateDefaultRequest = async (id: string) => {
    saveDefaultLoading.value = true;
    try {
      const { data } = await tenantInfoApi(id);
      saveModel.value = {
        id: data.id,
        tenantName: data.tenantName,
        state: data.state,
        loginName: '',
        passWord: '',
        rePassWord: '',
        realName: '',
      };
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      saveDefaultLoading.value = false;
    }
  };

  const saveCancel = () => {
    saveVisible.value = false;
    saveRef.value?.resetFields();
  };

  const saveBeforeOk = async () => {
    if (saveLoading.value) {
      return false;
    }
    const res = await saveRef.value?.validate();
    if (res) {
      return false;
    }
    saveLoading.value = true;
    try {
      const { id } = saveModel.value;
      if (id) {
        await tenantUpdateApi(id, {
          tenantName: saveModel.value.tenantName,
          state: saveModel.value.state,
        });
        Message.success(t('common.success.update'));
        return true;
      }
      await tenantAddApi({
        tenantName: saveModel.value.tenantName,
        state: saveModel.value.state,
        user: {
          loginName: saveModel.value.loginName,
          passWord: saveModel.value.passWord,
          realName: saveModel.value.realName,
        },
      });
      Message.success(t('common.success.add'));
      return true;
    } catch (err) {
      return false;
    } finally {
      saveLoading.value = false;
    }
  };

  // =========== 保存结束 ===========

  // ========== 复制管理员密码开始 ===========
  const passwordCopyAction = async (record: TenantInfoResponseBody) => {
    try {
      const { data } = await tenantPasswordApi(record.id);
      copyAction(data);
    } catch (err) {
      // you can report use errorHandler or other
    }
  };
  // =========== 复制管理员密码结束 ===========

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
    name: 'Tenant',
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
