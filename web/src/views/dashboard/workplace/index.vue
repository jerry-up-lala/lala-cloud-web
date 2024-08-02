<template>
  <div>
    <div class="container">
      <div class="left-side">
        <div class="panel">
          <Welcome />
          <Statistic />
          <LogSum />
        </div>
      </div>

      <div class="right-side">
        <a-grid :cols="24" :row-gap="16">
          <a-grid-item class="panel" :span="24">
            <User />
          </a-grid-item>
          <a-grid-item class="panel" :span="24">
            <External />
          </a-grid-item>
          <a-grid-item class="panel" :span="24">
            <Notice />
          </a-grid-item>
        </a-grid>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import Welcome from './welcome.vue';
  import Statistic from './statistic.vue';
  import LogSum from './log-sum.vue';
  import User from './user.vue';
  import Notice from './notice.vue';
  import External from './external.vue';
</script>

<script lang="ts">
  export default {
    name: 'Workplace',
  };
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    padding: 10px 15px;
    padding-bottom: 0;
    display: flex;
  }

  .bottom {
    background-color: var(--color-fill-2);
    padding: 10px 15px;
    padding-bottom: 0;
    display: flex;
    width: 100%;
  }

  .left-side {
    flex: 1;
    overflow: auto;
  }

  .right-side {
    width: 280px;
    margin-left: 16px;
  }

  .panel {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
  }
  :deep(.panel-border) {
    margin-bottom: 0;
    border-bottom: 1px solid rgb(var(--gray-2));
  }
  .moduler-wrap {
    border-radius: 4px;
    background-color: var(--color-bg-2);
    :deep(.text) {
      font-size: 12px;
      text-align: center;
      color: rgb(var(--gray-8));
    }

    :deep(.wrapper) {
      margin-bottom: 8px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        .text {
          margin-bottom: 0;
        }
      }
      &:hover {
        .icon {
          color: rgb(var(--arcoblue-6));
          background-color: #e8f3ff;
        }
        .text {
          color: rgb(var(--arcoblue-6));
        }
      }
    }

    :deep(.icon) {
      display: inline-block;
      width: 32px;
      height: 32px;
      margin-bottom: 4px;
      color: rgb(var(--dark-gray-1));
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      background-color: rgb(var(--gray-1));
      border-radius: 4px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  .mobile {
    .container {
      display: block;
    }
    .right-side {
      // display: none;
      width: 100%;
      margin-left: 0;
      margin-top: 16px;
    }
  }
</style>
