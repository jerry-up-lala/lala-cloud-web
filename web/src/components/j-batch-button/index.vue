<template>
  <a-dropdown-button>
    {{ batchInfo($t('common.action.batch'), ids) }}
    <template #icon>
      <icon-down />
    </template>
    <template #content>
      <a-doption
        v-if="deleteButton.show"
        :v-permission="deleteButton.permission"
        :disabled="ids.length === 0"
        @click="showBatchDeleteModal"
      >
        {{ $t('common.action.batch.delete') }}
      </a-doption>

      <a-divider
        v-if="deleteButton.show && exportButton.show"
        :v-permission="
          arrayConcat(deleteButton.permission, exportButton.permission)
        "
        :margin="1"
      />

      <a-doption
        v-if="exportButton.show"
        :v-permission="exportButton.permission"
        :disabled="ids.length === 0"
        @click="clickExport(3)"
      >
        {{ $t('common.action.batch.export.selected') }}
      </a-doption>

      <a-doption
        v-if="exportButton.show"
        :v-permission="exportButton.permission"
        @click="clickExport(1)"
      >
        {{ $t('common.action.batch.export.all') }}
      </a-doption>

      <a-doption
        v-if="exportButton.show"
        :v-permission="exportButton.permission"
        @click="clickExport(2)"
      >
        {{ $t('common.action.batch.export.currentPage') }}
      </a-doption>
    </template>
  </a-dropdown-button>

  <!-- 批量删除警告 -->
  <a-modal
    v-model:visible="batchDeleteVisible"
    :title="batchInfo($t('common.action.batch.delete'), ids)"
    title-align="start"
    :width="320"
    message-type="error"
    draggable
    :ok-loading="batchDeleteLoading"
    :on-before-ok="batchDeleteBeforeOk"
    @ok="batchDeleteOk"
    @cancel="batchDeleteCancel"
  >
    <div>{{ $t('common.confirm.delete') }}</div>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';
  import { JBatchButtonType, JBatchType, JBatchButtonProps } from '@/global/j';
  import { arrayConcat } from '@/utils/array';

  const { t } = useI18n();

  const props = defineProps({
    ids: {
      type: Array as PropType<(string | number)[]>,
      default: () => {
        return [];
      },
    },
    types: {
      type: Array as PropType<JBatchButtonType[]>,
      default: (): JBatchButtonType[] => {
        return [];
      },
    },
  });

  const findButton = (batchType: JBatchType): JBatchButtonProps => {
    const button: JBatchButtonType | undefined = props.types.find(
      (type) => type.type === batchType
    );
    return {
      show: !!button,
      ...button,
    };
  };

  const batchInfo = (info: string, array: Array<any>): string => {
    return `${info}${
      array.length > 0 ? `${array.length}${t('common.action.item')}` : ''
    }`;
  };

  const deleteButton = ref<JBatchButtonProps>(findButton('DELETE'));

  const exportButton = ref<JBatchButtonProps>(findButton('EXPORT'));

  // =========== 批量删除开始 ===========

  // 是否显示批量删除弹出框
  const batchDeleteVisible = ref(false);
  // 确认删除按钮加载
  const batchDeleteLoading = ref(false);

  const showBatchDeleteModal = () => {
    batchDeleteVisible.value = true;
  };

  const batchDeleteCancel = () => {
    batchDeleteVisible.value = false;
  };

  const batchDeleteBeforeOk = async () => {
    if (batchDeleteLoading.value || !deleteButton.value?.api) {
      return false;
    }
    batchDeleteLoading.value = true;
    try {
      await deleteButton.value.api(props.ids);
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      batchDeleteLoading.value = false;
    }
  };

  const batchDeleteOk = async () => {
    if (!deleteButton.value?.okApi) {
      return;
    }
    try {
      await deleteButton.value.okApi();
    } catch (err) {
      // catch error
    } finally {
      // finally
    }
  };

  // =========== 批量删除结束 ===========

  // =========== 导出开始 ===========
  const clickExport = async (type: number) => {
    if (!exportButton.value?.api) {
      return;
    }
    try {
      await exportButton.value.api(type);
    } catch (err) {
      // catch error
    } finally {
      // finally
    }
  };
  // =========== 导出结束 ===========
</script>

<script lang="ts">
  export default {
    name: 'JBatchButton',
  };
</script>
