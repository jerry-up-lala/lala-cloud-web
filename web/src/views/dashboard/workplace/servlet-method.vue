<template>
  <a-spin
    :loading="loading"
    style="width: 100%"
    :tip="$t('common.loading.info')"
  >
    <a-card
      class="general-card"
      :title="$t('workplace.servletMethod')"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{ padding: '15px 20px 13px 20px' }"
      style="height: 166px"
    >
      <div id="servletMethod"></div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { Pie } from '@antv/g2plot';
  import useLoading from '@/hooks/loading';
  import { workplaceLogServletMethodApi } from '@/api/request/workplace';

  const { loading, setLoading } = useLoading();

  const workplaceLogServletMethodRequest = async () => {
    try {
      setLoading(true);
      const { data } = await workplaceLogServletMethodApi();
      new Pie('servletMethod', {
        data,
        radius: 1,
        innerRadius: 0.64,
        label: {
          type: 'inner',
          offset: '-50%',
          autoRotate: false,
          style: { textAlign: 'center' },
          formatter: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
        },
        angleField: 'value',
        colorField: 'type',
        interactions: [
          { type: 'element-selected' },
          { type: 'element-active' },
          {
            type: 'pie-statistic-active',
            cfg: {
              start: [
                {
                  trigger: 'element:mouseenter',
                  action: 'pie-statistic:change',
                },
                {
                  trigger: 'legend-item:mouseenter',
                  action: 'pie-statistic:change',
                },
              ],
              end: [
                {
                  trigger: 'element:mouseleave',
                  action: 'pie-statistic:reset',
                },
                {
                  trigger: 'legend-item:mouseleave',
                  action: 'pie-statistic:reset',
                },
              ],
            },
          },
        ],
      }).render();
    } catch (err) {
      // catch
    } finally {
      setLoading(false);
    }
  };

  workplaceLogServletMethodRequest();
</script>

<script lang="ts">
  export default {
    name: 'WorkplaceServletMethod',
  };
</script>

<style scoped lang="less"></style>
