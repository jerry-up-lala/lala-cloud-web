<template>
  <div class="container">
    <a-card class="general-card" :title="$t('common.action.upload')">
      <a-space v-if="uploadVisible" direction="vertical" fill>
        <a-row :gutter="16">
          <a-col :span="20">
            <a-upload
              v-model:file-list="fileList"
              draggable
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              :tip="$t('common.action.upload.max')"
              :action="upload.action"
              :headers="upload.headers"
              :limit="1"
              download
              :on-before-upload="beforeUpload"
              @success="uploadResult"
              @error="uploadResult"
            >
            </a-upload>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-space>
              <a-button
                type="primary"
                :loading="templateLoading"
                @click="downloadTemplate"
              >
                <template #icon>
                  <icon-download />
                </template>
                <template #default>{{
                  $t('common.action.download.template')
                }}</template>
              </a-button>
              <a-button @click="uploadCancel">{{
                $t('common.action.cancel')
              }}</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-space>

      <a-result
        v-else
        :status="uploadResultInfo.status"
        :title="uploadResultInfo.title"
      >
        <template #extra>
          <a-space>
            <a-button type="primary" @click="resumeUpload">
              <template #icon>
                <icon-upload />
              </template>
              {{
                uploadResultInfo.status === 'success'
                  ? t('common.action.upload.resume')
                  : t('common.action.upload.re')
              }}</a-button
            >
            <a-button @click="uploadCancel">
              <template #icon>
                <icon-undo />
              </template>
              {{ $t('common.action.upload.exit') }}</a-button
            >
          </a-space>
        </template>

        <a-typography style="background: var(--color-fill-2); padding: 24px">
          <div v-dompurify-html="uploadResultInfo.typography"> </div>
        </a-typography>
      </a-result>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, FileItem } from '@arco-design/web-vue';
  import { Upload, loadUpload } from '@/global/upload';
  import useRouter from '@/hooks/router';
  import { downloadXlsx } from '@/utils/blob';
  import { jsonParse } from '@/utils/json';
  import { CRUD_UPLOAD_URL } from '@/api/url/crud';
  import { crudTemplateApi } from '@/api/request/crud';

  const { t } = useI18n();

  const { tabClose } = useRouter();

  // 下载附件
  const templateLoading = ref(false);

  const fileList = ref<FileItem[]>();

  // 显示导入页
  const uploadVisible = ref<boolean>(true);

  interface UploadResultInfoData {
    status:
      | 'error'
      | 'success'
      | 'warning'
      | 'info'
      | '403'
      | '404'
      | '500'
      | null;
    title: string;
    typography: string;
  }

  const uploadResultInfoDefault = (): UploadResultInfoData => {
    return {
      status: 'info',
      title: '',
      typography: '',
    };
  };

  // 导入结果
  const uploadResultInfo = ref<UploadResultInfoData>(uploadResultInfoDefault());

  // 导入路径
  const upload = ref<Upload>(loadUpload(CRUD_UPLOAD_URL));

  const uploadCancel = () => {
    tabClose('CrudArco');
  };

  // 继续导入
  const resumeUpload = () => {
    uploadResultInfo.value = uploadResultInfoDefault();
    uploadVisible.value = true;
    fileList.value = [];
  };

  const downloadTemplate = async () => {
    templateLoading.value = true;
    try {
      const res: any = await crudTemplateApi();
      downloadXlsx(res);
    } catch (err) {
      // catch
    } finally {
      templateLoading.value = false;
    }
  };

  const beforeUpload = (file: File) => {
    if (file && file.size > 1048576) {
      Message.error(t('common.action.upload.max'));
      return false;
    }
    return true;
  };

  const uploadResult = (fileItem: FileItem) => {
    const r = jsonParse(fileItem.response);
    if (fileItem.status === 'error') {
      Message.error(t('common.error.upload'));
    } else if (r.error && r.error?.code !== '100011') {
      Message.error(r.error.msg);
    } else {
      if (r.error) {
        uploadResultInfo.value = {
          status: 'error',
          title: t('common.error.upload'),
          typography: r.error.msg,
        };
      } else {
        uploadResultInfo.value = {
          status: 'success',
          title: t('common.success.upload'),
          typography:
            t('common.success.upload') +
            (r.data ?? 0) +
            t('common.action.item'),
        };
      }
      uploadVisible.value = false;
    }
  };
</script>

<script lang="ts">
  export default {
    name: 'CrudArcoUpload',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
