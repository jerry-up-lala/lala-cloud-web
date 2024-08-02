<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.basic.concurrent')">
      <a-form
        ref="formRef"
        :model="formModel"
        :rules="saveRules"
        @submit="formSubmit"
      >
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="id"
              :label="$t('common.log.id')"
              :extra="$t('common.log.extra') + 'Redis:Log:' + formModel.id"
            >
              <a-input
                v-model="formModel.id"
                :placeholder="$t('common.placeholder.input')"
                allow-clear
                show-word-limit
              >
                <template #suffix>
                  <a-button @click="handleRefreshId">
                    <icon-refresh :spin="idRefreshSpin" />
                  </a-button>
                </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="corePoolSize"
              :label="$t('basic.concurrent.corePoolSize')"
            >
              <a-input-number
                v-model="formModel.corePoolSize"
                :placeholder="$t('common.placeholder.input')"
                :precision="0"
                :min="1"
                :max="50"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="maximumPoolSize"
              :label="$t('basic.concurrent.maximumPoolSize')"
            >
              <a-input-number
                v-model="formModel.maximumPoolSize"
                :placeholder="$t('common.placeholder.input')"
                :precision="0"
                :min="1"
                :max="50"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="keepAliveTime"
              :label="$t('basic.concurrent.keepAliveTime')"
              label-col-flex="200px"
            >
              <a-input-number
                v-model="formModel.keepAliveTime"
                :placeholder="$t('common.placeholder.input')"
                :precision="0"
                :min="1"
                :max="100000"
                allow-clear
              >
                <template #suffix>
                  {{ $t('common.unit.millisecond') }}
                </template></a-input-number
              >
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="workQueueType"
              :label="$t('basic.concurrent.workQueueType')"
            >
              <a-select
                v-model="formModel.workQueueType"
                :options="workQueueTypeOptions"
                :placeholder="$t('common.placeholder.select')"
                allow-clear
                allow-search
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="workQueueSize"
              :label="$t('basic.concurrent.workQueueSize')"
            >
              <a-input-number
                v-model="formModel.workQueueSize"
                :placeholder="$t('common.placeholder.input')"
                :precision="0"
                :min="0"
                :max="50"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="rejectedExecutionType"
              :label="$t('basic.concurrent.rejectedExecutionType')"
            >
              <a-select
                v-model="formModel.rejectedExecutionType"
                :options="rejectedExecutionTypeOptions"
                :placeholder="$t('common.placeholder.select')"
                allow-clear
                allow-search
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              field="runTotal"
              :label="$t('basic.concurrent.runTotal')"
            >
              <a-input-number
                v-model="formModel.runTotal"
                :placeholder="$t('common.placeholder.input')"
                :precision="0"
                :min="1"
                :max="200"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="percent" :label="$t('common.progress')">
              <a-progress
                :percent="formModel.percent"
                animation
                :color="{
                  '0%': 'rgb(var(--primary-6))',
                  '100%': 'rgb(var(--success-6))',
                }"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">{{
              $t('common.action.send')
            }}</a-button>
            <a-button @click="formModelReset">{{
              $t('common.action.reset')
            }}</a-button>
            <a-button
              status="danger"
              :loading="logClearLoading"
              @click="handleLogClear"
              >{{ $t('common.action.clear.log') }}</a-button
            >
          </a-space>
        </a-form-item>
      </a-form>

      <a-card
        hoverable
        :bordered="false"
        :title="$t('common.log.extra') + logKey"
      >
        <template #extra>
          <a-switch
            v-model="logAutoRefresh"
            :checked-text="$t('common.auto.refresh.open')"
            :unchecked-text="$t('common.auto.refresh.close')"
            @change="handleLogAutoRefreshChange"
          />
        </template>

        <a-table
          :columns="logColumns"
          :data="logData"
          stripe
          column-resizable
          table-layout-fixed
          :bordered="{ cell: true }"
          :pagination="false"
        >
          <template #index="{ rowIndex }">
            {{ rowIndex + 1 }}
          </template>
        </a-table>
      </a-card>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import useLoading from '@/hooks/loading';
  import {
    workQueueTypeList,
    rejectedExecutionTypeList,
  } from '@/data/concurrent';
  import {
    concurrentRunApi,
    concurrentLogApi,
    ConcurrentRequestBody,
    ConcurrentResponseBody,
  } from '@/api/request/concurrent';
  import { snowIdApi } from '@/api/request/common';
  import { keyDeleteApi } from '@/api/request/redis';

  const { t } = useI18n();

  const { loading, setLoading } = useLoading();

  const workQueueTypeOptions = computed<SelectOptionData[]>(() =>
    workQueueTypeList(t)
  );

  const rejectedExecutionTypeOptions = computed<SelectOptionData[]>(() =>
    rejectedExecutionTypeList(t)
  );

  const logClearLoading = ref<boolean>(false);

  const idRefreshSpin = ref<boolean>(false);

  const formRef = ref<FormInstance>();

  interface FormModel {
    id: string;
    corePoolSize: number;
    maximumPoolSize: number;
    keepAliveTime: number;
    workQueueType: number;
    workQueueSize: number;
    rejectedExecutionType: number;
    runTotal: number;
    percent: number;
  }

  const formModel = ref<FormModel>({
    id: '',
    corePoolSize: 5,
    maximumPoolSize: 10,
    keepAliveTime: 5000,
    workQueueType: 1,
    workQueueSize: 5,
    rejectedExecutionType: 1,
    runTotal: 20,
    percent: 0,
  });

  // 保存表单规则
  const saveRules = {
    id: [
      {
        required: true,
        message: t('common.log.id') + t('common.required.enter'),
      },
    ],
    corePoolSize: [
      {
        required: true,
        message:
          t('basic.concurrent.corePoolSize') + t('common.required.enter'),
      },
    ],
    maximumPoolSize: [
      {
        required: true,
        message:
          t('basic.concurrent.maximumPoolSize') + t('common.required.enter'),
      },
    ],
    keepAliveTime: [
      {
        required: true,
        message:
          t('basic.concurrent.keepAliveTime') + t('common.required.enter'),
      },
    ],
    workQueueType: [
      {
        required: true,
        message:
          t('basic.concurrent.workQueueType') + t('common.required.select'),
      },
    ],
    workQueueSize: [
      {
        required: true,
        message:
          t('basic.concurrent.workQueueSize') + t('common.required.enter'),
      },
    ],
    rejectedExecutionType: [
      {
        required: true,
        message:
          t('basic.concurrent.rejectedExecutionType') +
          t('common.required.select'),
      },
    ],
    runTotal: [
      {
        required: true,
        message: t('basic.concurrent.runTotal') + t('common.required.enter'),
      },
    ],
  };

  let timer: any = null;

  // 是否自动刷新
  const logAutoRefresh = ref<boolean>(true);

  // 缓存key
  const logKey = ref<string>('');

  // 列表数据
  const logData = ref<ConcurrentResponseBody[]>([]);

  // 列名
  const logColumns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      width: 65,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.concurrent.threadName'),
      dataIndex: 'threadName',
      width: 385,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.concurrent.runDateTime'),
      dataIndex: 'runDateTime',
      ellipsis: true,
      tooltip: true,
    },
  ]);

  const handleRefreshId = async () => {
    if (idRefreshSpin.value) return;
    idRefreshSpin.value = true;
    try {
      const { data } = await snowIdApi();
      formModel.value.id = data;
    } catch (err) {
      // err
    } finally {
      idRefreshSpin.value = false;
    }
  };

  const formSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        const { id, percent, ...params } = values;
        await concurrentRunApi(id, params as ConcurrentRequestBody);
        Message.success(t('common.success.operation'));
        logDataRequest();
      } catch (err) {
        // err
      } finally {
        setLoading(false);
      }
    }
  };

  const formModelReset = () => {
    formRef.value?.resetFields();
    logData.value = [];
    if (timer) {
      clearTimeout(timer);
    }
    handleRefreshId();
  };

  const handleLogClear = async () => {
    if (logClearLoading.value) return;
    logClearLoading.value = true;
    try {
      await keyDeleteApi(logKey.value);
      logData.value = [];
      Message.success(t('common.success.clear'));
    } catch (err) {
      // err
    } finally {
      logClearLoading.value = false;
    }
  };

  const handleLogAutoRefreshChange = (value: string | number | boolean) => {
    if (value) {
      logDataRequest();
    } else if (timer) {
      clearTimeout(timer);
    }
  };

  const logDataRequest = async () => {
    try {
      const { data } = await concurrentLogApi(formModel.value.id);
      logData.value = data.infos;
      logKey.value = data.key;
      formModel.value.percent = data.infos.length / formModel.value.runTotal;
      if (logAutoRefresh.value && formModel.value.percent < 100) {
        timer = setTimeout(() => {
          logDataRequest();
        }, 300);
      } else if (timer) {
        clearTimeout(timer);
      }
    } catch (err) {
      // err
    } finally {
      // finally
    }
  };

  onMounted(() => {
    if (timer) {
      clearTimeout(timer);
    }
    handleRefreshId();
  });

  onUnmounted(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });

  watch(
    () => formModel.value.workQueueType,
    (newValue, oldValue) => {
      if (
        !workQueueTypeList(t).find((item) => item?.value === newValue)
          ?.sizeRequired
      ) {
        formModel.value.workQueueSize = 0;
      }
    }
  );
</script>

<script lang="ts">
  export default {
    name: 'Concurrent',
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
</style>
