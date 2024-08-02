<template>
  <a-layout-footer class="footer">
    <a-space direction="vertical" :size="10">
      <a-typography-text :style="{ fontSize: '12px' }">
        Copyright © 2024 jerry-up · lala
        {{ $t('footer.one')
        }}<a-link href="mailto:329753704@qq.com">329753704@qq.com</a-link
        >{{ $t('footer.two')
        }}<a-link href="https://arco.design/">Arco Design</a-link
        >{{ $t('footer.three')
        }}<a-link href="https://developers.cloudflare.com/pages/"
          >Cloudflare Pages</a-link
        >{{ $t('footer.four') }}
      </a-typography-text>
    </a-space>
  </a-layout-footer>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>
