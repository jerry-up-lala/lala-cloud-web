<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.ware.mq')">
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
            <a-form-item field="info" :label="$t('ware.mq.info')">
              <a-textarea
                v-model="formModel.info"
                :max-length="200"
                show-word-limit
                allow-clear
                :placeholder="$t('common.placeholder.input')"
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
    mqSendApi,
    mqLogApi,
    MqRequestBody,
    MqResponseBody,
  } from '@/api/request/mq';
  import { snowIdApi } from '@/api/request/common';
  import { keyDeleteApi } from '@/api/request/redis';

  const { t } = useI18n();

  const { loading, setLoading } = useLoading();

  const logClearLoading = ref<boolean>(false);

  const idRefreshSpin = ref<boolean>(false);

  const formRef = ref<FormInstance>();

  interface FormModel {
    id: string;
    info: string;
  }

  const formModel = ref<FormModel>({
    id: '',
    info: '消息内容',
  });

  const saveRules = {
    id: [
      {
        required: true,
        message: t('common.log.id') + t('common.required.enter'),
      },
    ],
    info: [
      {
        required: true,
        message: t('ware.mq.info') + t('common.required.enter'),
      },
    ],
  };

  let timer: any = null;

  // 是否自动刷新
  const logAutoRefresh = ref<boolean>(true);

  // 缓存key
  const logKey = ref<string>('');

  // 列表数据
  const logData = ref<MqResponseBody[]>([]);

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
      title: t('ware.mq.consumerThreadName'),
      dataIndex: 'consumerThreadName',
      slotName: 'consumerThreadName',
      width: 375,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('ware.mq.info'),
      dataIndex: 'info',
      slotName: 'info',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('ware.mq.producerDateTime'),
      dataIndex: 'producerDateTime',
      slotName: 'producerDateTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('ware.mq.consumerDateTime'),
      dataIndex: 'consumerDateTime',
      slotName: 'consumerDateTime',
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
        const { id, ...params } = values;
        await mqSendApi(id, params as MqRequestBody);
        Message.success(t('common.success.operation'));
        logDataRequest();
      } catch (err) {
        // err
      } finally {
        setLoading(false);
      }
    }
  };

  const formModelReset = async () => {
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
      const { data } = await mqLogApi(formModel.value.id);
      logData.value = data.infos;
      logKey.value = data.key;
      if (logAutoRefresh.value) {
        timer = setTimeout(() => {
          logDataRequest();
        }, 500);
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
    name: 'Mq',
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
