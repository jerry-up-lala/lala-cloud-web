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
            <a-col :span="14">
              <a-form-item
                field="roleName"
                :label="$t('system.role.roleName')"
                :tooltip="
                  $t('system.role.roleName') + $t('common.info.cannot.repeat')
                "
                :validate-status="roleNameValidateStatus"
                validate-trigger="blur"
                feedback
              >
                <a-input
                  v-model="formModel.roleName"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="20"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="14">
              <a-form-item field="state" :label="$t('system.role.state')">
                <a-switch v-model="formModel.state">
                  <template #checked>
                    {{ $t('common.enum.effective') }}
                  </template>
                  <template #unchecked>
                    {{ $t('common.enum.invalid') }}
                  </template>
                </a-switch>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="14">
              <a-form-item
                field="description"
                :label="$t('system.role.description')"
              >
                <a-input
                  v-model="formModel.description"
                  :placeholder="$t('common.placeholder.input')"
                  :max-length="20"
                  allow-clear
                  show-word-limit
                />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="14">
              <a-form-item field="menuIds" :label="$t('system.role.menuIds')">
                <a-spin
                  :loading="menuTreeLoading"
                  :tip="$t('common.loading.info')"
                >
                  <a-space direction="vertical" fill>
                    <a-space>
                      <a-input-search
                        v-model="menuTreeSearch"
                        :style="{ width: '370px' }"
                        :placeholder="$t('system.menu.query.placeholder')"
                        :loading="menuTreeLoading"
                        search-button
                        allow-clear
                        @search="menuTree"
                      />

                      <a-checkbox @change="menuTreeExpandAll">
                        {{ $t('common.tree.checkbox.expand') }}
                      </a-checkbox>

                      <a-checkbox @change="menuTreeCheckAll">
                        {{ $t('common.tree.checkbox.check') }}
                      </a-checkbox>
                    </a-space>

                    <a-tree
                      ref="menuTreeRef"
                      v-model:checked-keys="formModel.checkedIds"
                      v-model:half-checked-keys="formModel.halfCheckedIds"
                      :checkable="true"
                      :multiple="true"
                      :show-line="true"
                      :only-check-leaf="true"
                      :field-names="{
                        key: 'id',
                        title: 'locale',
                        children: 'children',
                        icon: '_icon',
                      }"
                      :data="menuTreeData"
                      @check="menuTreeCheck"
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
                        <ArcoIcon
                          v-if="node.icon"
                          :icon="node.icon"
                          :size="20"
                        />
                      </template>
                    </a-tree>
                  </a-space>
                </a-spin>
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
  import { ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { Message } from '@arco-design/web-vue';
  import useLoading from '@/hooks/loading';
  import useRouter from '@/hooks/router';
  import { arrayConcat } from '@/utils/array';
  import { apiErrorRMsg } from '@/global/body';
  import {
    roleInfoApi,
    roleVerifyApi,
    roleAddApi,
    roleUpdateApi,
    RoleSaveRequestBody,
  } from '@/api/request/role';
  import { menuListApi } from '@/api/request/menu';

  const { t } = useI18n();

  const { route, tabClose } = useRouter();

  const id = ref<number | null>(
    route.query?.id ? Number(route.query?.id) : null
  );

  const cardTitle = ref<string>(
    id.value
      ? `${t('common.action.update')}(${id.value})`
      : t('common.action.add')
  );

  // 菜单树加载开始
  const menuTreeData = ref<any[]>([]);

  const menuTreeSearch = ref('');

  const menuTreeLoading = ref(false);

  const menuTreeRef = ref();

  /**
   * 菜单树 数据加载
   */
  const menuTree = async () => {
    menuTreeLoading.value = true;
    try {
      const { data } = await menuListApi({ value: menuTreeSearch.value });
      menuTreeData.value = data;
    } catch (err) {
      // catch
    } finally {
      menuTreeLoading.value = false;
    }
  };

  const menuTreeExpandAll = (value: any) => {
    menuTreeRef.value.expandAll(value);
  };

  const menuTreeCheckAll = (value: any) => {
    menuTreeRef.value.checkAll(value);
  };

  const menuTreeCheck = () => {
    formModel.value.menuIds = arrayConcat(
      formModel.value.halfCheckedIds,
      formModel.value.checkedIds
    );
  };

  // 菜单树加载结束

  interface FormModel extends RoleSaveRequestBody {
    id: number | null;
    halfCheckedIds?: number[];
    checkedIds?: number[];
  }

  const formModelDefault = (): FormModel => {
    return {
      id: null,
      roleName: '',
      description: '',
      state: true,
      menuIds: [],
      halfCheckedIds: [],
      checkedIds: [],
    };
  };

  // 加载详情
  const formLoading = ref(false);

  const { loading, setLoading } = useLoading();

  const formRef = ref<FormInstance>();

  const formModel = ref<FormModel>(formModelDefault());

  const roleNameValidateStatus = ref();

  /**
   * 编辑初始化查询
   */
  const updateDefaultRequest = async () => {
    formLoading.value = true;
    try {
      const { data } = await roleInfoApi(id.value);
      formModel.value = {
        ...data,
        id: id.value,
      };
      formModel.value.checkedIds = data.menuIds;
    } catch (err) {
      // catch
    } finally {
      formLoading.value = false;
    }
  };

  // 保存表单规则
  const saveRules = {
    roleName: [
      {
        required: true,
        message: t('system.role.roleName') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg: string) => void
        ) => {
          return new Promise((resolve) => {
            roleNameValidateStatus.value = 'validating';
            roleVerifyApi({
              id: formModel.value?.id,
              value,
            })
              .then((res) => {
                roleNameValidateStatus.value = 'success';
                resolve('');
              })
              .catch((err) => {
                callback(apiErrorRMsg(err));
                roleNameValidateStatus.value = 'error';
                resolve('');
              });
          });
        },
      },
    ],
    state: [
      {
        required: true,
        message: t('system.role.state') + t('common.required.select'),
      },
    ],
    menuIds: [
      {
        required: true,
        message: t('system.role.menuIds') + t('common.required.select'),
      },
    ],
  };

  const formSubmit = async ({
    errors,
  }: {
    errors: Record<string, ValidatedError> | undefined;
  }) => {
    if (loading.value) return;
    if (!errors) {
      formSave();
    }
  };

  const formSave = async () => {
    setLoading(true);
    try {
      if (id.value) {
        await roleUpdateApi(id.value, formModel.value);
        Message.success(t('common.success.update'));
      } else {
        await roleAddApi(formModel.value);
        Message.success(t('common.success.add'));
      }
      formCancel();
    } catch (err) {
      // err
    } finally {
      setLoading(false);
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
    tabClose('Role');
  };

  onMounted(() => {
    menuTree();
    if (id.value) {
      updateDefaultRequest();
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'RoleSave',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
