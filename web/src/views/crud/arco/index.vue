<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.crud.arco')">
      <a-form ref="queryRef" :model="queryModel" label-align="left">
        <a-grid
          :cols="{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 5 }"
          :col-gap="12"
        >
          <a-grid-item>
            <a-form-item
              field="input"
              :label="$t('basic.crud.input')"
              :label-col-props="
                formColProps($t('basic.crud.input')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.input')).wrapperColProps
              "
            >
              <a-input
                v-model="queryModel.input"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="inputNumberStart"
              :label="$t('basic.crud.inputNumberStart')"
              :label-col-props="
                formColProps($t('basic.crud.inputNumberStart')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.inputNumberStart')).wrapperColProps
              "
            >
              <a-input-number
                v-model="queryModel.inputNumberStart"
                :precision="2"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="inputNumberEnd"
              :label="$t('basic.crud.inputNumberEnd')"
              :label-col-props="
                formColProps($t('basic.crud.inputNumberEnd')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.inputNumberEnd')).wrapperColProps
              "
            >
              <a-input-number
                v-model="queryModel.inputNumberEnd"
                :precision="2"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="inputTagList"
              :label="$t('basic.crud.inputTag')"
              :label-col-props="
                formColProps($t('basic.crud.inputTag')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.inputTag')).wrapperColProps
              "
            >
              <a-input-tag
                v-model="queryModel.inputTagList"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="autoComplete"
              :label="$t('basic.crud.autoComplete')"
              :label-col-props="
                formColProps($t('basic.crud.autoComplete')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.autoComplete')).wrapperColProps
              "
            >
              <a-auto-complete
                v-model="queryModel.autoComplete"
                :data="crudListLabelsOptions"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="mention"
              :label="$t('basic.crud.mention')"
              :label-col-props="
                formColProps($t('basic.crud.mention')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.mention')).wrapperColProps
              "
            >
              <a-mention
                v-model="queryModel.mention"
                :data="crudListLabelsOptions"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="textArea"
              :label="$t('basic.crud.textArea')"
              :label-col-props="
                formColProps($t('basic.crud.textArea')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.textArea')).wrapperColProps
              "
            >
              <a-input
                v-model="queryModel.textArea"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="rateStart"
              :label="$t('basic.crud.rateStart')"
              :label-col-props="
                formColProps($t('basic.crud.rateStart')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.rateStart')).wrapperColProps
              "
            >
              <a-input-number
                v-model="queryModel.rateStart"
                :precision="1"
                :min="0"
                :max="5"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="rateEnd"
              :label="$t('basic.crud.rateEnd')"
              :label-col-props="
                formColProps($t('basic.crud.rateEnd')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.rateEnd')).wrapperColProps
              "
            >
              <a-input-number
                v-model="queryModel.rateEnd"
                :precision="1"
                :min="0"
                :max="5"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="sliderStart"
              :label="$t('basic.crud.sliderStart')"
              :label-col-props="
                formColProps($t('basic.crud.sliderStart')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.sliderStart')).wrapperColProps
              "
            >
              <a-input-number
                v-model="queryModel.sliderStart"
                :precision="0"
                :min="0"
                :max="100"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="sliderEnd"
              :label="$t('basic.crud.sliderEnd')"
              :label-col-props="
                formColProps($t('basic.crud.sliderEnd')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.sliderEnd')).wrapperColProps
              "
            >
              <a-input-number
                v-model="queryModel.sliderEnd"
                :precision="0"
                :min="0"
                :max="100"
                allow-clear
                :placeholder="$t('common.placeholder.input')"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="switchInfo"
              :label="$t('basic.crud.switchInfo')"
              :label-col-props="
                formColProps($t('basic.crud.switchInfo')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.switchInfo')).wrapperColProps
              "
            >
              <a-select
                v-model="queryModel.switchInfo"
                :options="crudSwitchInfoOptions"
                :placeholder="$t('common.placeholder.select')"
                allow-clear
                allow-search
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="radioList"
              :label="$t('basic.crud.radio')"
              :label-col-props="
                formColProps($t('basic.crud.radio')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.radio')).wrapperColProps
              "
            >
              <a-select
                v-model="queryModel.radioList"
                :options="crudListOptions"
                :placeholder="$t('common.placeholder.select')"
                multiple
                :max-tag-count="1"
                allow-clear
                allow-search
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="checkboxList"
              :label="$t('basic.crud.checkbox')"
              :label-col-props="
                formColProps($t('basic.crud.checkbox')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.checkbox')).wrapperColProps
              "
            >
              <a-select
                v-model="queryModel.checkboxList"
                :options="crudListOptions"
                :placeholder="$t('common.placeholder.select')"
                multiple
                :max-tag-count="1"
                allow-clear
                allow-search
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="selectInfoList"
              :label="$t('basic.crud.selectInfo')"
              :label-col-props="
                formColProps($t('basic.crud.selectInfo')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.selectInfo')).wrapperColProps
              "
            >
              <a-select
                v-model="queryModel.selectInfoList"
                :options="crudListOptions"
                :placeholder="$t('common.placeholder.select')"
                multiple
                :max-tag-count="1"
                allow-clear
                allow-search
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="cascaderList"
              :label="$t('basic.crud.cascader')"
              :label-col-props="
                formColProps($t('basic.crud.cascader')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.cascader')).wrapperColProps
              "
            >
              <a-cascader
                v-model="queryModel.cascaderList"
                :options="crudTreeOptions"
                :field-names="DICT_CASCADER_FIELD_NAMES"
                :placeholder="$t('common.placeholder.select')"
                multiple
                :max-tag-count="1"
                check-strictly
                allow-clear
                allow-search
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="treeSelectList"
              :label="$t('basic.crud.treeSelect')"
              :label-col-props="
                formColProps($t('basic.crud.treeSelect')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.treeSelect')).wrapperColProps
              "
            >
              <a-tree-select
                v-model="queryModel.treeSelectList"
                :data="crudTreeOptions"
                :field-names="DICT_TREE_FIELD_NAMES"
                :placeholder="$t('common.placeholder.select')"
                multiple
                :max-tag-count="1"
                allow-clear
                allow-search
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              field="transferList"
              :label="$t('basic.crud.transfer')"
              :label-col-props="
                formColProps($t('basic.crud.transfer')).labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.transfer')).wrapperColProps
              "
            >
              <a-tree-select
                v-model="queryModel.transferList"
                :data="crudListOptions"
                :field-names="DICT_TREE_FIELD_NAMES"
                :placeholder="$t('common.placeholder.select')"
                multiple
                :max-tag-count="1"
                allow-clear
                allow-search
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item
            :span="{
              xs: 2,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
              xxl: 2,
            }"
          >
            <a-form-item
              field="dateTimePickerRang"
              :label="$t('basic.crud.dateTimePicker')"
              :label-col-props="
                formColProps($t('basic.crud.dateTimePicker'), true)
                  .labelColProps
              "
              :wrapper-col-props="
                formColProps($t('basic.crud.dateTimePicker'), true)
                  .wrapperColProps
              "
            >
              <a-range-picker
                v-model="queryModel.dateTimePickerRang"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                allow-clear
                :placeholder="[
                  $t('common.placeholder.dateTimePicker.start'),
                  $t('common.placeholder.dateTimePicker.end'),
                ]"
              />
            </a-form-item>
          </a-grid-item>

          <a-grid-item>
            <a-form-item
              :label-col-props="{
                offset: 1,
              }"
            >
              <a-space :size="18">
                <a-button
                  v-permission="['CRUD:ARCO:QUERY']"
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
            </a-form-item>
          </a-grid-item>
        </a-grid>
      </a-form>

      <a-row>
        <a-alert :title="$t('common.info.query')" closable>
          <a-typography-paragraph type="secondary" copyable>
            {{ qs.stringify(queryModel) }}
          </a-typography-paragraph>
        </a-alert>
      </a-row>

      <a-divider style="margin-top: 0" />

      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button
              v-permission="['CRUD:ARCO:ADD']"
              type="primary"
              @click="jumpAdd"
            >
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('common.action.add') }}
            </a-button>

            <a-button
              v-permission="['CRUD:ARCO:UPLOAD']"
              type="primary"
              @click="jumpUpload"
            >
              <template #icon>
                <icon-upload />
              </template>
              {{ $t('common.action.upload') }}
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
                  v-permission="['CRUD:ARCO:BATCH:DELETE']"
                  :disabled="tableSelectedRowKeys.length === 0"
                  @click="showBatchDeleteModal"
                >
                  {{ $t('common.action.batch.delete') }}
                </a-doption>

                <a-divider
                  v-permission="['CRUD:ARCO:BATCH:DELETE']"
                  :margin="1"
                />

                <a-doption
                  v-permission="['CRUD:ARCO:EXPORT']"
                  :disabled="tableSelectedRowKeys.length === 0"
                  @click="handleExport(3)"
                >
                  {{ $t('common.action.batch.export.selected') }}
                </a-doption>

                <a-doption
                  v-permission="['CRUD:ARCO:EXPORT']"
                  @click="handleExport(1)"
                >
                  {{ $t('common.action.batch.export.all') }}
                </a-doption>

                <a-doption
                  v-permission="['CRUD:ARCO:EXPORT']"
                  @click="handleExport(2)"
                >
                  {{ $t('common.action.batch.export.currentPage') }}
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
              v-permission="['CRUD:ARCO:QUERY']"
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
        :columns="tableColumns"
        :data="tableData"
        :scroll="tableScroll"
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

        <template #inputTagList="{ record }">
          <a-space>
            <a-tag
              v-for="(item, index) of record.inputTagList"
              :key="index"
              :color="randomColor(index)"
              >{{ item }}
            </a-tag>
          </a-space>
        </template>

        <template #switchInfo="{ record }">
          <a-tag
            :color="
              randomColor(
                crudSwitchInfoOptions.findIndex(
                  (item) => `${item?.values}` === `${record.switchInfo}`
                )
              )
            "
          >
            {{
              crudSwitchInfoOptions.find(
                (item) => `${item?.values}` === `${record.switchInfo}`
              )?.label
            }}
          </a-tag>
        </template>

        <template #radio="{ record }">
          <a-tag
            :color="
              randomColor(
                crudListOptions.findIndex(
                  (item) => `${item?.values}` === `${record.radio}`
                )
              )
            "
          >
            {{
              crudListOptions.find(
                (item) => `${item?.values}` === `${record.radio}`
              )?.label
            }}
          </a-tag>
        </template>

        <template #checkboxList="{ record }">
          <a-space>
            <a-tag
              v-for="(checkboxValue, index) of record.checkboxList"
              :key="index"
              :color="
                randomColor(
                  crudListOptions.findIndex(
                    (item) => `${item?.values}` === `${checkboxValue}`
                  )
                )
              "
              >{{
                crudListOptions.find(
                  (item) => `${item?.values}` === `${checkboxValue}`
                )?.label
              }}</a-tag
            >
          </a-space>
        </template>

        <template #selectInfo="{ record }">
          <a-tag
            :color="
              randomColor(
                crudListOptions.findIndex(
                  (item) => `${item?.values}` === `${record.selectInfo}`
                )
              )
            "
          >
            {{
              crudListOptions.find(
                (item) => `${item?.values}` === `${record.selectInfo}`
              )?.label
            }}
          </a-tag>
        </template>

        <template #cascader="{ record }">
          <a-tag
            :color="
              randomColor(
                crudTreeExpandedOptions.findIndex(
                  (item) => `${item?.values}` === `${record.cascader}`
                )
              )
            "
          >
            {{
              crudTreeExpandedOptions.find(
                (item) => `${item?.values}` === `${record.cascader}`
              )?.label
            }}
          </a-tag>
        </template>

        <template #treeSelect="{ record }">
          <a-tag
            :color="
              randomColor(
                crudTreeExpandedOptions.findIndex(
                  (item) => `${item?.values}` === `${record.radio}`
                )
              )
            "
          >
            {{
              crudTreeExpandedOptions.find(
                (item) => `${item?.values}` === `${record.treeSelect}`
              )?.label
            }}
          </a-tag>
        </template>

        <template #transferList="{ record }">
          <a-space>
            <a-tag
              v-for="(transferValue, index) of record.transferList"
              :key="index"
              :color="
                randomColor(
                  crudTreeExpandedOptions.findIndex(
                    (item) => `${item?.values}` === `${record.radio}`
                  )
                )
              "
              >{{
                crudTreeExpandedOptions.find(
                  (item) => `${item?.values}` === `${transferValue}`
                )?.label
              }}</a-tag
            >
          </a-space>
        </template>

        <template #operate="{ record }">
          <a-button
            v-permission="['CRUD:ARCO:UPDATE']"
            type="text"
            @click="jumpUpdate(record.id)"
          >
            {{ $t('common.action.update') }}
          </a-button>
          <a-popconfirm
            :content="$t('common.confirm.delete')"
            type="error"
            :ok-loading="deleteLoading"
            :on-before-ok="deleteBeforeOk"
            @show="deleteShow(record)"
            @ok="tableDataRequest"
            @hide="deleteCancel"
          >
            <a-button
              v-permission="['CRUD:ARCO:DELETE']"
              type="text"
              status="danger"
              >{{ $t('common.action.delete') }}
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
  import { TableRowSelection } from '@arco-design/web-vue/es/table';
  import { PaginationProps } from '@arco-design/web-vue/es/pagination';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useI18n } from 'vue-i18n';
  import qs from 'query-string';
  import useRouter from '@/hooks/router';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import {
    TableColumn,
    PaginationDefault,
    TableRowSelectionDefault,
    TableSize,
    TableSizeType,
    tableSizeTypes,
  } from '@/global/table';
  import {
    DICT_TREE_FIELD_NAMES,
    DICT_CASCADER_FIELD_NAMES,
  } from '@/global/dict';

  import { randomColor } from '@/utils/color';
  import { arrayExchange, arrayActionInfo } from '@/utils/array';
  import { formColProps } from '@/utils/grid';
  import { downloadXlsx } from '@/utils/blob';

  import { crudOptions } from '@/data/crud';
  import {
    crudPageApi,
    crudBatchDeleteApi,
    crudDeleteApi,
    crudExportApi,
    CrudQueryParams,
    CrudPageParams,
    CrudDataBody,
    CrudExportParams,
  } from '@/api/request/crud';

  const { t } = useI18n();

  const { router } = useRouter();

  const {
    crudListLabelsOptions,
    crudListOptions,
    crudSwitchInfoOptions,
    crudTreeOptions,
    crudTreeExpandedOptions,
  } = crudOptions();

  // =========== 分页列表开始 ===========

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
    x: 2000,
  };
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
  const tableData = ref<CrudDataBody[]>([]);
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
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.radio'),
      dataIndex: 'radio',
      slotName: 'radio',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.checkbox'),
      dataIndex: 'checkboxList',
      slotName: 'checkboxList',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.selectInfo'),
      dataIndex: 'selectInfo',
      slotName: 'selectInfo',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.cascader'),
      dataIndex: 'cascader',
      slotName: 'cascader',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.treeSelect'),
      dataIndex: 'treeSelect',
      slotName: 'treeSelect',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.transfer'),
      dataIndex: 'transferList',
      slotName: 'transferList',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.crud.dateTimePicker'),
      dataIndex: 'dateTimePicker',
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
      const query: CrudPageParams = {
        current: tablePagination.current,
        pageSize: tablePagination.pageSize,
        ...queryModel.value,
      };
      const { data } = await crudPageApi(query);
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

  const jumpAdd = () => {
    router.push({ name: 'CrudArcoAdd' });
  };

  const jumpUpdate = (recordId: string) => {
    router.push({ name: 'CrudArcoUpdate', query: { id: recordId } });
  };

  const jumpUpload = () => {
    router.push({ name: 'CrudArcoUpload' });
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
      await crudBatchDeleteApi({ value: tableSelectedRowKeys.value });
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

  const deleteShow = (record: CrudDataBody) => {
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
      await crudDeleteApi(deleteId.value);
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

  const crudExportParams = (type: number): CrudExportParams => {
    // 导出全部
    if (type === 1) {
      return queryModel.value;
    }
    // 导出当前页
    if (type === 2) {
      return {
        current: tablePagination.current,
        pageSize: tablePagination.pageSize,
        currentPage: true,
        ...queryModel.value,
      };
    }
    // 导出所选
    return {
      ids: tableSelectedRowKeys.value,
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
    name: 'CrudArco',
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
