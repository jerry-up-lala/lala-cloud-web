<template>
  <div class="container">
    <a-spin
      style="width: 100%"
      :loading="formLoading"
      :tip="$t('common.loading.info')"
    >
      <a-card class="general-card" :title="cardTitle">
        <a-form
          ref="formRef"
          :model="formModel"
          :rules="saveRules"
          @submit="formSubmit"
        >
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="loginName"
                :label="$t('system.user.loginName')"
                :tooltip="
                  $t('system.user.loginName') + $t('common.info.cannot.repeat')
                "
                :validate-status="loginNameValidateStatus"
                validate-trigger="blur"
                feedback
              >
                <a-input
                  v-model="formModel.loginName"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="20"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="passWord"
                :label="$t('system.user.password')"
                :validate-status="passWordValidateStatus"
                validate-trigger="blur"
                feedback
              >
                <a-input-password
                  v-model="formModel.passWord"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="20"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item
                field="rePassWord"
                :label="$t('system.user.password.confirm')"
                :validate-status="passWordValidateStatus"
                validate-trigger="blur"
                feedback
              >
                <a-input-password
                  v-model="formModel.rePassWord"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="20"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="realName" :label="$t('system.user.realName')">
                <a-input
                  v-model="formModel.realName"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="20"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="realName" :label="$t('system.user.realName')">
                <a-input
                  v-model="formModel.realName"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="20"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="realName" :label="$t('system.user.realName')">
                <a-input
                  v-model="formModel.mail"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="50"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="intro" :label="$t('system.user.intro')">
                <a-textarea
                  v-model="formModel.intro"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="100"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="state" :label="$t('system.user.state')">
                <a-switch v-model="formModel.state">
                  <template #checked>
                    {{ $t('common.enum.effective') }}
                  </template>
                  <template #unchecked>
                    {{ $t('common.enum.invalid') }}
                  </template>
                </a-switch>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="roleIds" :label="$t('system.user.roleIds')">
                <a-transfer
                  v-model="formModel.roleIds"
                  :data="roleTransferOptions"
                  :title="[
                    $t('common.transfer.source'),
                    $t('common.transfer.target'),
                  ]"
                  show-search
                  allow-clear
                >
                  <template #item="{ value, label }">
                    {{ label }}
                    <a-tag
                      v-if="arrayContains(roleInvalidIds, value)"
                      color="gray"
                    >
                      {{ $t('common.enum.invalid') }}
                    </a-tag>
                  </template>
                </a-transfer>
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item>
            <a-space>
              <a-button type="primary" html-type="submit" :loading="loading">{{
                $t('common.action.save')
              }}</a-button>
              <a-button @click="formModelReset">{{
                $t('common.action.reset')
              }}</a-button>
              <a-button @click="formCancel">{{
                $t('common.action.cancel')
              }}</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import type { TransferItem } from '@arco-design/web-vue/es/transfer/interface';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import useRouter from '@/hooks/router';
  import { arrayContains } from '@/utils/array';
  import { apiErrorRMsg } from '@/global/body';
  import {
    userInfoApi,
    userPasswordApi,
    userVerifyApi,
    userAddApi,
    userUpdateApi,
    UserSaveRequestBody,
  } from '@/api/request/user';
  import { roleListApi, RoleResponseBody } from '@/api/request/role';

  const { t } = useI18n();

  const { route, tabClose } = useRouter();

  const id = ref<string>(route.query?.id ? String(route.query?.id) : '');

  const cardTitle = ref<string>(
    id.value
      ? `${t('common.action.update')}(${id.value})`
      : t('common.action.add')
  );

  interface FormModel extends UserSaveRequestBody {
    id: string | null;
    rePassWord: string;
  }

  const roleTransferOptions = ref<TransferItem[]>([]);

  const roleInvalidIds = ref<string[]>([]);

  const formModelDefault = (): FormModel => {
    return {
      id: null,
      loginName: '',
      passWord: '',
      rePassWord: '',
      realName: '',
      mail: '',
      nickName: '',
      intro: '',
      state: true,
      roleIds: [],
    };
  };

  // 加载表单
  const formLoading = ref(false);

  const { loading, setLoading } = useLoading();

  const formRef = ref<FormInstance>();

  const formModel = ref<FormModel>(formModelDefault());

  const loginNameValidateStatus = ref();

  const passWordValidateStatus = ref();

  /**
   * 角色穿梭框 数据加载
   */
  const roleTransfer = async () => {
    try {
      const { data } = await roleListApi();
      roleTransferOptions.value = data.map((role: RoleResponseBody) => {
        return {
          value: role.id.toString(),
          label: role.roleName,
          disabled: false,
        };
      });
      roleInvalidIds.value = data
        .filter((role: RoleResponseBody) => !role.state)
        .map((role: RoleResponseBody) => {
          return role.id.toString();
        });
    } catch (err) {
      // catch
    } finally {
      // finally
    }
  };

  /**
   * 编辑初始化查询
   */
  const updateDefaultRequest = async () => {
    formLoading.value = true;
    try {
      const userInfo = await userInfoApi(id.value);
      const userPassword = await userPasswordApi(id.value);
      formModel.value = {
        ...userInfo.data,
        roleIds: userInfo.data.roleIds
          ? userInfo.data.roleIds.map((item) => item.toString())
          : [],
        passWord: userPassword.data,
        rePassWord: userPassword.data,
      };
    } catch (err) {
      // catch
    } finally {
      formLoading.value = false;
    }
  };

  // 保存表单规则
  const saveRules = {
    loginName: [
      {
        required: true,
        message: t('system.user.loginName') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg: string) => void
        ) => {
          return new Promise((resolve) => {
            loginNameValidateStatus.value = 'validating';
            userVerifyApi({
              id: formModel.value?.id,
              value,
            })
              .then((res) => {
                loginNameValidateStatus.value = 'success';
                resolve('');
              })
              .catch((err) => {
                callback(apiErrorRMsg(err));
                loginNameValidateStatus.value = 'error';
                resolve('');
              });
          });
        },
      },
    ],
    passWord: [
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
    realName: [
      {
        required: true,
        message: t('system.user.realName') + t('common.required.enter'),
      },
    ],
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
    state: [
      {
        required: true,
        message: t('system.user.state') + t('common.required.select'),
      },
    ],
    roleIds: [
      {
        required: true,
        message: t('system.user.roleIds') + t('common.required.select'),
      },
    ],
  };

  const checkPassWord = (callback: (apiErrorRMsg?: string) => void) => {
    if (
      formModel.value.passWord &&
      formModel.value.rePassWord &&
      formModel.value.passWord !== formModel.value.rePassWord
    ) {
      passWordValidateStatus.value = 'error';
      callback(t('system.user.password.different'));
    } else {
      passWordValidateStatus.value = 'success';
      callback();
    }
  };

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
        if (id.value) {
          await userUpdateApi(id.value, values as UserSaveRequestBody);
          Message.success(t('common.success.update'));
        } else {
          await userAddApi(values as UserSaveRequestBody);
          Message.success(t('common.success.add'));
        }
        formCancel();
      } catch (err) {
        // err
      } finally {
        setLoading(false);
      }
    }
  };

  const formModelReset = () => {
    if (id.value) {
      updateDefaultRequest();
    } else {
      formRef.value?.resetFields();
    }
  };

  const formCancel = () => {
    tabClose('User');
  };

  onMounted(() => {
    roleTransfer();
    if (id.value) {
      updateDefaultRequest();
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'UserSave',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
