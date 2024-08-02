<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.dev.gen.operate')">
      <a-steps small :current="saveStepCurrent" @change="saveStepChange">
        <a-step
          :title="$t('dev.gen.operate.step.table.title')"
          :description="$t('dev.gen.operate.step.table.description')"
        />
        <a-step
          :title="$t('dev.gen.operate.step.column.title')"
          :description="$t('dev.gen.operate.step.column.description')"
        />
        <a-step
          :title="$t('dev.gen.operate.step.preview.title')"
          :description="$t('dev.gen.operate.step.preview.description')"
        />
      </a-steps>

      <a-divider />

      <a-spin
        v-if="saveStepCurrent === 1"
        style="width: 100%"
        :loading="saveGenTableSpinLoading"
        :tip="$t('common.loading.info')"
      >
        <a-form
          ref="saveGenTableRef"
          :model="saveGenTableModel"
          :rules="saveGenTableRules"
        >
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="tableSchema"
                :label="$t('dev.gen.tableSchema')"
              >
                <a-input
                  v-model="saveGenTableModel.tableSchema"
                  :placeholder="$t('common.placeholder.input')"
                  allow-clear
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="tableName" :label="$t('dev.gen.tableName')">
                <a-input
                  v-model="saveGenTableModel.tableName"
                  :placeholder="$t('common.placeholder.input')"
                  allow-clear
                  disabled
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="packageName"
                :label="$t('dev.gen.packageName')"
              >
                <a-input
                  v-model="saveGenTableModel.packageName"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="75"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="className" :label="$t('dev.gen.className')">
                <a-input
                  v-model="saveGenTableModel.className"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="25"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="functionName"
                :label="$t('dev.gen.functionName')"
              >
                <a-input
                  v-model="saveGenTableModel.functionName"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="30"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="author" :label="$t('dev.gen.author')">
                <a-input
                  v-model="saveGenTableModel.author"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="15"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-spin>

      <a-table
        v-if="saveStepCurrent === 2"
        row-key="columnName"
        :loading="genColumnTableLoading"
        :columns="genColumnColumns"
        :data="genColumnData"
        :draggable="{ type: 'handle', width: 40 }"
        column-resizable
        table-layout-fixed
        :bordered="{ cell: true }"
        :pagination="false"
        @change="genColumnTableChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 }}
        </template>

        <template #columnName="{ record }">
          <a-space>
            {{ record.columnName }}
            <a-popover v-if="record.columnKey || record.columnExtra">
              <icon-info-circle />
              <template #content>
                <a-descriptions :column="1" :align="{ value: 'left' }">
                  <a-descriptions-item
                    v-if="record.columnKey"
                    :label="$t('dev.gen.columnKey')"
                  >
                    <a-typography-text>
                      {{ record.columnKey }}
                    </a-typography-text>
                  </a-descriptions-item>

                  <a-descriptions-item
                    v-if="record.columnExtra"
                    :label="$t('dev.gen.columnExtra')"
                  >
                    <a-typography-text>
                      {{ record.columnExtra }}
                    </a-typography-text>
                  </a-descriptions-item>
                </a-descriptions>
              </template>
            </a-popover>
          </a-space>
        </template>

        <template #fieldName="{ record }">
          <a-input
            v-model="record.fieldName"
            :placeholder="$t('common.placeholder.input')"
            :max-length="25"
            show-word-limit
          />
        </template>

        <template #fieldType="{ record }">
          <a-select
            v-model="record.fieldType"
            :options="genFieldTypeOptions"
            :placeholder="$t('common.placeholder.select')"
            allow-search
          />
        </template>

        <template #fieldComment="{ record }">
          <a-input
            v-model="record.fieldComment"
            :placeholder="$t('common.placeholder.input')"
            :max-length="30"
            show-word-limit
          />
        </template>

        <template #fieldDictKey="{ record }">
          <a-select
            v-model="record.fieldDictKey"
            :loading="dictListLoading"
            :options="genFieldDictKeyOptions"
            :field-names="DICT_KEY_SELECT_FIELD_NAMES"
            :placeholder="$t('common.placeholder.select')"
            allow-clear
            allow-search
          />
        </template>
      </a-table>

      <a-spin
        v-if="saveStepCurrent === 3"
        style="width: 100%"
        :loading="genPreviewSpinLoading"
        :tip="$t('common.loading.info')"
      >
        <a-row style="margin-bottom: 16px">
          <a-col :span="12">
            <a-space>
              <a-input-search
                v-model="genPreviewTreeSearch"
                :placeholder="
                  $t('common.placeholder.input') +
                  $t('dev.gen.operate.tree.search')
                "
                allow-clear
                style="width: 240px"
              />

              <a-checkbox @change="genPreviewTreeExpandAll">
                {{ $t('common.tree.checkbox.expand') }}
              </a-checkbox>
            </a-space>
          </a-col>

          <a-col
            :span="12"
            style="
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <a-button
              type="primary"
              :loading="genPreviewDownloadLoading"
              @click="genDownloadRequest"
            >
              <template #icon>
                <icon-download />
              </template>
              <template #default>{{ $t('dev.gen.operate.download') }}</template>
            </a-button>
          </a-col>
        </a-row>

        <a-layout class="preview-layout">
          <a-layout-sider
            class="preview-layout-sider"
            :width="genPreviewTreeWidth"
          >
            <a-resize-box
              v-model:width="genPreviewTreeWidth"
              :directions="['right']"
            >
              <a-tree
                ref="genPreviewTreeRef"
                :data="genPreviewTreeData"
                show-line
                @select="genPreviewTreeSelect"
              >
                <template #title="nodeData">
                  <template
                    v-if="genPreviewTreeMatchIndex(nodeData?.title) < 0"
                  >
                    {{ nodeData?.title }}
                  </template>

                  <span v-else>
                    {{
                      nodeData?.title?.substr(
                        0,
                        genPreviewTreeMatchIndex(nodeData?.title)
                      )
                    }}<span style="color: var(--color-primary-light-4)">
                      {{
                        nodeData?.title?.substr(
                          genPreviewTreeMatchIndex(nodeData?.title),
                          genPreviewTreeSearch.length
                        )
                      }}</span
                    >{{
                      nodeData?.title?.substr(
                        genPreviewTreeMatchIndex(nodeData?.title) +
                          genPreviewTreeSearch.length
                      )
                    }}
                  </span>
                </template>
              </a-tree>
            </a-resize-box>
          </a-layout-sider>

          <a-layout-content>
            <a-tabs
              type="card"
              :active-key="genPreviewTabActiveKey"
              @tab-click="genPreviewTabClick"
            >
              <a-tab-pane
                v-for="item in genPreviewData.tab"
                :key="item.key"
                :title="item.title"
              >
                <code-view :data="item.code" :lang="item.title" />
              </a-tab-pane>
            </a-tabs>
          </a-layout-content>
        </a-layout>
      </a-spin>

      <div
        :style="{
          width: '100%',
          padding: '20px 20px 0px 20px',
          textAlign: 'center',
          background: 'var(--color-bg-2)',
          color: '#C2C7CC',
        }"
      >
        <a-space size="large">
          <a-button
            type="secondary"
            :disabled="saveStepCurrent <= 1"
            @click="saveStepBack()"
          >
            <IconLeft /> {{ $t('common.action.steps.back') }}
          </a-button>
          <a-button
            type="primary"
            :disabled="saveStepCurrent >= 3"
            :loading="saveStepNextSubmitLoading"
            @click="saveStepNext()"
          >
            {{ $t('common.action.steps.next') }} <IconRight />
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, onMounted } from 'vue';
  import useRouter from '@/hooks/router';
  import { useI18n } from 'vue-i18n';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import type { TreeNodeData } from '@arco-design/web-vue/es/tree/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { Message } from '@arco-design/web-vue';
  import { treeArraySearch } from '@/utils/array';
  import { downloadZip } from '@/utils/blob';
  import { DICT_KEY_SELECT_FIELD_NAMES } from '@/global/dict';
  import { genFieldTypeOptionsData } from '@/data/gen';
  import {
    genTableInfoApi,
    genTableSaveApi,
    genColumnApi,
    genColumnSaveApi,
    genPreviewApi,
    genDownloadApi,
    GenTableSaveBody,
    GenColumnBody,
    GenColumnSaveBody,
    GenPreviewResponseBody,
  } from '@/api/request/gen';
  import { dictListApi } from '@/api/request/dict';

  const { t } = useI18n();

  const { route } = useRouter();

  const genFieldTypeOptions = computed<string[]>(() =>
    genFieldTypeOptionsData()
  );

  const genFieldDictKeyOptions = ref<SelectOptionData[]>([]);

  const dictListLoading = ref(false);

  const dictListRequest = async () => {
    dictListLoading.value = true;
    try {
      const { data } = await dictListApi();
      genFieldDictKeyOptions.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      dictListLoading.value = false;
    }
  };

  // 当前步骤
  const saveStepCurrent = ref<number>(1);

  // 下一步按钮加载
  const saveStepNextSubmitLoading = ref(false);

  const saveStepBack = () => {
    saveStepChange(Math.max(1, saveStepCurrent.value - 1));
  };

  const saveStepNext = () => {
    saveStepChange(Math.min(3, saveStepCurrent.value + 1));
  };

  const saveStepChange = (step: number) => {
    // 下一步
    if (saveStepCurrent.value < step) {
      // 列配置
      if (step === 2) {
        genTableSaveRequest();
      }
      // 预览
      if (step === 3) {
        genColumnSaveRequest();
      }
    }
    // 上一步
    if (saveStepCurrent.value > step) {
      // 表配置
      if (step === 1) {
        genTableInfoRequest();
      }
      // 列配置
      if (step === 2) {
        saveStepCurrent.value = 2;
        genColumnRequest();
      }
    }
  };

  // =========== 表信息保存开始 ===========
  const tableName = ref<string>(
    route.query?.tableName ? String(route.query?.tableName) : ''
  );

  /**
   * 保存表单初始化
   */
  const saveGenTableModelDefault = (): GenTableSaveBody => {
    return {
      tableName: '',
    };
  };
  // 保存表单加载
  const saveGenTableSpinLoading = ref(false);
  // 保存ref
  const saveGenTableRef = ref<FormInstance>();
  // 保存表单
  const saveGenTableModel = ref(saveGenTableModelDefault());
  // 保存表单规则
  const saveGenTableRules = {
    tableSchema: [
      {
        required: true,
        message: t('dev.gen.tableSchema') + t('common.required.enter'),
      },
    ],
    tableName: [
      {
        required: true,
        message: t('dev.gen.tableName') + t('common.required.enter'),
      },
    ],
    packageName: [
      {
        required: true,
        message: t('dev.gen.packageName') + t('common.required.enter'),
      },
    ],
    className: [
      {
        required: true,
        message: t('dev.gen.className') + t('common.required.enter'),
      },
    ],
    functionName: [
      {
        required: true,
        message: t('dev.gen.functionName') + t('common.required.enter'),
      },
    ],
    author: [
      {
        required: true,
        message: t('dev.gen.author') + t('common.required.enter'),
      },
    ],
  };

  /**
   * 编辑初始化查询
   */
  const genTableInfoRequest = async () => {
    saveGenTableSpinLoading.value = true;
    try {
      const { data } = await genTableInfoApi(tableName.value);
      saveGenTableModel.value = data;
      saveStepCurrent.value = 1;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      saveGenTableSpinLoading.value = false;
    }
  };

  const genTableSaveRequest = async () => {
    if (saveStepNextSubmitLoading.value) {
      return;
    }
    const errors = await saveGenTableRef.value?.validate();
    if (errors) {
      return;
    }
    saveStepNextSubmitLoading.value = true;
    try {
      const { data } = await genTableSaveApi({
        tableSchema: saveGenTableModel.value.tableSchema,
        tableName: saveGenTableModel.value.tableName,
        packageName: saveGenTableModel.value.packageName,
        className: saveGenTableModel.value.className,
        functionName: saveGenTableModel.value.functionName,
        author: saveGenTableModel.value.author,
      });
      tableId.value = data;
      Message.success(
        t('dev.gen.operate.step.table.title') + t('common.success.save')
      );
      saveStepCurrent.value = 2;
      genColumnRequest();
    } catch (err) {
      tableId.value = undefined;
    } finally {
      saveStepNextSubmitLoading.value = false;
    }
  };

  // =========== 表信息保存结束 ===========

  // =========== 列信息保存开始 ===========
  // 表ID
  const tableId = ref<number | undefined>();

  // 保存表单加载
  const genColumnTableLoading = ref(false);

  // 列表数据
  const genColumnData = ref<GenColumnBody[]>([]);

  // 列名
  const genColumnColumns = reactive<TableColumnData[]>([
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
          title: t('dev.gen.columnName'),
          dataIndex: 'columnName',
          slotName: 'columnName',
          width: 140,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.columnComment'),
          dataIndex: 'columnComment',
          width: 140,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.columnType'),
          dataIndex: 'columnType',
          width: 140,
          ellipsis: true,
          tooltip: true,
        },
      ],
    },
    {
      title: t('dev.gen.configInfo'),
      children: [
        {
          title: t('dev.gen.fieldName'),
          dataIndex: 'fieldName',
          slotName: 'fieldName',
          width: 200,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.fieldType'),
          dataIndex: 'fieldType',
          slotName: 'fieldType',
          width: 160,
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.fieldComment'),
          dataIndex: 'fieldComment',
          slotName: 'fieldComment',
          ellipsis: true,
          tooltip: true,
        },
        {
          title: t('dev.gen.fieldDictKey'),
          dataIndex: 'fieldDictKey',
          slotName: 'fieldDictKey',
          width: 200,
          ellipsis: true,
          tooltip: true,
        },
      ],
    },
  ]);

  const genColumnTableChange = (_data: any[]) => {
    genColumnData.value = _data;
  };

  const genColumnRequest = async () => {
    genColumnTableLoading.value = true;
    try {
      const { data } = await genColumnApi(tableId.value);
      genColumnData.value = data;
    } catch (err) {
      // err
    } finally {
      genColumnTableLoading.value = false;
    }
  };

  const genColumnSaveRequest = async () => {
    if (saveStepNextSubmitLoading.value) {
      return;
    }
    const errors = genColumnData.value.some(
      (column) => !column.fieldName || !column.fieldComment
    );
    if (errors) {
      const separator = ',';
      Message.error(
        t('dev.gen.fieldName') +
          separator +
          t('dev.gen.fieldComment') +
          t('common.required.enter')
      );
      return;
    }
    saveStepNextSubmitLoading.value = true;
    try {
      const value: GenColumnSaveBody[] = genColumnData.value.map((column) => {
        return {
          columnName: column.columnName,
          fieldName: column.fieldName,
          fieldType: column.fieldType,
          fieldComment: column.fieldComment,
          fieldDictKey: column.fieldDictKey,
        };
      });
      await genColumnSaveApi(tableId.value, {
        value,
      });
      Message.success(
        t('dev.gen.operate.step.column.title') + t('common.success.save')
      );
      saveStepCurrent.value = 3;
      genPreviewRequest();
    } catch (err) {
      // err
    } finally {
      saveStepNextSubmitLoading.value = false;
    }
  };

  // =========== 列信息保存结束 ===========

  // =========== 预览开始 ===========
  // 预览表单加载
  const genPreviewSpinLoading = ref(false);

  // 预览数据
  const genPreviewData = ref<GenPreviewResponseBody>({ tree: [], tab: [] });

  // 查询条件
  const genPreviewTreeSearch = ref('');

  // 预览树
  const genPreviewTreeRef = ref();

  // 预览树宽度
  const genPreviewTreeWidth = ref(200);

  // tab key
  const genPreviewTabActiveKey = ref<string | number | undefined>('');

  const genPreviewTreeData = computed(() => {
    if (!genPreviewTreeSearch.value) return genPreviewData.value.tree;
    return treeArraySearch(
      genPreviewData.value.tree,
      genPreviewTreeSearch.value
    );
  });

  const genPreviewRequest = async () => {
    genPreviewSpinLoading.value = true;
    try {
      const { data } = await genPreviewApi(tableId.value);
      genPreviewData.value = data;
      const { tab } = data;
      if (tab && tab.length > 0) {
        genPreviewTabActiveKey.value = tab[0].key;
      }
    } catch (err) {
      // err
    } finally {
      genPreviewSpinLoading.value = false;
    }
  };

  const genPreviewTreeExpandAll = (value: any) => {
    genPreviewTreeRef.value.expandAll(value);
    genPreviewTreeWidth.value = value ? 455 : 200;
  };

  const genPreviewTreeMatchIndex = (title: string): number => {
    if (!genPreviewTreeSearch.value) return -1;
    return title
      .toLowerCase()
      .indexOf(genPreviewTreeSearch.value.toLowerCase());
  };

  const genPreviewTreeSelect = (
    newSelectedKeys: (string | number)[],
    data: {
      selected?: boolean | undefined;
      selectedNodes: TreeNodeData[];
      node?: TreeNodeData | undefined;
      e?: Event | undefined;
    }
  ) => {
    const activeTab = genPreviewData.value.tab.find(
      (item) => item.key === newSelectedKeys[0]
    );
    if (activeTab) {
      genPreviewTabActiveKey.value = activeTab.key;
    }
  };

  const genPreviewTabClick = (key: string | number, ev: Event) => {
    genPreviewTabActiveKey.value = key;
  };
  // =========== 预览结束 ===========

  // =========== 下载压缩包开始 ===========
  const genPreviewDownloadLoading = ref<boolean>(false);

  const genDownloadRequest = async () => {
    if (genPreviewDownloadLoading.value) return;
    try {
      genPreviewDownloadLoading.value = true;
      const res: any = await genDownloadApi(tableId.value);
      downloadZip(res);
    } catch (err) {
      // do err
    } finally {
      genPreviewDownloadLoading.value = false;
    }
  };
  // =========== 下载压缩包结束 ===========

  // =========== 操作结束 ===========

  onMounted(() => {
    if (tableName.value) {
      genTableInfoRequest();
      dictListRequest();
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'GenOperate',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .preview-layout {
    height: 585px;
  }

  .preview-layout-sider {
    height: 585px;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
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
