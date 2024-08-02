<template>
  <a-card
    class="general-card"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '17px 20px 21px 20px' }"
  >
    <template #title>
      {{ $t('workplace.apiName') }}
    </template>
    <a-table
      :data="dataList"
      :loading="loading"
      :pagination="false"
      :bordered="false"
      stripe
      column-resizable
      table-layout-fixed
      :scroll="{ x: '100%', y: '264px' }"
    >
      <template #columns>
        <a-table-column title="#" :width="65">
          <template #cell="{ rowIndex }">
            {{ rowIndex + 1 }}
          </template>
        </a-table-column>
        <a-table-column
          :title="$t('workplace.apiName.apiName')"
          data-index="apiName"
        ></a-table-column>
        <a-table-column
          :title="$t('workplace.request')"
          data-index="count"
        ></a-table-column>
        <a-table-column
          :title="$t('workplace.apiName.maxRequestTime')"
          data-index="maxRequestTime"
          :width="200"
        ></a-table-column>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import { workplaceLogApiNameApi } from '@/api/request/workplace';
  import type { TableData } from '@arco-design/web-vue/es/table/interface';

  const { loading, setLoading } = useLoading();

  const dataList = ref<TableData[]>();

  const workplaceLogApiNameRequest = async () => {
    try {
      setLoading(true);
      const { data } = await workplaceLogApiNameApi();
      dataList.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  workplaceLogApiNameRequest();
</script>

<script lang="ts">
  export default {
    name: 'WorkplaceApiName',
  };
</script>

<style scoped lang="less">
  .general-card {
    min-height: 320px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
</style>
