<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.dev.empty')">
      <a-layout class="layout-height">
        <a-layout class="layout-height">
          <a-layout-sider :resize-directions="['right']" :width="400">
            <a-card>
              <a-space direction="vertical" fill>
                <a-space direction="horizontal">
                  <a-button
                    v-permission="['DICT:ADD']"
                    type="primary"
                    @click="dictSaveModalShow()"
                  >
                    <template #icon>
                      <icon-plus />
                    </template>
                    {{ $t('common.action.add') }}
                  </a-button>

                  <a-button
                    v-permission="['DICT:REFRESH:CACHE']"
                    @click="dictRefreshCacheRequest"
                  >
                    <template #icon>
                      <icon-refresh />
                    </template>
                    {{ $t('dev.dict.refresh.cache') }}
                  </a-button>
                </a-space>

                <a-input-search
                  v-permission="['DICT:QUERY']"
                  :placeholder="$t('dev.dict.search')"
                  search-button
                  allow-clear
                  :loading="dictListLoading"
                  @search="dictListRequest"
                />

                <a-list size="small" :loading="dictListLoading" hoverable>
                  <a-list-item
                    v-for="(item, index) of dictListData"
                    :key="index"
                  >
                    <a-list-item-meta
                      :title="item.dictName"
                      :description="item.dictKey"
                    ></a-list-item-meta>
                    <template #actions>
                      <span>
                        <a-button
                          v-permission="['DICT:ITEM:TREE']"
                          type="text"
                          @click="dictItemTableLoad(item)"
                        >
                          {{ $t('dev.dict.item.tree') }}
                        </a-button>
                        <a-button
                          v-permission="['DICT:UPDATE']"
                          type="text"
                          @click="dictSaveModalShow(item.id)"
                        >
                          {{ $t('common.action.update') }}
                        </a-button>
                        <a-popconfirm
                          :content="$t('common.confirm.delete')"
                          type="error"
                          :ok-loading="dictDeleteLoading"
                          :on-before-ok="dictDeleteBeforeOk"
                          @show="dictDeleteShow(item)"
                          @ok="dictListRequest"
                          @cancel="dictDeleteCancel"
                        >
                          <a-button
                            v-permission="['DICT:DELETE']"
                            type="text"
                            status="danger"
                            >{{ $t('common.action.delete') }}
                          </a-button>
                        </a-popconfirm>
                      </span>
                    </template>
                  </a-list-item>
                </a-list>
              </a-space>
            </a-card>
          </a-layout-sider>
          <a-layout-content>
            <a-card>
              <a-space v-if="dictCurrent" direction="vertical">
                <a-button
                  v-permission="['DICT:ITEM:ADD']"
                  type="primary"
                  @click="dictItemSaveModalShow()"
                >
                  <template #icon>
                    <icon-plus />
                  </template>
                  {{ $t('common.action.add') }}
                </a-button>
                <a-table
                  size="medium"
                  row-key="id"
                  :loading="dictItemTableLoading"
                  :columns="dictItemTableColumns"
                  :data="dictItemTableData"
                  stripe
                  column-resizable
                  table-layout-fixed
                  :bordered="{ cell: true }"
                >
                  <template #index="{ rowIndex }">
                    {{ rowIndex + 1 }}
                  </template>

                  <template #sortOrder>
                    <a-space>
                      {{ t('dev.dict.item.sortOrder') }}
                      <a-tooltip
                        :content="$t('dev.dict.item.sortOrder.tooltip')"
                      >
                        <icon-info-circle />
                      </a-tooltip>
                    </a-space>
                  </template>
                  <template #operate="{ record }">
                    <a-button
                      v-permission="['DICT:ITEM:UPDATE']"
                      type="text"
                      @click="dictItemSaveModalShow(record.id)"
                    >
                      {{ $t('common.action.update') }}
                    </a-button>
                    <a-popconfirm
                      :content="$t('common.confirm.delete')"
                      type="error"
                      :ok-loading="dictItemDeleteLoading"
                      :on-before-ok="dictItemDeleteBeforeOk"
                      @show="dictItemDeleteShow(record)"
                      @ok="dictItemTreeRequest"
                      @cancel="dictItemDeleteCancel"
                    >
                      <a-button
                        v-permission="['DICT:ITEM:DELETE']"
                        type="text"
                        status="danger"
                        >{{ $t('common.action.delete') }}
                      </a-button>
                    </a-popconfirm>
                  </template>
                </a-table>
              </a-space>

              <a-empty v-else>{{ t('dev.dict.item.tree.null') }}</a-empty>
            </a-card>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-card>

    <!-- 保存字典表单 -->
    <a-modal
      v-model:visible="dictSaveModalVisible"
      :title="
        (dictSaveId ? $t('common.action.update') : $t('common.action.add')) +
        $t('dev.dict')
      "
      title-align="start"
      width="auto"
      draggable
      :ok-loading="dictSaveSubmitLoading"
      :on-before-ok="dictSaveBeforeOk"
      @ok="dictSaveOk"
      @cancel="dictSaveCancel"
    >
      <a-spin :loading="dictSaveFormLoading" :tip="$t('common.loading.info')">
        <a-form
          ref="dictSaveFormRef"
          :model="dictSaveFormModel"
          :rules="dictSaveFormRules"
          :style="{ width: '600px' }"
        >
          <a-form-item
            field="dictName"
            :label="$t('dev.dict.dictName')"
            :tooltip="$t('dev.dict.dictName') + $t('common.info.cannot.repeat')"
            :validate-status="dictSaveDictNameValidateStatus"
            :validate-trigger="['blur']"
            feedback
          >
            <a-input
              v-model="dictSaveFormModel.dictName"
              :placeholder="$t('common.placeholder.input')"
              allow-clear
            />
          </a-form-item>

          <a-form-item
            field="dictKey"
            :label="$t('dev.dict.dictKey')"
            :tooltip="$t('dev.dict.dictKey') + $t('common.info.cannot.repeat')"
            :validate-status="dictSaveDictKeyValidateStatus"
            :validate-trigger="['blur']"
            feedback
          >
            <a-input
              v-model="dictSaveFormModel.dictKey"
              :placeholder="$t('common.placeholder.input')"
              allow-clear
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!-- 保存字典项表单 -->
    <a-modal
      v-model:visible="dictItemSaveModalVisible"
      :title="
        (dictItemSaveId
          ? $t('common.action.update')
          : $t('common.action.add')) + $t('dev.dict.item')
      "
      title-align="start"
      width="auto"
      draggable
      :ok-loading="dictItemSaveSubmitLoading"
      :on-before-ok="dictItemSaveBeforeOk"
      @ok="dictItemSaveOk"
      @cancel="dictItemSaveCancel"
    >
      <a-spin
        :loading="dictItemSaveFormLoading"
        :tip="$t('common.loading.info')"
      >
        <a-form
          ref="dictItemSaveFormRef"
          :model="dictItemSaveFormModel"
          :rules="dictItemSaveFormRules"
          :style="{ width: '600px' }"
        >
          <a-form-item
            field="label"
            :label="$t('dev.dict.item.label')"
            :tooltip="
              $t('dev.dict.item.label') + $t('common.info.cannot.repeat')
            "
            :validate-status="dictItemSaveLabelValidateStatus"
            :validate-trigger="['blur']"
            feedback
          >
            <a-input
              v-model="dictItemSaveFormModel.label"
              :placeholder="$t('common.placeholder.input')"
              allow-clear
            />
          </a-form-item>

          <a-form-item
            field="value"
            :label="$t('dev.dict.item.value')"
            :tooltip="
              $t('dev.dict.item.value') + $t('common.info.cannot.repeat')
            "
            :validate-status="dictItemSaveValueValidateStatus"
            :validate-trigger="['blur']"
            feedback
          >
            <a-input
              v-model="dictItemSaveFormModel.value"
              :placeholder="$t('common.placeholder.input')"
              allow-clear
            />
          </a-form-item>

          <a-form-item field="parentId" :label="$t('dev.dict.item.parent')">
            <a-cascader
              v-model="dictItemSaveFormModel.parentId"
              :options="dictItemCascaderOptions"
              :loading="dictItemSaveParentIdLoading"
              :placeholder="$t('common.placeholder.select')"
              check-strictly
              allow-clear
              allow-search
            />
          </a-form-item>

          <a-form-item
            field="sortOrder"
            :label="$t('dev.dict.item.sortOrder')"
            :tooltip="$t('dev.dict.item.sortOrder.tooltip')"
            feedback
          >
            <a-input-number
              v-model="dictItemSaveFormModel.sortOrder"
              :placeholder="$t('common.placeholder.input')"
              :precision="0"
              :min="1"
              allow-clear
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import type { CascaderOption } from '@arco-design/web-vue/es/cascader';
  import { apiErrorRMsg } from '@/global/body';
  import { JTableColumn } from '@/global/j';
  import {
    DictResponseBody,
    DictSaveRequestBody,
    DictItemTreeResponseBody,
    DictItemSaveRequestBody,
    dictListApi,
    dictInfoApi,
    dictVerifyNameApi,
    dictVerifyKeyApi,
    dictAddApi,
    dictUpdateApi,
    dictDeleteApi,
    dictRefreshCacheApi,
    dictItemTreeApi,
    dictItemCascaderApi,
    dictItemInfoApi,
    dictItemVerifyLabelApi,
    dictItemVerifyValueApi,
    dictItemAddApi,
    dictItemUpdateApi,
    dictItemDeleteApi,
  } from '@/api/request/dict';

  const { t } = useI18n();

  // =========== 搜索开始 ===========
  const dictListPattern = ref<string>('');

  const dictListLoading = ref(false);

  const dictListData = ref<DictResponseBody[]>([]);

  const dictListRequest = async () => {
    dictListLoading.value = true;
    try {
      const { data } = await dictListApi({ value: dictListPattern.value });
      dictListData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      dictListLoading.value = false;
    }
  };
  // =========== 搜索结束 ===========

  // =========== 刷新缓存开始 ===========
  const dictRefreshCacheLoading = ref(false);

  const dictRefreshCacheRequest = async () => {
    if (dictRefreshCacheLoading.value) {
      return;
    }
    dictRefreshCacheLoading.value = true;
    try {
      await dictRefreshCacheApi();
      Message.success(t('common.success.refresh'));
    } catch (err) {
      // catch
    } finally {
      dictRefreshCacheLoading.value = false;
    }
  };
  // =========== 刷新缓存结束 ===========

  // =========== 保存字典开始 ===========
  const dictSaveId = ref<number | undefined>();

  // 是否显示保存字典表单
  const dictSaveModalVisible = ref(false);
  // 保存字典表单加载
  const dictSaveFormLoading = ref(false);
  // 保存字典按钮加载
  const dictSaveSubmitLoading = ref(false);
  // 保存字典ref
  const dictSaveFormRef = ref<FormInstance>();
  // 保存字典名称校验
  const dictSaveDictNameValidateStatus = ref();
  // 保存字典标识校验
  const dictSaveDictKeyValidateStatus = ref();

  // 保存表单规则
  const dictSaveFormRules = {
    dictName: [
      {
        required: true,
        message: t('dev.dict.dictName') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg: string) => void
        ) => {
          return new Promise((resolve) => {
            dictSaveDictNameValidateStatus.value = 'validating';
            dictVerifyNameApi({
              id: dictSaveId.value,
              value,
            })
              .then((res) => {
                dictSaveDictNameValidateStatus.value = 'success';
                resolve('');
              })
              .catch((err) => {
                callback(apiErrorRMsg(err));
                dictSaveDictNameValidateStatus.value = 'error';
                resolve('');
              });
          });
        },
      },
    ],
    dictKey: [
      {
        required: true,
        message: t('dev.dict.dictKey') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg: string) => void
        ) => {
          return new Promise((resolve) => {
            dictSaveDictKeyValidateStatus.value = 'validating';
            dictVerifyKeyApi({
              id: dictSaveId.value,
              value,
            })
              .then((res) => {
                dictSaveDictKeyValidateStatus.value = 'success';
                resolve('');
              })
              .catch((err) => {
                callback(apiErrorRMsg(err));
                dictSaveDictKeyValidateStatus.value = 'error';
                resolve('');
              });
          });
        },
      },
    ],
  };

  const dictSaveFormModelDefault = (): DictSaveRequestBody => {
    return {
      dictName: '',
      dictKey: '',
    };
  };

  // 保存字典表单
  const dictSaveFormModel = ref<DictSaveRequestBody>(
    dictSaveFormModelDefault()
  );

  const dictSaveModalShow = (id?: number) => {
    dictSaveId.value = id;
    dictSaveModalVisible.value = true;
    dictInfoRequest();
  };

  /**
   * 编辑初始化查询
   */
  const dictInfoRequest = async () => {
    if (!dictSaveId.value) {
      return;
    }
    dictSaveFormLoading.value = true;
    try {
      const { data } = await dictInfoApi(dictSaveId.value);
      dictSaveFormModel.value = {
        dictName: data.dictName,
        dictKey: data.dictKey,
      };
    } catch (err) {
      // catch
    } finally {
      dictSaveFormLoading.value = false;
    }
  };

  const dictSaveBeforeOk = async () => {
    if (dictSaveSubmitLoading.value) {
      return false;
    }
    const res = await dictSaveFormRef.value?.validate();
    if (res) {
      return false;
    }
    dictSaveSubmitLoading.value = true;
    try {
      if (dictSaveId.value) {
        await dictUpdateApi(dictSaveId.value, dictSaveFormModel.value);
        Message.success(t('common.success.update'));
      } else {
        await dictAddApi(dictSaveFormModel.value);
        Message.success(t('common.success.add'));
      }
      return true;
    } catch (err) {
      return false;
    } finally {
      dictSaveSubmitLoading.value = false;
    }
  };

  const dictSaveOk = () => {
    dictSaveFormModel.value = dictSaveFormModelDefault();
    dictSaveDictNameValidateStatus.value = undefined;
    dictSaveDictKeyValidateStatus.value = undefined;
  };

  const dictSaveCancel = () => {
    dictSaveModalVisible.value = false;
    dictSaveFormRef.value?.resetFields();
    dictSaveDictNameValidateStatus.value = undefined;
    dictSaveDictKeyValidateStatus.value = undefined;
  };

  // =========== 保存字典结束 ===========

  // =========== 删除字典开始 ===========
  // 删除按钮加载
  const dictDeleteLoading = ref(false);
  // 删除ID
  const dictDeleteId = ref<number>();

  const dictDeleteShow = (record: DictResponseBody) => {
    dictDeleteId.value = record.id;
  };

  const dictDeleteCancel = () => {
    dictDeleteId.value = undefined;
  };

  const dictDeleteBeforeOk = async () => {
    if (dictDeleteLoading.value) {
      return false;
    }
    dictDeleteLoading.value = true;
    try {
      await dictDeleteApi(dictDeleteId.value);
      Message.success(t('common.success.delete'));
      dictDeleteId.value = undefined;
      if (dictCurrent.value?.id === dictDeleteId.value) {
        dictCurrent.value = undefined;
      }
      return true;
    } catch (err) {
      return false;
    } finally {
      dictDeleteLoading.value = false;
    }
  };

  // =========== 删除字典结束 ===========

  // =========== 字典项列表开始 ===========
  const dictCurrent = ref<DictResponseBody>();

  const dictItemTableLoading = ref(false);

  // 列名
  const dictItemTableColumns = ref<JTableColumn[]>([
    {
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      slotType: '#',
      width: 65,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.dict.dictName'),
      dataIndex: 'dictName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.dict.dictKey'),
      dataIndex: 'dictKey',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.dict.item.label'),
      dataIndex: 'label',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.dict.item.value'),
      dataIndex: 'value',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('dev.dict.item.sortOrder'),
      dataIndex: 'sortOrder',
      titleSlotName: 'sortOrder',
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

  const dictItemTableData = ref<DictItemTreeResponseBody[]>([]);

  const dictItemTableLoad = async (dict: DictResponseBody) => {
    dictCurrent.value = dict;
    await dictItemTreeRequest();
  };

  const dictItemTreeRequest = async () => {
    dictItemTableLoading.value = true;
    try {
      const { data } = await dictItemTreeApi(dictCurrent.value?.id);
      dictItemTableData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      dictItemTableLoading.value = false;
    }
  };

  // =========== 字典项列表结束 ===========

  // =========== 保存字典项开始 ===========
  const dictItemSaveId = ref<number | undefined>();

  const dictItemCascaderOptions = ref<CascaderOption[]>();

  // 是否显示保存字典表单
  const dictItemSaveModalVisible = ref(false);
  // 保存字典表单加载
  const dictItemSaveFormLoading = ref(false);
  // 保存字典按钮加载
  const dictItemSaveSubmitLoading = ref(false);
  // 保存字典父选项加载
  const dictItemSaveParentIdLoading = ref(false);
  // 保存字典ref
  const dictItemSaveFormRef = ref<FormInstance>();
  // 保存展示名校验
  const dictItemSaveLabelValidateStatus = ref();
  // 保存值校验
  const dictItemSaveValueValidateStatus = ref();

  // 保存表单规则
  const dictItemSaveFormRules = {
    label: [
      {
        required: true,
        message: t('dev.dict.item.label') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg: string) => void
        ) => {
          return new Promise((resolve) => {
            dictItemSaveLabelValidateStatus.value = 'validating';
            dictItemVerifyLabelApi(dictCurrent.value?.id, {
              id: dictItemSaveId.value,
              value,
            })
              .then((res) => {
                dictItemSaveLabelValidateStatus.value = 'success';
                resolve('');
              })
              .catch((err) => {
                callback(apiErrorRMsg(err));
                dictItemSaveLabelValidateStatus.value = 'error';
                resolve('');
              });
          });
        },
      },
    ],
    value: [
      {
        required: true,
        message: t('dev.dict.item.value') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg: string) => void
        ) => {
          return new Promise((resolve) => {
            dictItemSaveValueValidateStatus.value = 'validating';
            dictItemVerifyValueApi(dictCurrent.value?.id, {
              id: dictItemSaveId.value,
              value,
            })
              .then((res) => {
                dictItemSaveValueValidateStatus.value = 'success';
                resolve('');
              })
              .catch((err) => {
                callback(apiErrorRMsg(err));
                dictItemSaveValueValidateStatus.value = 'error';
                resolve('');
              });
          });
        },
      },
    ],
    sortOrder: [
      {
        required: true,
        message: t('dev.dict.item.sortOrder') + t('common.required.enter'),
      },
    ],
  };

  const dictItemSaveFormModelDefault = (): DictItemSaveRequestBody => {
    return {
      label: '',
      value: '',
      sortOrder: 1,
    };
  };

  // 保存字典表单
  const dictItemSaveFormModel = ref<DictItemSaveRequestBody>(
    dictItemSaveFormModelDefault()
  );

  const dictItemSaveModalShow = (id?: number) => {
    dictItemSaveId.value = id;
    dictItemSaveModalVisible.value = true;
    dictItemInfoRequest();
    dictItemCascaderRequest();
  };

  /**
   * 编辑初始化查询
   */
  const dictItemInfoRequest = async () => {
    if (!dictItemSaveId.value) {
      return;
    }
    dictItemSaveFormLoading.value = true;
    try {
      const { data } = await dictItemInfoApi(dictItemSaveId.value);
      dictItemSaveFormModel.value = {
        parentId: data.parentId,
        label: data.label,
        value: data.value,
        sortOrder: data.sortOrder,
      };
    } catch (err) {
      // catch
    } finally {
      dictItemSaveFormLoading.value = false;
    }
  };

  const dictItemCascaderRequest = async () => {
    dictItemSaveParentIdLoading.value = true;
    try {
      const { data } = await dictItemCascaderApi(dictCurrent.value?.id);
      dictItemCascaderDisabled(data);
      dictItemCascaderOptions.value = data;
    } catch (err) {
      // catch
    } finally {
      dictItemSaveParentIdLoading.value = false;
    }
  };

  const dictItemCascaderDisabled = (options: CascaderOption[]) => {
    if (!options) {
      return;
    }
    options.forEach((option) => {
      if (dictItemSaveId.value && option?.value === dictItemSaveId.value) {
        option.disabled = true;
      }
      if (option.children) {
        dictItemCascaderDisabled(option.children);
      }
    });
  };

  const dictItemSaveBeforeOk = async () => {
    if (dictItemSaveSubmitLoading.value) {
      return false;
    }
    const res = await dictItemSaveFormRef.value?.validate();
    if (res) {
      return false;
    }
    dictItemSaveSubmitLoading.value = true;
    try {
      if (dictItemSaveId.value) {
        await dictItemUpdateApi(
          dictItemSaveId.value,
          dictItemSaveFormModel.value
        );
        Message.success(t('common.success.update'));
      } else {
        await dictItemAddApi(
          dictCurrent.value?.id,
          dictItemSaveFormModel.value
        );
        Message.success(t('common.success.add'));
      }
      return true;
    } catch (err) {
      return false;
    } finally {
      dictItemSaveSubmitLoading.value = false;
    }
  };

  const dictItemSaveOk = () => {
    dictItemSaveFormModel.value = dictItemSaveFormModelDefault();
    dictItemSaveLabelValidateStatus.value = undefined;
    dictItemSaveValueValidateStatus.value = undefined;
    dictItemTreeRequest();
  };

  const dictItemSaveCancel = () => {
    dictItemSaveModalVisible.value = false;
    dictItemSaveFormRef.value?.resetFields();
    dictItemSaveLabelValidateStatus.value = undefined;
    dictItemSaveValueValidateStatus.value = undefined;
  };

  // =========== 保存字典项结束 ===========

  // =========== 删除字典项开始 ===========
  // 删除按钮加载
  const dictItemDeleteLoading = ref(false);
  // 删除ID
  const dictItemDeleteId = ref<number>();

  const dictItemDeleteShow = (record: DictItemTreeResponseBody) => {
    dictItemDeleteId.value = record.id;
  };

  const dictItemDeleteCancel = () => {
    dictItemDeleteId.value = undefined;
  };

  const dictItemDeleteBeforeOk = async () => {
    if (dictItemDeleteLoading.value) {
      return false;
    }
    dictItemDeleteLoading.value = true;
    try {
      await dictItemDeleteApi(dictItemDeleteId.value);
      dictItemDeleteId.value = undefined;
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      dictItemDeleteLoading.value = false;
    }
  };

  // =========== 删除字典项结束 ===========

  onMounted(() => {
    dictListRequest();
  });
</script>

<script lang="ts">
  export default {
    name: 'Dict',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .layout-height {
    height: calc(100vh - 280px);
  }
</style>
