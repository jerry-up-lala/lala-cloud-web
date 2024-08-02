<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar
          :size="54"
          class="col-avatar"
          trigger-type="mask"
          @click="menuAction"
        >
          <icon-font type="icon-quanbu" :size="35" />
          <template #trigger-icon>
            <icon-link />
          </template>
        </a-avatar>
        <a-statistic
          :title="$t('workplace.statistic.menu')"
          :value="statisticData.menu"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('workplace.statistic.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar
          :size="54"
          class="col-avatar"
          trigger-type="mask"
          @click="apiCountAction"
        >
          <icon-font type="icon-hezu" :size="35" />
          <template #trigger-icon>
            <icon-link />
          </template>
        </a-avatar>
        <a-statistic
          :title="$t('workplace.statistic.apiCount')"
          :value="statisticData.apiCount"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('workplace.statistic.pecs') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
    >
      <a-space>
        <a-avatar
          :size="54"
          class="col-avatar"
          trigger-type="mask"
          @click="requestAction"
        >
          <icon-font type="icon-guojishiye" :size="35" />
          <template #trigger-icon>
            <icon-link />
          </template>
        </a-avatar>
        <a-statistic
          :title="$t('workplace.request')"
          :value="statisticData.request"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">{{ $t('workplace.statistic.times') }}</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item
      class="panel-col"
      :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12, xxl: 6 }"
      style="border-right: none"
    >
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <icon-font type="icon-qushi" :size="35" />
        </a-avatar>
        <a-statistic
          :title="$t('workplace.statistic.requestQoq')"
          :value="statisticData.requestQoq ? statisticData.requestQoq : 0"
          :precision="2"
          :value-from="0"
          animation
        >
          <template #suffix>
            %
            <icon-caret-up
              v-if="statisticData.requestQoq > 0"
              class="up-icon"
            />
            <icon-caret-down
              v-else-if="statisticData.requestQoq < 0"
              class="down-icon"
            />
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import useRouter from '@/hooks/router';
  import { openWindow, regexUrl } from '@/utils/url';
  import {
    workplaceStatisticApi,
    WorkplaceStatisticResponseBody,
  } from '@/api/request/workplace';

  const { router } = useRouter();

  const statisticDataDefault = (): WorkplaceStatisticResponseBody => {
    return {
      menu: 0,
      apiCount: 0,
      apiDoc: '',
      request: 0,
      requestQoq: 0,
    };
  };

  const statisticData = ref<WorkplaceStatisticResponseBody>(
    statisticDataDefault()
  );

  const statisticDataRequest = async () => {
    try {
      const { data } = await workplaceStatisticApi();
      statisticData.value = data;
    } catch (err) {
      // catch
    } finally {
      // finally
    }
  };

  const menuAction = () => {
    router.push({
      name: 'SystemMenu',
    });
  };

  const apiCountAction = () => {
    if (regexUrl.test(statisticData.value.apiDoc)) {
      openWindow(statisticData.value.apiDoc);
    }
  };

  const requestAction = () => {
    router.push({
      name: 'LogRequest',
    });
  };

  onMounted(() => {
    statisticDataRequest();
  });
</script>

<script lang="ts">
  export default {
    name: 'WorkplaceStatistic',
  };
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }
  .panel-col {
    padding-left: 43px;
    border-right: 1px solid rgb(var(--gray-2));
  }
  .col-avatar {
    margin-right: 12px;
    background-color: var(--color-fill-2);
  }
  .up-icon {
    color: rgb(var(--red-6));
  }
  .down-icon {
    color: rgb(var(--green-6));
  }
  .unit {
    margin-left: 8px;
    color: rgb(var(--gray-8));
    font-size: 12px;
  }
  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
</style>
