<template>
  <a-carousel
    direction="vertical"
    show-arrow="hover"
    :auto-play="{
      interval: 7000,
    }"
    indicator-type="line"
    indicator-position="left"
    style="width: 100%; height: 170px; border-radius: 4px; overflow: hidden"
  >
    <a-carousel-item v-for="(external, idx) in externalList" :key="idx">
      <a-image
        :src="isDark ? external.srcDark : external.src"
        :title="external.title"
        style="width: 100%"
        :height="170"
      >
        <template #extra>
          <div class="actions">
            <a-tooltip :content="$t('workplace.externa.url')">
              <span class="action" @click="openUrl(external.url)">
                <icon-link />
              </span>
            </a-tooltip>
          </div>
        </template>
      </a-image>
    </a-carousel-item>
  </a-carousel>
</template>

<script lang="ts" setup>
  import useThemes from '@/hooks/themes';
  import arco from '@/assets/images/arco.png';
  import jerryup from '@/assets/images/jerry-up.png';
  import arcoDrak from '@/assets/images/arco-drak.png';
  import jerryupDrak from '@/assets/images/jerry-up-drak.png';
  import { openWindow, regexUrl } from '@/utils/url';

  const { isDark } = useThemes();

  const externalList = [
    {
      src: arco,
      srcDark: arcoDrak,
      url: 'https://arco.design',
      title: 'arco',
    },
    {
      src: jerryup,
      srcDark: jerryupDrak,
      url: 'https://jerry-up-blog.pages.dev',
      title: 'jerry-up',
    },
  ];

  const openUrl = (url: string) => {
    if (regexUrl.test(url)) {
      openWindow(url);
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'WorkplaceExternal',
  };
</script>

<style scoped lang="less">
  .actions {
    display: flex;
    align-items: center;
  }
  .action {
    padding: 5px 4px;
    font-size: 14px;
    margin-left: 12px;
    border-radius: 2px;
    line-height: 1;
    cursor: pointer;
  }
  .action:first-child {
    margin-left: 0;
  }

  .action:hover {
    background: rgba(0, 0, 0, 0.5);
  }
  .actions-outer {
    .action {
      &:hover {
        color: #ffffff;
      }
    }
  }
</style>
