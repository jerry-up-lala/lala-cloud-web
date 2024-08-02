<template>
  <codemirror
    v-model="code"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Codemirror } from 'vue-codemirror';
  import { basicSetup } from 'codemirror';
  import { javascript } from '@codemirror/lang-javascript';
  import { java } from '@codemirror/lang-java';
  import { xml } from '@codemirror/lang-xml';
  import { html } from '@codemirror/lang-html';
  import { json } from '@codemirror/lang-json';
  import { oneDark } from '@codemirror/theme-one-dark';
  import useThemes from '@/hooks/themes';

  const props = defineProps({
    data: {
      type: String,
    },
    lang: {
      type: String,
      default: 'javascript',
    },
  });

  const code = ref(props.data);

  const { isDark } = useThemes();

  const loadExtensions = (): any[] => {
    let langMode = javascript();
    if (props.lang.indexOf('.java') > -1) {
      langMode = java();
    }
    if (props.lang.indexOf('.xml') > -1) {
      langMode = xml();
    }
    if (props.lang.indexOf('.html') > -1 || props.lang.indexOf('.vue') > -1) {
      langMode = html();
    }
    if (props.lang.indexOf('.json') > -1) {
      langMode = json();
    }
    return isDark.value
      ? [basicSetup, langMode, oneDark]
      : [basicSetup, langMode];
  };

  const extensions = loadExtensions();
</script>

<script lang="ts">
  export default {
    name: 'CodeView',
  };
</script>
