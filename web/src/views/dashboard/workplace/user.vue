<template>
  <a-card
    class="general-card"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '15px 15px 15px 15px' }"
    style="height: 180px"
  >
    <a-space direction="vertical" align="center" fill>
      <a-typography-title :heading="5">
        {{ userStore.realName }}
      </a-typography-title>
      <a-typography-text type="secondary">
        <div>@{{ userStore.loginName }}</div>
      </a-typography-text>
      <a-typography-text>
        <div style="padding-top: 15px">
          <a-button type="outline" @click="jumpUserPersonal">
            <template #icon>
              <icon-settings />
            </template>
            <template #default>{{ $t('menu.center.userPersonal') }}</template>
          </a-button>
        </div>
      </a-typography-text>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
  import useRouter from '@/hooks/router';
  import { useUserStore } from '@/store';

  const userStore = useUserStore();

  const { router } = useRouter();

  const jumpUserPersonal = (record: any) => {
    router.push({ name: 'UserPersonal' });
  };
</script>

<script lang="ts">
  export default {
    name: 'WorkplaceUser',
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
