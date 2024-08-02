<template>
  <div class="container">
    <a-card class="general-card" :title="cardTitle">
      <a-spin
        style="display: block"
        :loading="loading"
        :tip="$t('common.loading.info')"
      >
        <a-typography class="wrapper">
          <a-typography-title :heading="2" style="text-align: center">
            {{ infoData?.title }}
          </a-typography-title>

          <a-typography-paragraph type="secondary" style="text-align: center">
            {{ infoData?.sendTime }}
          </a-typography-paragraph>

          <a-typography-text v-dompurify-html="infoData?.html">
          </a-typography-text>
        </a-typography>
      </a-spin>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useAppStore } from '@/store';
  import { useI18n } from 'vue-i18n';
  import { noticeUserInfoApi } from '@/api/request/notice-user';
  import useRouter from '@/hooks/router';
  import useLoading from '@/hooks/loading';

  const appStore = useAppStore();

  const { route } = useRouter();

  const { loading, setLoading } = useLoading(true);

  const { t } = useI18n();

  const id = ref<number | null>(
    route.query?.id ? Number(route.query?.id) : null
  );

  const cardTitle = ref<string>(
    t('common.action.info') + (id.value ? `(${id.value})` : '')
  );

  // 详情表单
  const infoData = ref();

  /**
   * 详情查询
   */
  const infoRequest = async () => {
    setLoading(true);
    try {
      const { data } = await noticeUserInfoApi(id.value);
      appStore.noticeUserUnreadCountRequest();
      infoData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  infoRequest();
</script>

<script lang="ts">
  export default {
    name: 'NoticeUserInfo',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
