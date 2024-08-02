<template>
  <a-list :bordered="false">
    <a-list-item
      v-for="item in noticeList"
      :key="item.id"
      action-layout="vertical"
    >
      <div class="item-wrap" @click="jumpInfo(item)">
        <a-list-item-meta>
          <template #title>
            {{ item.title }}
          </template>
          <template #description>
            <div>
              <a-typography-text class="time-text">
                {{ item.sendTime }}
              </a-typography-text>
            </div>
          </template>
        </a-list-item-meta>
      </div>

      <template #extra>
        <a-tag
          :color="
            noticeTypeOptions.find(
              (option) => `${option?.value}` === `${item.noticeType}`
            )?.color
          "
        >
          {{
            noticeTypeOptions.find(
              (option) => `${option?.value}` === `${item.noticeType}`
            )?.label
          }}
        </a-tag>
      </template>

      <template #actions>
        <a-tooltip :content="t('common.action.read')">
          <icon-check-circle @click="readAction(item)" />
        </a-tooltip>
        <a-popconfirm
          :content="$t('common.confirm.delete')"
          type="error"
          :ok-loading="deleteLoading"
          :on-before-ok="deleteBeforeOk"
          @show="deleteShow(item)"
          @ok="noticeListRefresh"
          @cancel="deleteCancel"
        >
          <a-tooltip :content="t('common.action.delete')">
            <icon-delete />
          </a-tooltip>
        </a-popconfirm>
      </template>
    </a-list-item>
    <template #footer>
      <a-space fill :size="0">
        <div class="footer-wrap">
          <a-link @click="jumpNoticeUser">{{
            $t('system.notice.user.viewMore')
          }}</a-link>
        </div>
      </a-space>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useAppStore } from '@/store';
  import useRouter from '@/hooks/router';
  import {
    noticeUserReadApi,
    noticeUserDeleteApi,
    NoticeUserResponseBody,
  } from '@/api/request/notice-user';
  import { noticeTypeOptionsData } from '@/data/notice';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const appStore = useAppStore();

  const { router } = useRouter();

  const noticeTypeOptions = computed(() => noticeTypeOptionsData(t));

  const props = defineProps({
    noticeList: {
      type: Array<NoticeUserResponseBody>,
      required: true,
    },
    noticeType: {
      type: Number,
      required: false,
    },
  });

  const emit = defineEmits(['noticeListRefresh']);

  const noticeListRefresh = () => {
    emit('noticeListRefresh');
  };

  const jumpInfo = (record: NoticeUserResponseBody) => {
    router.push({ name: 'NoticeUserInfo', query: { id: record.id } });
  };

  const readAction = async (item: NoticeUserResponseBody) => {
    noticeUserReadApi({ value: [item.id] });
    appStore.noticeUserUnreadCountRequest();
    Message.success(t('common.success.operation'));
  };

  // =========== 删除开始 ===========
  // 删除按钮加载
  const deleteLoading = ref(false);
  // 删除ID
  const deleteId = ref<number | null>(null);

  const deleteShow = (item: NoticeUserResponseBody) => {
    deleteId.value = item.id;
  };

  const deleteCancel = () => {
    deleteId.value = null;
  };

  const deleteBeforeOk = async () => {
    if (deleteLoading.value) {
      return false;
    }
    deleteLoading.value = true;
    try {
      await noticeUserDeleteApi(deleteId.value);
      deleteId.value = null;
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      deleteLoading.value = false;
    }
  };
  // =========== 删除结束 ===========

  // =========== 跳转页面开始 ===========
  const jumpNoticeUser = () => {
    router.push({
      name: 'NoticeUser',
      query: { noticeType: props.noticeType },
    });
  };
  // =========== 跳转页面结束 ===========
</script>

<script lang="ts">
  export default {
    name: 'MyNoticeList',
  };
</script>

<style scoped lang="less">
  :deep(.arco-list-medium) {
    .arco-list-item {
      min-height: 86px;
      border-bottom: 1px solid rgb(var(--gray-3));
    }
    .arco-list-item-extra {
      position: absolute;
      right: 20px;
    }
    .arco-list-item-meta-content {
      flex: 1;
    }
    .item-wrap {
      cursor: pointer;
    }
    .time-text {
      font-size: 12px;
      color: rgb(var(--gray-6));
    }
    .arco-empty {
      display: none;
    }

    .arco-list-content-wrapper {
      .arco-list-footer {
        padding: 0;
        height: 50px;
        line-height: 50px;
        border-top: none;
        .arco-space-item {
          width: 100%;
          border-right: 1px solid rgb(var(--gray-3));
          &:last-child {
            border-right: none;
          }
        }
        .add-border-top {
          border-top: 1px solid rgb(var(--gray-3));
        }
      }
    }
    .footer-wrap {
      width: 100%;
      text-align: center;
    }
    .arco-typography {
      margin-bottom: 0;
    }
    .add-border {
      border-top: 1px solid rgb(var(--gray-3));
    }
  }
</style>
