<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ $t('login.form.title') }}</div>
    <div class="login-form-sub-title">{{ $t('login.form.sub.title') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginRef"
      :model="loginModel"
      class="login-form"
      layout="vertical"
      @submit="formSubmit"
    >
      <a-form-item
        field="tenantName"
        :rules="[
          { required: true, message: $t('login.form.tenantName.errMsg') },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-auto-complete
          v-model="loginModel.tenantName"
          :data="['样例集团']"
          :placeholder="$t('login.form.tenantName.placeholder')"
        >
          <template #prefix>
            <icon-storage />
          </template>
        </a-auto-complete>
      </a-form-item>

      <a-form-item
        field="loginName"
        :rules="[
          { required: true, message: $t('login.form.loginName.errMsg') },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="loginModel.loginName"
          :placeholder="$t('login.form.loginName.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="passWord"
        :rules="[{ required: true, message: $t('login.form.passWord.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="loginModel.passWord"
          :placeholder="$t('login.form.passWord.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-passWord-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <div>
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
            <a-dropdown trigger="click" @select="changeLocale">
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
          </div>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          {{ $t('login.form.login') }}
        </a-button>
        <a-button long class="login-form-register-btn" @click="loginModelReset">
          {{ $t('common.action.reset') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import useLocale from '@/hooks/locale';
  import useRouter from '@/hooks/router';
  import { apiErrorRMsg } from '@/global/body';
  import { LOCALE_OPTIONS } from '@/locale';
  import type { LoginRequestBody } from '@/api/request/login';

  const { router } = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();
  const triggerBtn = ref();
  const { changeLocale, currentLocale } = useLocale();
  const locales = [...LOCALE_OPTIONS];

  const loginConfig = useStorage('jerry-up-lala-cloud-web-login-config', {
    rememberPassword: true,
    tenantName: '样例集团',
    loginName: 'tenant',
    passWord: 'lala',
  });

  const loginRef = ref<FormInstance>();

  const loginModel = reactive<LoginRequestBody>({
    tenantName: loginConfig.value.tenantName ?? '样例集团',
    loginName: loginConfig.value.loginName ?? 'tenant',
    passWord: loginConfig.value.passWord ?? 'lala',
  });

  const formSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        await userStore.token(values as LoginRequestBody);
        const { redirect, ...othersQuery } = router.currentRoute.value.query;
        router.push({
          name: (redirect as string) || 'Workplace',
          query: {
            ...othersQuery,
          },
        });
        Message.success(t('login.form.login.success'));
        const { rememberPassword } = loginConfig.value;
        const { loginName, passWord, tenantName } = values;
        loginConfig.value.tenantName = rememberPassword ? tenantName : '';
        loginConfig.value.loginName = rememberPassword ? loginName : '';
        loginConfig.value.passWord = rememberPassword ? passWord : '';
      } catch (err) {
        errorMessage.value = apiErrorRMsg(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const setRememberPassword = (checked: any) => {
    loginConfig.value.rememberPassword = checked;
  };
  const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    triggerBtn.value.dispatchEvent(event);
  };
  const loginModelReset = () => {
    loginRef.value?.resetFields();
  };
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-passWord-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
