<template>
  <div class="container">
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <a-card :bordered="false" :title="$t('menu.center.userPersonal')">
          <a-col :span="6">
            <a-descriptions :column="2">
              <a-descriptions-item :span="2" :label="$t('system.user.id')">
                <a-skeleton v-if="initLoading" :animation="true">
                  <a-skeleton-line :rows="1" />
                </a-skeleton>
                <span v-else>
                  {{ infoDescData.id }}
                </span>
              </a-descriptions-item>

              <a-descriptions-item :label="$t('system.user.loginName')">
                <a-skeleton v-if="initLoading" :animation="true">
                  <a-skeleton-line :rows="1" />
                </a-skeleton>
                <span v-else>
                  {{ infoDescData.loginName }}
                </span>
              </a-descriptions-item>

              <a-descriptions-item :label="$t('system.user.realName')">
                <a-skeleton v-if="initLoading" :animation="true">
                  <a-skeleton-line :rows="1" />
                </a-skeleton>
                <span v-else>
                  {{ infoDescData.realName }}
                </span>
              </a-descriptions-item>
            </a-descriptions>
          </a-col>
        </a-card>
      </a-col>
    </a-row>

    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" :title="$t('system.user.basicInfo')">
            <a-spin
              style="width: 100%"
              :loading="initLoading"
              :tip="$t('common.loading.info')"
            >
              <a-form
                ref="personalRef"
                class="form"
                :model="personalFormModel"
                :rules="personalSaveRules"
                @submit="personalFormSubmit"
              >
                <a-form-item field="mail" :label="$t('system.user.mail')">
                  <a-input
                    v-model="personalFormModel.mail"
                    :placeholder="$t('common.placeholder.input')"
                    :max-length="50"
                    allow-clear
                    show-word-limit
                  />
                </a-form-item>

                <a-form-item
                  field="nickName"
                  :label="$t('system.user.nickName')"
                >
                  <a-input
                    v-model="personalFormModel.nickName"
                    :placeholder="$t('common.placeholder.input')"
                    :max-length="20"
                    allow-clear
                    show-word-limit
                  />
                </a-form-item>

                <a-form-item field="intro" :label="$t('system.user.intro')">
                  <a-textarea
                    v-model="personalFormModel.intro"
                    :placeholder="$t('common.placeholder.input')"
                    :max-length="100"
                    allow-clear
                    show-word-limit
                  />
                </a-form-item>

                <a-form-item>
                  <a-space>
                    <a-button
                      type="primary"
                      html-type="submit"
                      :loading="personalLoading"
                      >{{ $t('common.action.save') }}</a-button
                    >
                    <a-button @click="personalFormModelReset">{{
                      $t('common.action.reset')
                    }}</a-button>
                  </a-space>
                </a-form-item>
              </a-form>
            </a-spin>
          </a-tab-pane>
          <a-tab-pane key="2" :title="$t('system.user.security')">
            <a-collapse accordion>
              <a-collapse-item
                :key="1"
                :header="$t('system.user.password.update')"
              >
                <a-card :bordered="false">
                  <a-form
                    ref="passwordRef"
                    class="form"
                    :model="passwordFormModel"
                    :rules="passwordSaveRules"
                    @submit="passwordFormSubmit"
                  >
                    <a-form-item
                      field="oldPassWord"
                      :label="$t('system.user.oldPassWord')"
                    >
                      <a-input-password
                        v-model="passwordFormModel.oldPassWord"
                        :placeholder="$t('common.placeholder.input')"
                        :max-length="20"
                        allow-clear
                        show-word-limit
                      />
                    </a-form-item>

                    <a-form-item
                      field="newPassWord"
                      :label="$t('system.user.password')"
                    >
                      <a-input-password
                        v-model="passwordFormModel.newPassWord"
                        :placeholder="$t('common.placeholder.input')"
                        :max-length="20"
                        allow-clear
                        show-word-limit
                      />
                    </a-form-item>

                    <a-form-item
                      field="rePassWord"
                      :label="$t('system.user.password.confirm')"
                    >
                      <a-input-password
                        v-model="passwordFormModel.rePassWord"
                        :placeholder="$t('common.placeholder.input')"
                        :max-length="20"
                        allow-clear
                        show-word-limit
                      />
                    </a-form-item>

                    <a-form-item>
                      <a-space>
                        <a-button
                          type="primary"
                          html-type="submit"
                          :loading="passwordLoading"
                          >{{ $t('common.action.save') }}</a-button
                        >
                        <a-button @click="passwordFormModelReset">{{
                          $t('common.action.reset')
                        }}</a-button>
                      </a-space>
                    </a-form-item>
                  </a-form>
                </a-card>
              </a-collapse-item>
            </a-collapse>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { Message } from '@arco-design/web-vue';
  import {
    userPersonalInfoApi,
    userPersonalSaveApi,
    userPersonalPasswordApi,
    UserPersonalResponseBody,
    UserPersonalSaveRequestBody,
    UserPersonalPasswordRequestBody,
  } from '@/api/request/user-personal';

  const { t } = useI18n();

  const infoDescDataDefault = (): UserPersonalResponseBody => {
    return {
      id: '',
      loginName: '',
      realName: '',
    };
  };

  // 加载详情
  const initLoading = ref(false);
  // 详情表单
  const infoDescData = ref<any>(infoDescDataDefault());
  /**
   * 详情查询
   */
  const infoRequest = async () => {
    initLoading.value = true;
    try {
      const { data } = await userPersonalInfoApi();
      infoDescData.value = data;
      personalFormModel.value = {
        mail: data.mail,
        nickName: data.nickName,
        intro: data.intro,
      };
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      initLoading.value = false;
    }
  };

  // 加载表单
  const personalLoading = ref(false);

  // 表单初始化
  const personalFormModelDefault = (): UserPersonalSaveRequestBody => {
    return {
      mail: '',
      nickName: '',
      intro: '',
    };
  };

  const personalRef = ref<FormInstance>();

  const personalFormModel = ref<UserPersonalSaveRequestBody>(
    personalFormModelDefault()
  );

  // 保存表单规则
  const personalSaveRules = {
    mail: [
      {
        required: true,
        message: t('system.user.mail') + t('common.required.enter'),
      },
    ],
    nickName: [
      {
        required: true,
        message: t('system.user.nickName') + t('common.required.enter'),
      },
    ],
  };

  const personalFormSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (personalLoading.value) return;
    if (!errors) {
      personalLoading.value = true;
      try {
        await userPersonalSaveApi(values as UserPersonalSaveRequestBody);
        Message.success(t('common.success.update'));
      } catch (err) {
        // err
      } finally {
        personalLoading.value = false;
      }
    }
  };

  const personalFormModelReset = () => {
    infoRequest();
  };

  // 加载表单
  const passwordLoading = ref(false);

  interface UserPersonalPasswordForm extends UserPersonalPasswordRequestBody {
    rePassWord: string;
  }

  const passwordRef = ref<FormInstance>();

  const passwordValidateStatus = ref();

  const passwordFormModel = ref<UserPersonalPasswordForm>({
    oldPassWord: '',
    newPassWord: '',
    rePassWord: '',
  });

  // 保存表单规则
  const passwordSaveRules = {
    oldPassWord: [
      {
        required: true,
        message: t('system.user.oldPassWord') + t('common.required.enter'),
      },
    ],
    newPassWord: [
      {
        required: true,
        message: t('system.user.password') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg?: string) => void
        ) => {
          checkPassWord(callback);
        },
      },
    ],
    rePassWord: [
      {
        required: true,
        message: t('system.user.password.confirm') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg?: string) => void
        ) => {
          checkPassWord(callback);
        },
      },
    ],
  };

  const checkPassWord = (callback: (apiErrorRMsg?: string) => void) => {
    if (
      passwordFormModel.value.newPassWord &&
      passwordFormModel.value.rePassWord &&
      passwordFormModel.value.newPassWord !== passwordFormModel.value.rePassWord
    ) {
      passwordValidateStatus.value = 'error';
      callback(t('system.user.password.different'));
    } else {
      passwordValidateStatus.value = 'success';
      callback();
    }
  };

  const passwordFormSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (passwordLoading.value) return;
    if (!errors) {
      passwordLoading.value = true;
      try {
        await userPersonalPasswordApi({
          oldPassWord: values.oldPassWord,
          newPassWord: values.newPassWord,
        });
        passwordFormModelReset();
        Message.success(t('common.success.update'));
      } catch (err) {
        // err
      } finally {
        passwordLoading.value = false;
      }
    }
  };

  const passwordFormModelReset = () => {
    passwordRef.value?.resetFields();
  };

  onMounted(() => {
    infoRequest();
  });
</script>

<script lang="ts">
  export default {
    name: 'UserPersonal',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  .form {
    width: 540px;
    margin: 0 auto;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
