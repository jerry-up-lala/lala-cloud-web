<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.system.menu')">
      <a-row>
        <a-col :flex="1">
          <a-form
            ref="queryRef"
            :model="queryModel"
            :label-col-props="{ span: 0 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="value">
                  <a-input-search
                    v-model="queryModel.value"
                    v-permission="['MENU:QUERY']"
                    :placeholder="$t('system.menu.query.placeholder')"
                    allow-clear
                    search-button
                    :loading="tableLoading"
                    @search="tableDataRequest"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space></a-space>
        </a-col>
        <a-col
          :span="12"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <!-- 刷新按钮 -->
          <a-tooltip :content="$t('common.action.refresh')">
            <div
              v-permission="['MENU:QUERY']"
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

      <!-- 菜单列表 -->
      <a-table
        :loading="tableLoading"
        row-key="id"
        :columns="tableColumns"
        :data="tableData"
        :size="tableSize"
        stripe
        column-resizable
        table-layout-fixed
        hide-expand-button-on-empty
        :bordered="{ cell: true }"
        :pagination="false"
      >
        <template #locale="{ record }">
          {{ $t(record.locale) }}
        </template>

        <template #type="{ record }">
          <a-tag :color="record.type === 1 ? 'blue' : 'gray'">
            {{
              record.type === 1
                ? $t('system.menu.type.menu')
                : $t('system.menu.type.button')
            }}
          </a-tag>
        </template>

        <template #accessCodes="{ record }">
          <a-space v-if="record.accessCodes">
            <a-tag v-for="accessCode in record.accessCodes" :key="accessCode">
              {{ accessCode }}
            </a-tag>
          </a-space>
        </template>

        <template #requiresAuth="{ record }">
          <a-tag :color="record.requiresAuth === true ? 'orangered' : 'blue'">
            {{
              record.requiresAuth === true
                ? $t('system.menu.requiresAuth.true')
                : $t('system.menu.requiresAuth.false')
            }}
          </a-tag>
        </template>

        <template #icon="{ record }">
          <arco-icon v-if="record.icon" :icon="record.icon" :size="20" />
        </template>

        <template #hideInMenu="{ record }">
          <a-tag
            v-if="record.type === 1"
            :color="record.hideInMenu === true ? 'gray' : 'blue'"
          >
            {{
              record.hideInMenu === true
                ? $t('system.menu.hideInMenu.true')
                : $t('system.menu.hideInMenu.false')
            }}
          </a-tag>
        </template>

        <template #hideChildrenInMenu="{ record }">
          <a-tag
            v-if="record.type === 1"
            :color="record.hideChildrenInMenu === true ? 'gray' : 'blue'"
          >
            {{
              record.hideChildrenInMenu === true
                ? $t('common.enum.yes')
                : $t('common.enum.no')
            }}
          </a-tag>
        </template>

        <template #noAffix="{ record }">
          <span v-if="record.type === 1">
            <a-tag v-if="regexUrl.test(record.path)" color="green">
              {{ $t('system.menu.noAffix.url') }}
            </a-tag>
            <span v-else-if="record.noAffix !== null">
              <a-tag v-if="record.noAffix" color="pinkpurple">
                {{ $t('system.menu.noAffix.true') }}
              </a-tag>
              <a-tag v-else color="blue">
                {{ $t('system.menu.noAffix.false') }}
              </a-tag>
            </span>
          </span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch, nextTick } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import cloneDeep from 'lodash/cloneDeep';
  import Sortable from 'sortablejs';
  import { DataBody } from '@/global/body';
  import {
    TableColumn,
    TableSize,
    TableSizeType,
    tableSizeTypes,
  } from '@/global/table';
  import { arrayExchange } from '@/utils/array';
  import { regexUrl } from '@/utils/url';
  import { menuListApi } from '@/api/request/menu';

  const { t } = useI18n();

  // =========== 分页列表开始 ===========

  /**
   * 初始化查询条件
   */
  const queryModelDefault = (): DataBody<string> => {
    return {
      value: '',
    };
  };

  // 查询表单
  const queryRef = ref<FormInstance>();
  // 查询表单
  const queryModel = ref(queryModelDefault());
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
      title: t('system.menu.locale'),
      dataIndex: 'locale',
      slotName: 'locale',
      width: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.type'),
      dataIndex: 'type',
      slotName: 'type',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.accessCodes'),
      dataIndex: 'accessCodes',
      slotName: 'accessCodes',
      width: 200,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.requiresAuth'),
      dataIndex: 'requiresAuth',
      slotName: 'requiresAuth',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.icon'),
      dataIndex: 'icon',
      slotName: 'icon',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.name'),
      dataIndex: 'name',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.path'),
      dataIndex: 'path',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.hideInMenu'),
      dataIndex: 'hideInMenu',
      slotName: 'hideInMenu',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.hideChildrenInMenu'),
      dataIndex: 'hideChildrenInMenu',
      slotName: 'hideChildrenInMenu',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.noAffix'),
      dataIndex: 'noAffix',
      slotName: 'noAffix',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('system.menu.menuOrder'),
      dataIndex: 'menuOrder',
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
      const { data } = await menuListApi(queryModel.value);
      tableData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      tableLoading.value = false;
    }
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
    name: 'SystemMenu',
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
