<template>
  <div class="container">
    <a-card class="general-card" :title="$t('common.action.upload')">
      <j-upload
        :action="CRUD_UPLOAD_URL"
        :template-api="crudTemplateApi"
        @cancel="uploadCancel"
      ></j-upload>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { CRUD_UPLOAD_URL } from '@/api/url/crud';
  import { crudTemplateApi } from '@/api/request/crud';
  import useRouter from '@/hooks/router';

  const { tabClose } = useRouter();

  const uploadCancel = () => {
    tabClose('CrudComponents');
  };
</script>

<script lang="ts">
  export default {
    name: 'CrudComponentsUpload',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
