<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item :span="24">
      <a-spin
        :loading="loading"
        style="width: 100%; height: 485px"
        :tip="$t('common.loading.info')"
      >
        <a-card
          class="general-card"
          :header-style="{ paddingBottom: 0 }"
          :body-style="{
            paddingTop: '15px',
          }"
          :title="$t('workplace.logSum')"
        >
          <div id="logSum"></div>
        </a-card>
      </a-spin>
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { DualAxes } from '@antv/g2plot';
  import useLoading from '@/hooks/loading';
  import { workplaceLogSumApi } from '@/api/request/workplace';

  const { t } = useI18n();

  const { loading, setLoading } = useLoading();

  const workplaceLogSumRequest = async () => {
    try {
      setLoading(true);
      const { data } = await workplaceLogSumApi();
      if (data?.data) {
        data?.data.forEach((item: any) => {
          item.name =
            item.name === '1'
              ? t('workplace.logSum.request.success')
              : t('workplace.logSum.request.error');
        });
      }

      new DualAxes('logSum', {
        data: [data?.column, data?.data],
        xField: 'x',
        yField: ['y', 'y'],
        geometryOptions: [
          {
            geometry: 'column',
            columnWidthRatio: 0.2,
          },
          {
            geometry: 'line',
            seriesField: 'name',
            smooth: true,
          },
        ],
        meta: {
          y: {
            alias: t('workplace.request'),
          },
        },
      }).render();
    } catch (err) {
      // catch
    } finally {
      setLoading(false);
    }
  };

  workplaceLogSumRequest();
</script>

<script lang="ts">
  export default {
    name: 'WorkplaceLogSum',
  };
</script>

<style scoped lang="less"></style>
