<template>
  <div class="container">
    <a-card class="general-card" :title="cardTitle">
      <a-space direction="vertical" fill>
        <a-descriptions size="medium" :column="1" bordered>
          <a-descriptions-item :label="$t('system.user.id')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              {{ infoDescData.id }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('system.user.loginName')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              {{ infoDescData.loginName }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('system.user.realName')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              {{ infoDescData.realName }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('system.user.mail')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              {{ infoDescData.mail }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('system.user.nickName')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              {{ infoDescData.nickName }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('system.user.intro')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              {{ infoDescData.intro }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('system.user.state')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              <a-tag :color="infoDescData.state === true ? 'blue' : 'gray'">
                {{
                  stateOptions.find(
                    (item) => `${item?.value}` === `${infoDescData.state}`
                  )?.label
                }}
              </a-tag>
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('system.user.tenantAdmin')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              <a-tag
                :color="infoDescData.tenantAdmin === true ? 'blue' : 'gray'"
              >
                {{
                  booleanOptions.find(
                    (item) => `${item?.value}` === `${infoDescData.tenantAdmin}`
                  )?.label
                }}
              </a-tag>
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('system.user.createTime')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              {{ infoDescData.createTime }}
            </span>
          </a-descriptions-item>
          <a-descriptions-item :label="$t('system.user.role.menu')">
            <a-skeleton v-if="infoSkeleton" :animation="true">
              <a-skeleton-line :rows="1" />
            </a-skeleton>
            <span v-else>
              <a-checkbox @change="menuTreeExpandAll">
                {{ $t('common.tree.checkbox.expand') }}
              </a-checkbox>

              <a-tree
                ref="menuTreeRef"
                :show-line="true"
                :default-expand-all="false"
                :field-names="{
                  key: 'id',
                  title: 'locale',
                  children: 'children',
                  icon: '_icon',
                }"
                :data="infoDescData.menuButtonList"
              >
                <template #title="node">
                  <a-space>
                    {{ $t(node.locale) }}

                    <a-tag :color="node.type === 1 ? 'blue' : 'gray'">
                      {{
                        node.type === 1
                          ? $t('system.menu.type.menu')
                          : $t('system.menu.type.button')
                      }}
                    </a-tag>
                  </a-space>
                </template>

                <template #icon="{ node }">
                  <ArcoIcon v-if="node.icon" :icon="node.icon" :size="20" />
                </template>
              </a-tree>
            </span>
          </a-descriptions-item>
        </a-descriptions>

        <a-space>
          <a-button type="primary" @click="infoRequest()">{{
            $t('common.action.refresh')
          }}</a-button>

          <a-button @click="back()">{{ $t('common.action.back') }}</a-button>
        </a-space>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue';
  import useRouter from '@/hooks/router';
  import { useI18n } from 'vue-i18n';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { stateOptionsData, booleanOptionsData } from '@/data';
  import { userInfoApi } from '@/api/request/user';

  const { t } = useI18n();

  const { route, router } = useRouter();

  const id = ref<string>(route.query?.id ? String(route.query?.id) : '');

  const cardTitle = ref<string>(
    id.value
      ? `${t('common.action.update')}(${id.value})`
      : t('common.action.add')
  );

  const stateOptions = computed<SelectOptionData[]>(() => stateOptionsData());

  const booleanOptions = computed<SelectOptionData[]>(() =>
    booleanOptionsData()
  );

  const infoDescDataDefault = (): any => {
    return {
      id: '',
      loginName: '',
      realName: '',
      createTime: '',
    };
  };

  // 加载详情
  const infoSkeleton = ref(false);
  // 详情表单
  const infoDescData = ref<any>(infoDescDataDefault());
  // 详情树 ref
  const menuTreeRef = ref();
  /**
   * 详情查询
   */
  const infoRequest = async () => {
    infoSkeleton.value = true;
    try {
      const { data } = await userInfoApi(id.value);
      infoDescData.value = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      infoSkeleton.value = false;
    }
  };

  const menuTreeExpandAll = (value: any) => {
    menuTreeRef.value.expandAll(value);
  };

  const back = () => {
    router.push({
      name: 'User',
    });
  };

  onMounted(() => {
    infoRequest();
  });
</script>

<script lang="ts">
  export default {
    name: 'UserInfo',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
