<template>
  <a-card
    class="general-card"
    :title="$t('workplace.release')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '15px 0px 10px 15px' }"
  >
    <a-timeline direction="horizontal" label-position="same">
      <a-timeline-item label="2024-07-01" dot-color="#F53F3F" dot-type="hollow">
        <template #dot>
          <IconClockCircle />
        </template>
        项目初始化
      </a-timeline-item>
    </a-timeline>
  </a-card>
</template>

<script lang="ts" setup></script>

<script lang="ts">
  export default {
    name: 'WorkplaceRelease',
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
