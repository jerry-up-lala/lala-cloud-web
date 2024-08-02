<template>
  <a-spin
    style="display: block"
    :loading="loading"
    :tip="$t('common.loading.info')"
  >
    <a-tabs
      v-model:activeKey="noticeType"
      type="rounded"
      destroy-on-hide
      @tab-click="noticeUserListRequest"
    >
      <template #extra>
        <a-button type="text" @click="allReadAction">
          {{ $t('common.action.allRead') }}
        </a-button>
      </template>
      <a-tab-pane v-for="item in tabList" :key="item.key">
        <template #title>
          <span>
            {{ item.title }}({{ appStore.noticeUserUnreadCount[item.key] }})
          </span>
        </template>
        <a-result v-if="!noticeUserList || !noticeUserList.length" status="404">
          <template #subtitle> {{ $t('system.notice.user.empty') }} </template>
        </a-result>
        <my-notice-list
          :notice-list="noticeUserList"
          :notice-type="noticeType"
          @notice-list-refresh="noticeUserListRequest"
        />
      </a-tab-pane>
    </a-tabs>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { useAppStore } from '@/store';
  import {
    noticeUserPageApi,
    noticeUserReadAllApi,
    NoticeUserPageParams,
    NoticeUserResponseBody,
  } from '@/api/request/notice-user';
  import useLoading from '@/hooks/loading';
  import MyNoticeList from './list.vue';

  const { loading, setLoading } = useLoading(true);

  const appStore = useAppStore();

  const { t } = useI18n();

  interface TabItem {
    key: number;
    title: string;
  }

  const tabList: TabItem[] = [
    {
      key: 0,
      title: t('system.notice.type.all'),
    },
    {
      key: 1,
      title: t('system.notice.type.info'),
    },
    {
      key: 2,
      title: t('system.notice.type.notice'),
    },
  ];

  const noticeType = ref(0);

  const noticeUserList = ref<NoticeUserResponseBody[]>([]);

  const noticeUserListRequest = async () => {
    setLoading(true);
    try {
      const params: NoticeUserPageParams = {
        current: 1,
        pageSize: 3,
      };
      if (noticeType.value !== 0) {
        params.noticeType = noticeType.value;
      }
      const { data } = await noticeUserPageApi(params);
      noticeUserList.value = data.list;
    } catch (err) {
      // err
    } finally {
      setLoading(false);
    }
  };

  const allReadAction = async () => {
    setLoading(true);
    try {
      await noticeUserReadAllApi();
      noticeUserList.value = [];
      appStore.noticeUserUnreadCountRequest();
      Message.success(t('common.success.operation'));
    } catch (err) {
      // err
    } finally {
      setLoading(false);
    }
  };

  noticeUserListRequest();
</script>

<script lang="ts">
  export default {
    name: 'MyNotice',
  };
</script>

<style scoped lang="less">
  :deep(.arco-popover-popup-content) {
    padding: 0;
  }

  :deep(.arco-list-item-meta) {
    align-items: flex-start;
  }
  :deep(.arco-tabs-nav) {
    padding: 14px 0 12px 16px;
    border-bottom: 1px solid var(--color-neutral-3);
    .arco-tabs-nav-extra {
      padding: 0 10px 0 10px;
    }
  }
  :deep(.arco-tabs-content) {
    padding-top: 0;
    .arco-result-subtitle {
      color: rgb(var(--gray-6));
    }
  }
</style>
