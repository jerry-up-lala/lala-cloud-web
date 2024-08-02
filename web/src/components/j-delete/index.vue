<template>
  <a-popconfirm
    :content="$t('common.confirm.delete')"
    type="error"
    :ok-loading="deleteLoading"
    :on-before-ok="deleteBeforeOk"
    @ok="ok"
    @cancel="cancel"
  >
    <a-button type="text" status="danger" :v-permission="permission"
      >{{ $t('common.action.delete') }}
    </a-button>
  </a-popconfirm>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Message } from '@arco-design/web-vue';

  const { t } = useI18n();

  const props = defineProps({
    id: {
      type: [String, Number] as PropType<string | number>,
      default: () => {
        return '';
      },
    },
    api: {
      type: Function as PropType<(param: any) => Promise<any>>,
      default: () => {
        return () => {
          return Promise.resolve();
        };
      },
    },
    permission: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
  });

  const emit = defineEmits(['ok']);

  // =========== 删除开始 ===========
  // 删除按钮加载
  const deleteLoading = ref(false);
  // 删除ID
  const deleteId = ref(props.id);

  const cancel = () => {
    deleteId.value = '';
  };

  const ok = () => {
    emit('ok');
  };

  const deleteBeforeOk = async () => {
    if (deleteLoading.value) {
      return false;
    }
    deleteLoading.value = true;
    try {
      await props.api(deleteId.value);
      deleteId.value = '';
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      deleteLoading.value = false;
    }
  };
  // =========== 删除结束 ===========
</script>

<script lang="ts">
  export default {
    name: 'JDelete',
  };
</script>
