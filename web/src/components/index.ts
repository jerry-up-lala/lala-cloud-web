import { App } from 'vue';
import WebFooter from '@/components/web-footer/index.vue';
import ArcoIcon from '@/components/arco-icon/index.vue';
import IconFont from '@/components/icon-font/index.vue';
import CodeView from '@/components/code-view/index.vue';
import JsonView from '@/components/json-view/index.vue';
import GlobalSetting from '@/components/global-setting/index.vue';
import JTable from '@/components/j-table/index.vue';
import JTag from '@/components/j-tag/index.vue';
import JButton from '@/components/j-button/index.vue';
import JBatchButton from '@/components/j-batch-button/index.vue';
import JQueryForm from '@/components/j-query-form/index.vue';
import JSaveForm from '@/components/j-save-form/index.vue';
import JDelete from '@/components/j-delete/index.vue';
import JUpload from '@/components/j-upload/index.vue';

export default {
  install(app: App) {
    app.component('WebFooter', WebFooter);
    app.component('ArcoIcon', ArcoIcon);
    app.component('IconFont', IconFont);
    app.component('CodeView', CodeView);
    app.component('JsonView', JsonView);
    app.component('GlobalSetting', GlobalSetting);
    app.component('JTable', JTable);
    app.component('JTag', JTag);
    app.component('JButton', JButton);
    app.component('JBatchButton', JBatchButton);
    app.component('JQueryForm', JQueryForm);
    app.component('JSaveForm', JSaveForm);
    app.component('JDelete', JDelete);
    app.component('JUpload', JUpload);
  },
};

export { default as WebFooter } from '@/components/web-footer/index.vue';
export { default as ArcoIcon } from '@/components/arco-icon/index.vue';
export { default as IconFont } from '@/components/icon-font/index.vue';
export { default as CodeView } from '@/components/code-view/index.vue';
export { default as JsonView } from '@/components/json-view/index.vue';
export { default as GlobalSetting } from '@/components/global-setting/index.vue';
export { default as JTable } from '@/components/j-table/index.vue';
export { default as JTag } from '@/components/j-tag/index.vue';
export { default as JButton } from '@/components/j-button/index.vue';
export { default as JBatchButton } from '@/components/j-batch-button/index.vue';
export { default as JQueryForm } from '@/components/j-query-form/index.vue';
export { default as JSaveForm } from '@/components/j-save-form/index.vue';
export { default as JDelete } from '@/components/j-delete/index.vue';
export { default as JUpload } from '@/components/j-upload/index.vue';
