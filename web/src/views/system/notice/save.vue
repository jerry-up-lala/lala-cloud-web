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
              <a-form-item field="title" :label="$t('system.notice.title')">
                <a-input
                  v-model="formModel.title"
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
              <a-form-item field="noticeType" :label="$t('system.notice.type')">
                <a-select
                  v-model="formModel.noticeType"
                  :options="noticeTypeOptions"
                  :placeholder="$t('common.placeholder.select')"
                  allow-clear
                  allow-search
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="userIds" :label="$t('system.notice.userIds')">
                <a-transfer
                  v-model="formModel.userIds"
                  :data="userTransferOptions"
                  :title="[
                    $t('common.transfer.source'),
                    $t('common.transfer.target'),
                  ]"
                  show-search
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="20">
              <a-form-item
                field="html"
                :label="$t('system.notice.html')"
                :label-col-props="{ span: 3 }"
              >
                <div style="border: 1px solid #ccc; margin-top: 10px">
                  <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editorHtmlRef"
                    :default-config="wangeditorConfig.toolbarConfig"
                    :mode="wangeditorConfig.mode"
                  />
                  <Editor
                    v-model="formModel.html"
                    style="height: 400px; overflow-y: hidden"
                    :default-config="wangeditorConfig.editorConfig"
                    :mode="wangeditorConfig.mode"
                    @on-created="handleCreated"
                  />
                </div>
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
  import { computed, shallowRef, ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
  import { IDomEditor } from '@wangeditor/editor';
  import '@wangeditor/editor/dist/css/style.css';
  import { noticeTypeOptionsData } from '@/data/notice';
  import useLoading from '@/hooks/loading';
  import useRouter from '@/hooks/router';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import type { TransferItem } from '@arco-design/web-vue/es/transfer/interface';
  import { Message } from '@arco-design/web-vue';
  import {
    noticeInfoApi,
    noticeAddApi,
    noticeUpdateApi,
    NoticeSaveRequestBody,
  } from '@/api/request/notice';
  import { userListApi, UserResponseBody } from '@/api/request/user';

  const { t } = useI18n();

  const { route, tabClose } = useRouter();

  const noticeTypeOptions = computed<SelectOptionData[]>(() =>
    noticeTypeOptionsData(t)
  );

  const userTransferOptions = ref<TransferItem[]>([]);

  const saveModelDefault = (): NoticeSaveRequestBody => {
    return {
      title: '',
      noticeType: 1,
      html: '',
      userIds: [],
    };
  };

  // 编辑器
  const editorHtmlRef = shallowRef();
  // 编辑器配置
  const wangeditorConfig = ref({
    mode: 'default',
    toolbarConfig: {
      excludeKeys: ['fullScreen', 'uploadImage', 'uploadVideo'],
    },
    editorConfig: {
      placeholder: t('common.placeholder.input'),
      maxLength: 10000,
    },
  });

  const handleCreated = (editor: IDomEditor) => {
    editorHtmlRef.value = editor;
  };

  // 加载详情
  const formLoading = ref(false);

  const { loading, setLoading } = useLoading();

  const formRef = ref<FormInstance>();

  const formModel = ref<NoticeSaveRequestBody>(saveModelDefault());

  const id = ref<number | null>(
    route.query?.id ? Number(route.query?.id) : null
  );

  const cardTitle = ref<string>(
    id.value
      ? `${t('common.action.update')}(${id.value})`
      : t('common.action.add')
  );

  const userTransfer = async () => {
    try {
      const { data } = await userListApi();
      userTransferOptions.value = data.map((user: UserResponseBody) => {
        return {
          value: user.id,
          label: `${user.loginName}(${user.realName})`,
          disabled: false,
        };
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
      const { data } = await noticeInfoApi(id.value);
      formModel.value = {
        title: data.title,
        noticeType: data.noticeType,
        html: data.html,
        userIds: data.userIds,
      };
    } catch (err) {
      // catch
    } finally {
      formLoading.value = false;
    }
  };

  // 保存表单规则
  const saveRules = {
    title: [
      {
        required: true,
        message: t('system.notice.title') + t('common.required.enter'),
      },
    ],
    noticeType: [
      {
        required: true,
        message: t('system.notice.type') + t('common.required.enter'),
      },
    ],
    html: [
      {
        required: true,
        message: t('system.notice.html') + t('common.required.enter'),
      },
    ],
    userIds: [
      {
        required: true,
        message: t('system.notice.userIds') + t('common.required.select'),
      },
    ],
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
          await noticeUpdateApi(id.value, values as NoticeSaveRequestBody);
          Message.success(t('common.success.update'));
        } else {
          await noticeAddApi(values as NoticeSaveRequestBody);
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
    tabClose('Notice');
  };

  onMounted(() => {
    userTransfer();
    if (id.value) {
      updateDefaultRequest();
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'NoticeSave',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
