<template>
  <a-button :type="buttonInfo.type">
    <template v-if="buttonInfo.icon" #icon>
      <arco-icon :icon="buttonInfo.icon" />
    </template>
    {{ buttonInfo?.text }}
  </a-button>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { JButtonType, JButtonInfo } from '@/global/j';

  const { t } = useI18n();

  const BUTTON_DATA: { [name: string]: JButtonInfo } = {
    ADD: {
      text: t('common.action.add'),
      icon: 'icon-plus',
      type: 'primary',
    },
    UPDATE: {
      text: t('common.action.update'),
      icon: '',
      type: 'text',
    },
    UPLOAD: {
      text: t('common.action.upload'),
      icon: 'icon-upload',
      type: 'primary',
    },
  };

  const props = defineProps({
    type: {
      type: String as PropType<JButtonType>,
      default: () => {
        return '';
      },
    },
  });

  const buttonInfo = ref<JButtonInfo>(BUTTON_DATA[props.type] as JButtonInfo);
</script>

<script lang="ts">
  export default {
    name: 'JButton',
  };
</script>
