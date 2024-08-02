<template>
  <a-space v-if="uploadVisible" direction="vertical" fill>
    <a-row :gutter="16">
      <a-col :span="20">
        <a-upload
          v-model:file-list="fileList"
          draggable
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :tip="$t('common.action.upload.max')"
          :action="uploadAction"
          :headers="uploadHeaders"
          :limit="1"
          download
          :on-before-upload="beforeUpload"
          @success="handleResponse"
          @error="handleResponse"
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
            @click="clickTemplate"
          >
            <template #icon>
              <icon-download />
            </template>
            <template #default>
              {{ $t('common.action.download.template') }}
            </template>
          </a-button>
          <a-button @click="uploadCancel">
            {{ $t('common.action.cancel') }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-space>

  <a-result v-else :status="uploadResult.status" :title="uploadResult.title">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="resumeUpload">
          <template #icon>
            <icon-upload />
          </template>
          {{
            uploadResult.status === 'success'
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
      <div v-dompurify-html="uploadResult.typography"> </div>
    </a-typography>
  </a-result>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message, FileItem } from '@arco-design/web-vue';
  import { downloadXlsx } from '@/utils/blob';
  import { jsonParse } from '@/utils/json';
  import { getToken } from '@/utils/auth';

  const props = defineProps({
    action: {
      type: String as PropType<string>,
      default: '',
    },
    templateApi: {
      type: Function as PropType<() => Promise<any>>,
    },
  });

  const emit = defineEmits(['cancel']);

  const { t } = useI18n();

  const uploadAction = ref(import.meta.env.VITE_API_BASE_URL + props.action);

  const uploadHeaders = ref({ Authorization: `Bearer ${getToken()}` });

  // 下载附件
  const templateLoading = ref(false);

  // 显示导入页
  const uploadVisible = ref<boolean>(true);

  const fileList = ref<FileItem[]>();

  const uploadResultDefault = (): any => {
    return {
      status: 'info',
      title: '',
      typography: '',
    };
  };

  // 导入结果
  const uploadResult = ref(uploadResultDefault());

  const clickTemplate = async () => {
    if (!props.templateApi) {
      return;
    }
    templateLoading.value = true;
    try {
      const res = await props.templateApi;
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

  const handleResponse = (fileItem: FileItem) => {
    const r = jsonParse(fileItem.response);
    if (fileItem.status === 'error') {
      Message.error(t('common.error.upload'));
    } else if (r.error && r.error?.code !== '100011') {
      Message.error(r.error.msg);
    } else {
      if (r.error) {
        uploadResult.value = {
          status: 'error',
          title: t('common.error.upload'),
          typography: r.error.msg,
        };
      } else {
        uploadResult.value = {
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

  // 继续导入
  const resumeUpload = () => {
    uploadResult.value = uploadResultDefault();
    uploadVisible.value = true;
    fileList.value = [];
  };

  const uploadCancel = () => {
    emit('cancel');
  };
</script>

<script lang="ts">
  export default {
    name: 'JUpload',
  };
</script>
