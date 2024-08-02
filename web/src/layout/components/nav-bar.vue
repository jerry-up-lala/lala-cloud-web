<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <icon-font type="icon-jerry-up" :size="32" />
        <a-typography-title
          :style="{ margin: 0, fontSize: '18px' }"
          :heading="5"
        >
          lala cloud web
        </a-typography-title>
        <icon-menu-fold
          v-if="!topMenu && appStore.device === 'mobile'"
          style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu" />
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setDropDownVisible"
          >
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
              v-for="item in locales"
              :key="item.value"
              :value="item.value"
            >
              <template #icon>
                <icon-check v-show="item.value === currentLocale" />
              </template>
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <li>
        <a-tooltip
          :content="
            isDark
              ? $t('settings.navbar.theme.toLight')
              : $t('settings.navbar.theme.toDark')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="handleToggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="isDark" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.navbar.notice')">
          <div class="message-box-trigger">
            <a-badge :count="appStore.noticeUserUnreadCount[0]">
              <a-button
                class="nav-btn"
                type="outline"
                :shape="'circle'"
                @click="setPopoverVisible"
              >
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
          trigger="click"
          position="bottom"
          :arrow-style="{ display: 'none' }"
          :content-style="{ padding: 0, width: '400px' }"
          content-class="notice-popover"
        >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <my-notice />
          </template>
        </a-popover>
      </li>
      <li>
        <a-tooltip
          :content="
            isFullscreen
              ? $t('settings.navbar.screen.toExit')
              : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setVisible"
          >
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="click">
          <a-tooltip :content="loginName">
            <a-avatar
              :size="32"
              :style="{
                marginRight: '8px',
                cursor: 'pointer',
                backgroundColor: '#3370ff',
              }"
            >
              {{ loginName }}
            </a-avatar>
          </a-tooltip>
          <template #content>
            <a-doption>
              <a-space @click="userPersonalAction">
                <icon-settings />
                <span>
                  {{ $t('menu.center.userPersonal') }}
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="showLogoutModal">
                <icon-export />
                <span>
                  {{ $t('common.action.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>

  <!-- 退出登录警告 -->
  <a-modal
    v-model:visible="logoutVisible"
    :title="$t('common.tip')"
    title-align="start"
    :width="320"
    message-type="warning"
    draggable
    :ok-loading="logoutLoading"
    :on-before-ok="logoutBeforeOk"
    @cancel="logoutCancel"
  >
    <div>{{ $t('common.confirm.logout') }}</div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { computed, ref, inject } from 'vue';
  import { useDark, useToggle, useFullscreen } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import { LOCALE_OPTIONS } from '@/locale';
  import useLocale from '@/hooks/locale';
  import useUser from '@/hooks/user';
  import useRouter from '@/hooks/router';
  import Menu from './menu/index.vue';
  import MyNotice from './my-notice/index.vue';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { loginout } = useUser();
  const { changeLocale, currentLocale } = useLocale();
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
  const locales = [...LOCALE_OPTIONS];
  const { router } = useRouter();
  const loginName = computed(() => {
    return userStore.loginName;
  });
  const topMenu = computed(() => appStore.topMenu && appStore.menu);
  const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      if ((dark ? 'dark' : 'light') !== appStore.theme) {
        // overridden default behavior
        appStore.toggleTheme(dark);
      }
    },
  });
  const toggleTheme = useToggle(isDark);
  const handleToggleTheme = () => {
    toggleTheme();
  };
  const setVisible = () => {
    appStore.updateSettings({ globalSettings: true });
  };
  const refBtn = ref();
  const triggerBtn = ref();
  const setPopoverVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    refBtn.value.dispatchEvent(event);
  };
  const userPersonalAction = () => {
    router.push({ name: 'UserPersonal' });
  };

  // =========== 退出登录开始 ===========

  // 是否显示退出登录弹出框
  const logoutVisible = ref(false);
  // 确认删除按钮加载
  const logoutLoading = ref(false);

  const showLogoutModal = () => {
    logoutVisible.value = true;
  };

  const logoutCancel = () => {
    logoutVisible.value = false;
  };

  const logoutBeforeOk = async () => {
    if (logoutLoading.value) {
      return false;
    }
    logoutLoading.value = true;
    try {
      await loginout(true);
      return true;
    } catch (err) {
      return false;
    } finally {
      logoutLoading.value = false;
    }
  };

  // =========== 退出登录结束 ===========

  const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    triggerBtn.value.dispatchEvent(event);
  };
  const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;

  appStore.noticeUserUnreadCountRequest();
</script>

<style scoped lang="less">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .center-side {
    flex: 1;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;
    :deep(.locale-select) {
      border-radius: 20px;
    }
    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }
    .nav-btn {
      border-color: rgb(var(--gray-2));
      color: rgb(var(--gray-8));
      font-size: 16px;
    }
    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }
    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .notice-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
