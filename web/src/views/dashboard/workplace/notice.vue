<template>
  <a-card
    class="general-card"
    :title="$t('workplace.notice')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '15px 0px 10px 15px' }"
    style="height: 280px"
  >
    <template #extra>
      <a-link @click="jumpNoticeUser">{{ $t('workplace.notice.more') }}</a-link>
    </template>
    <a-table
      :data="dataList"
      :loading="loading"
      :pagination="false"
      :bordered="false"
      :show-header="false"
      column-resizable
      table-layout-fixed
      @row-click="jumpNoticeInfo"
    >
      <template #columns>
        <a-table-column data-index="noticeType" :width="60">
          <template #cell="{ record }">
            <a-tag
              :color="
                noticeTypeOptions.find(
                  (option) => `${option?.value}` === `${record.noticeType}`
                )?.color
              "
              size="small"
            >
              {{
                noticeTypeOptions.find(
                  (option) => `${option?.value}` === `${record.noticeType}`
                )?.label
              }}
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column data-index="title" ellipsis tooltip></a-table-column>
      </template>
    </a-table>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import useRouter from '@/hooks/router';
  import { noticeTypeOptionsData } from '@/data/notice';
  import {
    workplaceNoticeApi,
    WorkplaceNoticeResponseBody,
  } from '@/api/request/workplace';

  const { t } = useI18n();

  const { router } = useRouter();

  const { loading, setLoading } = useLoading();

  const dataList = ref<WorkplaceNoticeResponseBody[]>([]);

  const noticeTypeOptions = computed(() => noticeTypeOptionsData(t));

  const workplaceNoticeRequest = async () => {
    try {
      setLoading(true);
      const { data } = await workplaceNoticeApi();
      dataList.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  // =========== 跳转页面开始 ===========
  const jumpNoticeUser = () => {
    router.push({
      name: 'NoticeUser',
    });
  };

  const jumpNoticeInfo = (record: any) => {
    router.push({ name: 'NoticeUserInfo', query: { id: record.id } });
  };

  // =========== 跳转页面结束 ===========

  workplaceNoticeRequest();
</script>

<script lang="ts">
  export default {
    name: 'WorkplaceNotice',
  };
</script>

<style scoped lang="less">
  .item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    margin-bottom: 4px;
    .item-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 4px;
      color: var(--color-text-2);
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
    }
  }
</style>
