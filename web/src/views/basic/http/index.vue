<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.basic.http')">
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
            <a-form-item field="httpUrl" :label="$t('basic.http.httpUrl')">
              <a-input
                v-model="formModel.httpUrl"
                :placeholder="$t('common.placeholder.input')"
                allow-clear
                show-word-limit
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="count" :label="$t('basic.http.count')">
              <a-input-number
                v-model="formModel.count"
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
  import { computed, ref, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import useLoading from '@/hooks/loading';
  import {
    httpSendApi,
    httpLogApi,
    HttpSendRequestBody,
    HttpResponseBody,
  } from '@/api/request/http';
  import { snowIdApi } from '@/api/request/common';
  import { keyDeleteApi } from '@/api/request/redis';

  const { t } = useI18n();

  const { loading, setLoading } = useLoading();

  const logClearLoading = ref<boolean>(false);

  const idRefreshSpin = ref<boolean>(false);

  const formRef = ref<FormInstance>();

  interface FormModel {
    id: string;
    httpUrl: string;
    count: number;
    percent: number;
  }

  const formModel = ref<FormModel>({
    id: '',
    httpUrl: 'https://icanhazip.com/',
    count: 5,
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
    httpUrl: [
      {
        required: true,
        message: t('basic.http.httpUrl') + t('common.required.enter'),
      },
    ],
    count: [
      {
        required: true,
        message: t('basic.http.count') + t('common.required.enter'),
      },
    ],
  };

  let timer: any = null;

  // 缓存key
  const logKey = ref<string>('');

  // 是否自动刷新
  const logAutoRefresh = ref<boolean>(true);

  // 列表数据
  const logData = ref<HttpResponseBody[]>([]);

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
      title: t('basic.http.threadName'),
      dataIndex: 'threadName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.http.sendResult'),
      dataIndex: 'sendResult',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('basic.http.sendDateTime'),
      dataIndex: 'sendDateTime',
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
        await httpSendApi(id, params as HttpSendRequestBody);
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

  /**
   * 列表查询
   */
  const logDataRequest = async () => {
    try {
      const { data } = await httpLogApi(formModel.value.id);
      logData.value = data.infos;
      logKey.value = data.key;
      formModel.value.percent = data.infos.length / formModel.value.count;
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
</script>

<script lang="ts">
  export default {
    name: 'Http',
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
