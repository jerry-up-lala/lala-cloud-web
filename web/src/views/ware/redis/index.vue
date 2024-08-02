<template>
  <div class="container">
    <a-card class="general-card" :title="$t('menu.ware.redis')">
      <div class="layout-div">
        <a-layout>
          <a-layout-header>
            <a-space direction="horizontal" size="large">
              <a-input-search
                v-model="keysTreePattern"
                v-permission="['REDIS:QUERY']"
                :style="{ width: '600px' }"
                :placeholder="$t('ware.redis.search.pattern')"
                :loading="keysTreeLoading"
                search-button
                allow-clear
                @search="keysTreeRequest"
              >
              </a-input-search>

              <a-button
                v-permission="['REDIS:ADD']"
                type="primary"
                @click="saveKeyCardShow"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('common.action.add') }}
              </a-button>
            </a-space>
          </a-layout-header>

          <a-layout class="layout-height">
            <a-layout-sider :width="keyTableWidth">
              <a-layout class="layout-height">
                <a-layout-sider :width="keyTreeWidth">
                  <a-resize-box
                    v-model:width="keyTreeWidth"
                    :directions="['right']"
                  >
                    <a-tree
                      :data="keysTreeData"
                      show-line
                      block-node
                      @select="keysTreeSelect"
                    >
                      <template #title="nodeData">
                        <icon-folder v-if="nodeData.children" />
                        {{ nodeData?.title }}
                      </template>

                      <template #extra="nodeData">
                        <span style="margin-right: 10px">
                          {{ nodeData.count }}
                        </span>
                      </template>
                    </a-tree>
                  </a-resize-box>
                </a-layout-sider>
                <a-layout-content>
                  <a-resize-box
                    v-model:width="keyTableWidth"
                    :directions="['right']"
                  >
                    <a-empty v-if="keysListData.length === 0">{{
                      t('ware.redis.table.empty')
                    }}</a-empty>
                    <a-table
                      v-else
                      :loading="keysListLoading"
                      :columns="keysListColumns as TableColumnData[]"
                      :data="keysListData"
                      stripe
                      column-resizable
                      table-layout-fixed
                      :bordered="{ cell: true }"
                      :pagination="false"
                    >
                      <template #index="{ rowIndex }">
                        {{ rowIndex + 1 }}
                      </template>

                      <template #dataType="{ record }">
                        <a-space>
                          <a-tag
                            :color="
                              dataTypeOptions.find(
                                (item) =>
                                  `${item?.value}` === `${record.dataType}`
                              )?.tagProps.color
                            "
                            >{{ record.dataType }}
                          </a-tag>
                        </a-space>
                      </template>

                      <template #operate="{ record }">
                        <a-button
                          v-permission="['REDIS:INFO']"
                          type="text"
                          @click="keyInfo(record)"
                          >{{ $t('common.action.info') }}
                        </a-button>

                        <a-button
                          v-permission="['REDIS:EXPIRE']"
                          type="text"
                          @click="expireSaveModalShow(record)"
                          >{{ $t('ware.redis.expire.update') }}
                        </a-button>

                        <a-popconfirm
                          :content="$t('common.confirm.delete')"
                          type="error"
                          :ok-loading="deleteKeyLoading"
                          :on-before-ok="deleteKeyBeforeOk"
                          @show="deleteKeyShow(record)"
                          @ok="keysTreeRequest"
                          @cancel="deleteKeyCancel"
                        >
                          <a-button
                            v-permission="['REDIS:DELETE']"
                            type="text"
                            status="danger"
                            >{{ $t('common.action.delete') }}</a-button
                          >
                        </a-popconfirm>
                      </template>
                    </a-table>
                  </a-resize-box>
                </a-layout-content>
              </a-layout>
            </a-layout-sider>

            <a-layout-content>
              <a-empty v-if="!saveKeyCardInfo.show">{{
                t('ware.redis.info.empty')
              }}</a-empty>

              <a-card v-else :style="{ width: '100%' }">
                <template #extra>
                  <a-button type="text" @click="saveKeyCardHide">
                    <template #icon>
                      <icon-close />
                    </template>
                  </a-button>
                </template>

                <template #title>
                  <a-space v-if="saveKeyCardInfo.add">
                    {{ $t('common.action.add') }}
                  </a-space>
                  <a-space v-else>
                    <a-tag
                      :color="
                        dataTypeOptions.find(
                          (item) =>
                            `${item?.value}` === `${saveKeyCardInfo.dataType}`
                        )?.tagProps.color
                      "
                      >{{ saveKeyCardInfo.dataType }}
                    </a-tag>

                    {{ saveKeyCardInfo.key }}
                  </a-space>
                </template>

                <template #actions>
                  <a-space
                    v-if="
                      !saveKeyCardInfo.add &&
                      saveKeyCardInfo.dataType === 'LIST'
                    "
                  >
                    <a-button
                      v-permission="['REDIS:UPDATE']"
                      type="primary"
                      @click="listActionFormShow(true)"
                    >
                      <template #icon>
                        <icon-plus />
                      </template>
                      <template #default>{{
                        t('common.action.add.element')
                      }}</template>
                    </a-button>

                    <a-button
                      v-permission="['REDIS:UPDATE']"
                      type="primary"
                      status="danger"
                      @click="listActionFormShow(false)"
                    >
                      <template #icon>
                        <icon-delete />
                      </template>
                      <template #default>{{
                        t('common.action.delete.element')
                      }}</template>
                    </a-button>
                  </a-space>

                  <a-space
                    v-if="
                      !saveKeyCardInfo.add && saveKeyCardInfo.dataType === 'SET'
                    "
                  >
                    <a-button
                      v-permission="['REDIS:UPDATE']"
                      type="primary"
                      @click="setAddFormShow"
                    >
                      <template #icon>
                        <icon-plus />
                      </template>
                      <template #default>{{
                        t('common.action.add.member')
                      }}</template>
                    </a-button>
                  </a-space>

                  <a-space
                    v-if="
                      !saveKeyCardInfo.add &&
                      saveKeyCardInfo.dataType === 'ZSET'
                    "
                  >
                    <a-button
                      v-permission="['REDIS:UPDATE']"
                      type="primary"
                      @click="zSetAddFormShow"
                    >
                      <template #icon>
                        <icon-plus />
                      </template>
                      <template #default>{{
                        t('common.action.add.sort.member')
                      }}</template>
                    </a-button>
                  </a-space>

                  <a-space
                    v-if="
                      !saveKeyCardInfo.add &&
                      saveKeyCardInfo.dataType === 'HASH'
                    "
                  >
                    <a-button
                      v-permission="['REDIS:UPDATE']"
                      type="primary"
                      @click="hashAddFormShow"
                    >
                      <template #icon>
                        <icon-plus />
                      </template>
                      <template #default>{{
                        t('common.action.add.field')
                      }}</template>
                    </a-button>
                  </a-space>
                </template>

                <a-form
                  v-if="saveKeyCardInfo.add"
                  ref="addKeyFormRef"
                  :model="addKeyFormModel"
                  :rules="addKeyFormRules"
                  :label-col-props="{ span: 6 }"
                  :wrapper-col-props="{ span: 18 }"
                  @submit="addKeyFormSubmit"
                >
                  <a-row :gutter="16">
                    <a-col :span="22">
                      <a-form-item
                        field="dataType"
                        :label="$t('ware.redis.dataType')"
                        feedback
                      >
                        <a-select
                          v-model="addKeyFormModel.dataType"
                          :options="dataTypeOptions"
                          :placeholder="$t('common.placeholder.select')"
                          allow-search
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>

                  <a-row :gutter="16">
                    <a-col :span="22">
                      <a-form-item
                        field="expire"
                        :label="$t('ware.redis.expire')"
                        feedback
                      >
                        <a-input-number
                          v-model="addKeyFormModel.expire"
                          :placeholder="$t('common.placeholder.input')"
                          allow-clear
                          hide-button
                        >
                          <template #suffix>
                            {{ $t('common.unit.second') }}
                          </template>
                        </a-input-number>
                      </a-form-item>
                    </a-col>
                  </a-row>

                  <a-row :gutter="16">
                    <a-col :span="22">
                      <a-form-item
                        field="key"
                        :label="$t('ware.redis.key')"
                        :validate-status="keyValidateStatus"
                        :validate-trigger="['blur']"
                        :help="$t('ware.redis.key.help')"
                        feedback
                      >
                        <a-input
                          v-model="addKeyFormModel.key"
                          :placeholder="$t('common.placeholder.input')"
                          :max-length="100"
                          allow-clear
                          show-word-limit
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>

                  <a-row
                    v-if="addKeyFormModel.dataType === 'STRING'"
                    :gutter="16"
                  >
                    <a-col :span="22">
                      <a-form-item
                        field="stringValue"
                        :label="$t('ware.redis.value')"
                        feedback
                      >
                        <a-textarea
                          v-model="addKeyFormModel.stringValue"
                          :placeholder="$t('common.placeholder.input')"
                          allow-clear
                        />
                      </a-form-item>
                    </a-col>
                  </a-row>

                  <a-space
                    v-if="addKeyFormModel.dataType === 'LIST'"
                    direction="vertical"
                  >
                    <a-row
                      v-for="(listItem, index) of addKeyFormModel.listValue"
                      :key="index"
                      :gutter="16"
                    >
                      <a-col :span="22">
                        <a-form-item
                          :field="`listValue[${index}]`"
                          :label="$t('ware.redis.list.element') + '-' + index"
                          feedback
                        >
                          <a-input
                            v-model="addKeyFormModel.listValue[index]"
                            :placeholder="$t('common.placeholder.input')"
                            allow-clear
                          />

                          <!-- 最后一个才展示Add -->
                          <a-button
                            v-if="
                              index + 1 === addKeyFormModel.listValue.length
                            "
                            @click="addKeyFormModel.listValue.push('')"
                          >
                            <template #icon>
                              <icon-plus />
                            </template>
                          </a-button>

                          <!-- 第一个不展示Delete -->
                          <a-button
                            v-if="index !== 0"
                            @click="addKeyFormModel.listValue.splice(index, 1)"
                          >
                            <template #icon>
                              <icon-delete />
                            </template>
                          </a-button>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-space>

                  <a-space
                    v-if="addKeyFormModel.dataType === 'SET'"
                    direction="vertical"
                  >
                    <a-row
                      v-for="(setItem, index) of addKeyFormModel.setValue"
                      :key="index"
                      :gutter="16"
                    >
                      <a-col :span="22">
                        <a-form-item
                          :field="`setValue[${index}]`"
                          :label="$t('ware.redis.member') + '-' + index"
                          feedback
                        >
                          <a-input
                            v-model="addKeyFormModel.setValue[index]"
                            :placeholder="$t('common.placeholder.input')"
                            allow-clear
                          />

                          <!-- 最后一个才展示Add -->
                          <a-button
                            v-if="index + 1 === addKeyFormModel.setValue.length"
                            @click="addKeyFormModel.setValue.push('')"
                          >
                            <template #icon>
                              <icon-plus />
                            </template>
                          </a-button>

                          <!-- 第一个不展示Delete -->
                          <a-button
                            v-if="index !== 0"
                            @click="addKeyFormModel.setValue.splice(index, 1)"
                          >
                            <template #icon>
                              <icon-delete />
                            </template>
                          </a-button>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-space>

                  <a-space
                    v-if="addKeyFormModel.dataType === 'ZSET'"
                    direction="vertical"
                  >
                    <a-row
                      v-for="(item, index) of addKeyFormModel.zSetValue"
                      :key="index"
                      :gutter="1"
                    >
                      <a-col :span="12">
                        <a-form-item
                          :field="`zSetValue[${index}].score`"
                          :label="$t('ware.redis.member') + '-' + index"
                          :label-col-props="{ span: 10 }"
                          :wrapper-col-props="{ span: 12 }"
                          :rules="{
                            type: 'number',
                            required: true,
                            message:
                              $t('ware.redis.zset.score') +
                              $t('common.required.enter'),
                          }"
                          feedback
                        >
                          <a-input-number
                            v-model="addKeyFormModel.zSetValue[index].score"
                            :placeholder="
                              $t('common.placeholder.input') +
                              $t('ware.redis.zset.score')
                            "
                            :min="0"
                            :max="1000000000000"
                            allow-clear
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :span="7">
                        <a-form-item
                          :field="`zSetValue[${index}].value`"
                          :label-col-props="{ span: 0 }"
                          :wrapper-col-props="{ span: 22 }"
                          feedback
                        >
                          <a-input
                            v-model="addKeyFormModel.zSetValue[index].value"
                            :placeholder="
                              $t('common.placeholder.input') +
                              $t('ware.redis.member')
                            "
                            allow-clear
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :span="3">
                        <!-- 最后一个才展示Add -->
                        <a-button
                          v-if="index + 1 === addKeyFormModel.zSetValue.length"
                          @click="
                            addKeyFormModel.zSetValue.push({
                              value: '',
                            })
                          "
                        >
                          <template #icon>
                            <icon-plus />
                          </template>
                        </a-button>

                        <!-- 第一个不展示Delete -->
                        <a-button
                          v-if="index !== 0"
                          @click="addKeyFormModel.zSetValue.splice(index, 1)"
                        >
                          <template #icon>
                            <icon-delete />
                          </template>
                        </a-button>
                      </a-col>
                    </a-row>
                  </a-space>

                  <a-space
                    v-if="addKeyFormModel.dataType === 'HASH'"
                    direction="vertical"
                  >
                    <a-row
                      v-for="(hashItem, index) of addKeyFormModel.hashValue"
                      :key="index"
                      :gutter="1"
                    >
                      <a-col :span="9">
                        <a-form-item
                          :field="`hashValue[${index}].field`"
                          :label="$t('ware.redis.hash.field') + '-' + index"
                          :label-col-props="{ span: 8 }"
                          :wrapper-col-props="{ span: 14 }"
                          feedback
                        >
                          <a-input
                            v-model="addKeyFormModel.hashValue[index].field"
                            :placeholder="
                              $t('common.placeholder.input') +
                              $t('ware.redis.hash.field')
                            "
                            allow-clear
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :span="10">
                        <a-form-item
                          :field="`hashValue[${index}].value`"
                          :label-col-props="{ span: 0 }"
                          :wrapper-col-props="{ span: 22 }"
                          feedback
                        >
                          <a-input
                            v-model="addKeyFormModel.hashValue[index].value"
                            :placeholder="
                              $t('common.placeholder.input') +
                              $t('ware.redis.value')
                            "
                            allow-clear
                          />
                        </a-form-item>
                      </a-col>

                      <a-col :span="3">
                        <!-- 最后一个才展示Add -->
                        <a-button
                          v-if="index + 1 === addKeyFormModel.hashValue.length"
                          @click="
                            addKeyFormModel.hashValue.push({
                              field: '',
                              value: '',
                            })
                          "
                        >
                          <template #icon>
                            <icon-plus />
                          </template>
                        </a-button>

                        <!-- 第一个不展示Delete -->
                        <a-button
                          v-if="index !== 0"
                          @click="addKeyFormModel.hashValue.splice(index, 1)"
                        >
                          <template #icon>
                            <icon-delete />
                          </template>
                        </a-button>
                      </a-col>
                    </a-row>
                  </a-space>

                  <a-form-item>
                    <a-space>
                      <a-button
                        type="primary"
                        html-type="submit"
                        :loading="addKeyLoading"
                        >{{ $t('common.action.save') }}
                      </a-button>
                      <a-button @click="addKeyFormModelReset">{{
                        $t('common.action.reset')
                      }}</a-button>
                      <a-button @click="saveKeyCardHide">{{
                        $t('common.action.cancel')
                      }}</a-button>
                    </a-space>
                  </a-form-item>
                </a-form>

                <a-form
                  v-if="
                    !saveKeyCardInfo.add &&
                    saveKeyCardInfo.dataType === 'STRING'
                  "
                  ref="updateKeyStringFormRef"
                  :model="updateKeyInfo"
                  :label-col-props="{ span: 6 }"
                  :wrapper-col-props="{ span: 18 }"
                  @submit="updateKeyStringFormSubmit"
                >
                  <a-spin
                    :loading="updateKeyInfoDataLoading"
                    :tip="$t('common.loading.info')"
                  >
                    <a-row :gutter="16">
                      <a-col :span="22">
                        <a-form-item
                          field="stringValue"
                          :label="$t('ware.redis.value')"
                        >
                          <a-textarea
                            v-model="updateKeyInfo.stringValue"
                            :placeholder="$t('common.placeholder.input')"
                            allow-clear
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>

                    <a-form-item>
                      <a-space>
                        <a-button
                          v-permission="['REDIS:UPDATE']"
                          type="primary"
                          html-type="submit"
                          :loading="updateKeyStringLoading"
                          >{{ $t('common.action.update.value') }}</a-button
                        >
                        <a-button
                          @click="
                            keyInfo({
                              key: saveKeyCardInfo.key,
                            })
                          "
                          >{{ $t('common.action.reset') }}</a-button
                        >
                        <a-button @click="saveKeyCardHide">{{
                          $t('common.action.cancel')
                        }}</a-button>
                      </a-space>
                    </a-form-item>
                  </a-spin>
                </a-form>

                <a-row
                  v-if="
                    !saveKeyCardInfo.add && saveKeyCardInfo.dataType === 'LIST'
                  "
                  :gutter="16"
                >
                  <a-space direction="vertical">
                    <a-table
                      :data="updateKeyInfo.listValue"
                      stripe
                      column-resizable
                      table-layout-fixed
                      :bordered="{ cell: true }"
                      :scroll="{ y: 500 }"
                      :pagination="false"
                      :loading="updateKeyInfoDataLoading"
                    >
                      <template #columns>
                        <a-table-column
                          :title="$t('common.index')"
                          data-index="index"
                          :width="65"
                          ellipsis
                          tooltip
                        ></a-table-column>
                        <a-table-column
                          :title="$t('ware.redis.list.element')"
                          data-index="value"
                          ellipsis
                          tooltip
                        ></a-table-column>
                        <a-table-column
                          :title="$t('common.action.operate')"
                          :width="110"
                        >
                          <template #cell="{ record }">
                            <a-button
                              v-permission="['REDIS:UPDATE']"
                              type="text"
                              @click="listUpdateModalShow(record)"
                              >{{ $t('common.action.update.element') }}
                            </a-button>
                          </template>
                        </a-table-column>
                      </template>
                    </a-table>

                    <a-form
                      v-if="listActionFormVisible"
                      ref="listActionFormRef"
                      :model="listActionFormModel"
                      :label-col-props="{ span: 5 }"
                      :wrapper-col-props="{ span: 19 }"
                      @submit="listActionFormSubmit"
                    >
                      <a-row :gutter="16">
                        <a-col :span="22">
                          <a-form-item
                            field="pushType"
                            :label="
                              listActionFormModel.add
                                ? $t('ware.redis.list.add.pushType')
                                : $t('ware.redis.list.delete.pushType')
                            "
                            feedback
                            :rules="{
                              type: 'number',
                              required: true,
                              message: listActionFormModel.add
                                ? $t('ware.redis.list.add.pushType')
                                : $t('ware.redis.list.delete.pushType') +
                                  t('common.required.select'),
                            }"
                          >
                            <a-select
                              v-model="listActionFormModel.pushType"
                              :options="listPushTypeOptions"
                              :placeholder="$t('common.placeholder.select')"
                            />
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-row v-if="listActionFormModel.add" :gutter="16">
                        <a-col :span="22">
                          <a-form-item
                            field="value"
                            :label="$t('ware.redis.value')"
                            feedback
                          >
                            <a-textarea
                              v-model="listActionFormModel.value"
                              :placeholder="$t('common.placeholder.input')"
                              allow-clear
                            />
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-row v-else :gutter="16">
                        <a-col :span="22">
                          <a-form-item
                            field="count"
                            :label="$t('ware.redis.list.count')"
                            feedback
                            :rules="{
                              type: 'number',
                              required: true,
                              message:
                                t('ware.redis.list.count') +
                                t('common.required.enter'),
                            }"
                          >
                            <a-input-number
                              v-model="listActionFormModel.count"
                              :placeholder="$t('common.placeholder.input')"
                              :min="0"
                              :max="
                                updateKeyInfo.listValue
                                  ? updateKeyInfo.listValue.length - 1 > 0
                                    ? updateKeyInfo.listValue.length - 1
                                    : 0
                                  : 0
                              "
                              allow-clear
                            />
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-form-item>
                        <a-space>
                          <a-button
                            type="primary"
                            html-type="submit"
                            :loading="listLoading"
                            >{{ $t('common.action.save') }}
                          </a-button>
                          <a-button @click="listActionFormReset">
                            {{ $t('common.action.reset') }}
                          </a-button>
                          <a-button @click="listActionFormHide">{{
                            $t('common.action.cancel')
                          }}</a-button>
                        </a-space>
                      </a-form-item>
                    </a-form>
                  </a-space>
                </a-row>

                <a-row
                  v-if="
                    !saveKeyCardInfo.add && saveKeyCardInfo.dataType === 'SET'
                  "
                  :gutter="16"
                >
                  <a-space direction="vertical">
                    <a-table
                      :data="updateKeyInfo.setValue"
                      stripe
                      column-resizable
                      table-layout-fixed
                      :bordered="{ cell: true }"
                      :scroll="{ y: 500 }"
                      :pagination="false"
                      :loading="updateKeyInfoDataLoading"
                    >
                      <template #columns>
                        <a-table-column
                          :title="$t('ware.redis.member')"
                          data-index="value"
                          ellipsis
                          tooltip
                        ></a-table-column>
                        <a-table-column
                          :title="$t('common.action.operate')"
                          :width="120"
                        >
                          <template #cell="{ record }">
                            <a-popconfirm
                              :content="$t('common.confirm.delete')"
                              type="error"
                              :ok-loading="setDeleteLoading"
                              :on-before-ok="setDeleteBeforeOk"
                              @show="setDeleteShow(record)"
                              @ok="keysTreeRequest"
                              @cancel="setDeleteCancel"
                            >
                              <a-button
                                v-permission="['REDIS:UPDATE']"
                                type="text"
                                status="danger"
                                >{{
                                  $t('common.action.delete.member')
                                }}</a-button
                              >
                            </a-popconfirm>
                          </template>
                        </a-table-column>
                      </template>
                    </a-table>

                    <a-form
                      v-if="setAddFormVisible"
                      ref="setAddFormRef"
                      :model="setAddFormModel"
                      :label-col-props="{ span: 1 }"
                      :wrapper-col-props="{ span: 23 }"
                      @submit="setAddFormSubmit"
                    >
                      <a-row
                        v-for="(item, index) of setAddFormModel.value"
                        :key="index"
                        :gutter="16"
                      >
                        <a-col :span="22">
                          <a-form-item :field="`value[${index}]`" feedback>
                            <a-input
                              v-model="setAddFormModel.value[index]"
                              :placeholder="$t('common.placeholder.input')"
                              allow-clear
                            />

                            <!-- 最后一个才展示Add -->
                            <a-button
                              v-if="index + 1 === setAddFormModel.value.length"
                              @click="setAddFormModel.value.push('')"
                            >
                              <template #icon>
                                <icon-plus />
                              </template>
                            </a-button>

                            <!-- 第一个不展示Delete -->
                            <a-button
                              v-if="index !== 0"
                              @click="setAddFormModel.value.splice(index, 1)"
                            >
                              <template #icon>
                                <icon-delete />
                              </template>
                            </a-button>
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-form-item>
                        <a-space>
                          <a-button
                            type="primary"
                            html-type="submit"
                            :loading="setAddLoading"
                            >{{ $t('common.action.save') }}
                          </a-button>

                          <a-button @click="setAddFormReset">
                            {{ $t('common.action.reset') }}
                          </a-button>

                          <a-button @click="setAddFormHide">
                            {{ $t('common.action.cancel') }}
                          </a-button>
                        </a-space>
                      </a-form-item>
                    </a-form>
                  </a-space>
                </a-row>

                <a-row
                  v-if="
                    !saveKeyCardInfo.add && saveKeyCardInfo.dataType === 'ZSET'
                  "
                  :gutter="16"
                >
                  <a-space direction="vertical">
                    <a-table
                      :data="updateKeyInfo.zSetValue"
                      stripe
                      column-resizable
                      table-layout-fixed
                      :bordered="{ cell: true }"
                      :scroll="{ y: 500 }"
                      :pagination="false"
                      :loading="updateKeyInfoDataLoading"
                    >
                      <template #columns>
                        <a-table-column
                          :title="$t('ware.redis.member')"
                          data-index="value"
                          ellipsis
                          tooltip
                        ></a-table-column>
                        <a-table-column
                          :title="$t('ware.redis.zset.score')"
                          data-index="score"
                          :width="100"
                          ellipsis
                          tooltip
                          :sortable="tableSortField('score')"
                        ></a-table-column>
                        <a-table-column
                          :title="$t('common.action.operate')"
                          :width="270"
                        >
                          <template #cell="{ record }">
                            <a-button
                              v-permission="['REDIS:UPDATE']"
                              type="text"
                              @click="zSetUpdateModalShow(record)"
                              >{{ $t('common.action.update.sort.member') }}
                            </a-button>

                            <a-popconfirm
                              :content="$t('common.confirm.delete')"
                              type="error"
                              :ok-loading="zSetDeleteLoading"
                              :on-before-ok="zSetDeleteBeforeOk"
                              @show="zSetdeleteShow(record)"
                              @cancel="zSetDeleteCancel"
                            >
                              <a-button
                                v-permission="['REDIS:UPDATE']"
                                type="text"
                                status="danger"
                                >{{
                                  $t('common.action.delete.sort.member')
                                }}</a-button
                              >
                            </a-popconfirm>
                          </template>
                        </a-table-column>
                      </template>
                    </a-table>

                    <a-form
                      v-if="zSetAddFormVisible"
                      ref="zSetAddFormRef"
                      :model="zSetAddFormModel"
                      :label-col-props="{ span: 1 }"
                      :wrapper-col-props="{ span: 23 }"
                      @submit="zSetAddFormSubmit"
                    >
                      <a-row
                        v-for="(item, index) of zSetAddFormModel.value"
                        :key="index"
                        :gutter="1"
                      >
                        <a-col :span="7">
                          <a-form-item
                            :field="`value[${index}].score`"
                            :label-col-props="{ span: 4 }"
                            :wrapper-col-props="{ span: 20 }"
                            :rules="{
                              type: 'number',
                              required: true,
                              message:
                                $t('ware.redis.zset.score') +
                                $t('common.required.enter'),
                            }"
                            feedback
                          >
                            <a-input-number
                              v-model="zSetAddFormModel.value[index].score"
                              :placeholder="
                                $t('common.placeholder.input') +
                                $t('ware.redis.zset.score')
                              "
                              :min="0"
                              :max="1000000000000"
                              allow-clear
                            />
                          </a-form-item>
                        </a-col>

                        <a-col :span="14">
                          <a-form-item
                            :field="`value[${index}].value`"
                            feedback
                          >
                            <a-input
                              v-model="zSetAddFormModel.value[index].value"
                              :placeholder="
                                $t('common.placeholder.input') +
                                $t('ware.redis.member')
                              "
                              allow-clear
                            />
                          </a-form-item>
                        </a-col>

                        <a-col :span="3">
                          <!-- 最后一个才展示Add -->
                          <a-button
                            v-if="index + 1 === zSetAddFormModel.value.length"
                            @click="
                              zSetAddFormModel.value.push({
                                value: '',
                              })
                            "
                          >
                            <template #icon>
                              <icon-plus />
                            </template>
                          </a-button>

                          <!-- 第一个不展示Delete -->
                          <a-button
                            v-if="index !== 0"
                            @click="zSetAddFormModel.value.splice(index, 1)"
                          >
                            <template #icon>
                              <icon-delete />
                            </template>
                          </a-button>
                        </a-col>
                      </a-row>

                      <a-form-item>
                        <a-space>
                          <a-button
                            type="primary"
                            html-type="submit"
                            :loading="zSetAddLoading"
                            >{{ $t('common.action.save') }}
                          </a-button>

                          <a-button @click="zSetAddFormReset">
                            {{ $t('common.action.reset') }}
                          </a-button>

                          <a-button @click="zSetAddFormHide">{{
                            $t('common.action.cancel')
                          }}</a-button>
                        </a-space>
                      </a-form-item>
                    </a-form>
                  </a-space>
                </a-row>

                <a-row
                  v-if="
                    !saveKeyCardInfo.add && saveKeyCardInfo.dataType === 'HASH'
                  "
                  :gutter="16"
                >
                  <a-space direction="vertical">
                    <a-table
                      :data="updateKeyInfo.hashValue"
                      stripe
                      column-resizable
                      table-layout-fixed
                      :bordered="{ cell: true }"
                      :scroll="{ y: 500 }"
                      :pagination="false"
                      :loading="updateKeyInfoDataLoading"
                    >
                      <template #columns>
                        <a-table-column
                          :title="$t('ware.redis.hash.field')"
                          data-index="field"
                          :width="100"
                          ellipsis
                          tooltip
                        ></a-table-column>
                        <a-table-column
                          :title="$t('ware.redis.value')"
                          data-index="value"
                          ellipsis
                          tooltip
                        ></a-table-column>
                        <a-table-column
                          :title="$t('common.action.operate')"
                          :width="220"
                        >
                          <template #cell="{ record }">
                            <a-button
                              v-permission="['REDIS:UPDATE']"
                              type="text"
                              @click="hashUpdateModalShow(record)"
                              >{{ $t('common.action.update.field') }}
                            </a-button>

                            <a-popconfirm
                              :content="$t('common.confirm.delete')"
                              type="error"
                              :ok-loading="hashDeleteLoading"
                              :on-before-ok="hashDeleteBeforeOk"
                              @show="hashDeleteShow(record)"
                              @cancel="hashDeleteCancel"
                            >
                              <a-button
                                v-permission="['REDIS:UPDATE']"
                                type="text"
                                status="danger"
                                >{{
                                  $t('common.action.delete.field')
                                }}</a-button
                              >
                            </a-popconfirm>
                          </template>
                        </a-table-column>
                      </template>
                    </a-table>

                    <a-form
                      v-if="hashAddFormVisible"
                      ref="hashAddFormRef"
                      :model="hashAddFormModel"
                      :label-col-props="{ span: 1 }"
                      :wrapper-col-props="{ span: 23 }"
                      @submit="hashAddFormSubmit"
                    >
                      <a-row
                        v-for="(item, index) of hashAddFormModel.value"
                        :key="index"
                        :gutter="1"
                      >
                        <a-col :span="6">
                          <a-form-item
                            :field="`value[${index}].field`"
                            feedback
                          >
                            <a-input
                              v-model="hashAddFormModel.value[index].field"
                              :placeholder="
                                $t('common.placeholder.input') +
                                $t('ware.redis.hash.field')
                              "
                              allow-clear
                            />
                          </a-form-item>
                        </a-col>

                        <a-col :span="15">
                          <a-form-item
                            :field="`value[${index}].value`"
                            feedback
                          >
                            <a-input
                              v-model="hashAddFormModel.value[index].value"
                              :placeholder="
                                $t('common.placeholder.input') +
                                $t('ware.redis.value')
                              "
                              allow-clear
                            />
                          </a-form-item>
                        </a-col>

                        <a-col :span="3">
                          <!-- 最后一个才展示Add -->
                          <a-button
                            v-if="index + 1 === hashAddFormModel.value.length"
                            @click="
                              hashAddFormModel.value.push({
                                field: '',
                                value: '',
                              })
                            "
                          >
                            <template #icon>
                              <icon-plus />
                            </template>
                          </a-button>

                          <!-- 第一个不展示Delete -->
                          <a-button
                            v-if="index !== 0"
                            @click="hashAddFormModel.value.splice(index, 1)"
                          >
                            <template #icon>
                              <icon-delete />
                            </template>
                          </a-button>
                        </a-col>
                      </a-row>

                      <a-form-item>
                        <a-space>
                          <a-button
                            type="primary"
                            html-type="submit"
                            :loading="hashAddLoading"
                            >{{ $t('common.action.save') }}
                          </a-button>
                          <a-button @click="hashAddFormReset">
                            {{ $t('common.action.reset') }}
                          </a-button>
                          <a-button @click="hashAddFormHide">{{
                            $t('common.action.cancel')
                          }}</a-button>
                        </a-space>
                      </a-form-item>
                    </a-form>
                  </a-space>
                </a-row>
              </a-card>
            </a-layout-content>
          </a-layout>
        </a-layout>
      </div>

      <!-- 编辑有效期表单 -->
      <a-modal
        v-model:visible="expireSaveModalVisible"
        :title="$t('common.action.update') + $t('ware.redis.expire')"
        title-align="start"
        width="auto"
        draggable
        :ok-loading="expireSaveLoading"
        :on-before-ok="expireSaveBeforeOk"
        @ok="keysList"
        @cancel="expireSaveCancel"
      >
        <a-spin :loading="expireLoading" :tip="$t('common.loading.info')">
          <a-form
            ref="expireSaveFormRef"
            :model="expireSaveFormModel"
            :style="{ width: '600px' }"
          >
            <a-form-item field="key" :label="$t('ware.redis.key')" feedback>
              <a-input v-model="expireSaveFormModel.key" disabled />
            </a-form-item>

            <a-form-item
              field="value"
              :label="$t('ware.redis.expire')"
              :extra="$t('ware.redis.expire.extra')"
              feedback
            >
              <a-input-number
                v-model="expireSaveFormModel.value"
                :placeholder="$t('common.placeholder.input')"
                allow-clear
                hide-button
              >
                <template #suffix>
                  {{ $t('common.unit.second') }}
                </template>
              </a-input-number>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>

      <!-- 编辑List元素表单 -->
      <a-modal
        v-model:visible="listUpdateModalVisible"
        :title="
          $t('common.action.update') +
          $t('ware.redis.list.element') +
          $t('ware.redis.value')
        "
        title-align="start"
        width="auto"
        draggable
        :ok-loading="listUpdateLoading"
        :on-before-ok="listUpdateBeforeOk"
        @ok="listUpdateOk"
        @cancel="listUpdateCancel"
      >
        <a-form
          ref="listUpdateFormRef"
          :model="listUpdateFormModel"
          :style="{ width: '600px' }"
        >
          <a-form-item field="key" :label="$t('ware.redis.key')" feedback>
            <a-input v-model="saveKeyCardInfo.key" disabled />
          </a-form-item>

          <a-form-item
            field="index"
            :label="$t('common.index')"
            feedback
            :rules="{
              type: 'number',
              required: true,
              message: 'index' + t('common.required.enter'),
            }"
          >
            <a-input-number
              v-model="listUpdateFormModel.index"
              :placeholder="$t('common.placeholder.input')"
              hide-button
              disabled
            >
            </a-input-number>
          </a-form-item>

          <a-form-item field="value" :label="$t('ware.redis.value')" feedback>
            <a-textarea
              v-model="listUpdateFormModel.value"
              :placeholder="$t('common.placeholder.input')"
              allow-clear
            />
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 编辑ZSet分数表单 -->
      <a-modal
        v-model:visible="zSetUpdateModalVisible"
        :title="$t('common.action.update') + $t('ware.redis.zset.score')"
        title-align="start"
        width="auto"
        draggable
        :ok-loading="zSetUpdateLoading"
        :on-before-ok="zSetUpdateBeforeOk"
        @ok="zSetUpdateOk"
        @cancel="zSetUpdateCancel"
      >
        <a-form
          ref="zSetUpdateFormRef"
          :model="zSetUpdateFormModel"
          :style="{ width: '600px' }"
        >
          <a-form-item field="key" :label="$t('ware.redis.key')" feedback>
            <a-input v-model="saveKeyCardInfo.key" disabled />
          </a-form-item>

          <a-form-item field="value" :label="$t('ware.redis.member')" feedback>
            <a-textarea v-model="zSetUpdateFormModel.value" disabled />
          </a-form-item>

          <a-form-item
            field="score"
            :label="$t('ware.redis.zset.score')"
            feedback
            :rules="{
              type: 'number',
              required: true,
              message: $t('ware.redis.zset.score') + t('common.required.enter'),
            }"
          >
            <a-input-number
              v-model="zSetUpdateFormModel.score"
              :placeholder="
                $t('common.placeholder.input') + $t('ware.redis.zset.score')
              "
              hide-button
            >
            </a-input-number>
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 编辑Hash值表单 -->
      <a-modal
        v-model:visible="hashUpdateModalVisible"
        :title="
          $t('common.action.update') +
          $t('ware.redis.hash.field') +
          $t('ware.redis.value')
        "
        title-align="start"
        width="auto"
        draggable
        :ok-loading="hashUpdateLoading"
        :on-before-ok="hashUpdateBeforeOk"
        @ok="hashUpdateOk"
        @cancel="hashUpdateCancel"
      >
        <a-form
          ref="hashUpdateFormRef"
          :model="hashUpdateFormModel"
          :style="{ width: '600px' }"
        >
          <a-form-item field="key" :label="$t('ware.redis.key')" feedback>
            <a-input v-model="saveKeyCardInfo.key" disabled />
          </a-form-item>

          <a-form-item
            field="field"
            :label="$t('ware.redis.hash.field')"
            feedback
          >
            <a-input v-model="hashUpdateFormModel.field" disabled />
          </a-form-item>

          <a-form-item field="value" :label="$t('ware.redis.value')" feedback>
            <a-textarea
              v-model="hashUpdateFormModel.value"
              :placeholder="$t('common.placeholder.input')"
              allow-clear
            />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { dataTypeOptionsData, listPushTypeOptionsData } from '@/data/redis';
  import { DataBody, apiErrorRMsg } from '@/global/body';
  import { jsonParse } from '@/utils/json';
  import { tableSortField } from '@/global/table';
  import {
    keysTreeApi,
    keysListApi,
    keyExpireInfoApi,
    keySetExpireApi,
    keyDeleteApi,
    keyInfoApi,
    hasKeyApi,
    keyAddApi,
    keyStringUpdateApi,
    keyListAddApi,
    keyListUpdateApi,
    keyListDeleteApi,
    keySetDeleteApi,
    keySetAddApi,
    keyZSetAddApi,
    keyZSetScoreApi,
    keyZSetDeleteApi,
    keyHashAddApi,
    keyHashUpdateApi,
    keyHashDeleteApi,
    KeyInfoBody,
    KeyInfoZSetBody,
    KeyInfoHashBody,
    KeyListResponseBody,
    KeyInfoListUpdateRequestBody,
  } from '@/api/request/redis';
  import type {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { Message } from '@arco-design/web-vue';

  const { t } = useI18n();

  const dataTypeOptions = computed<SelectOptionData[]>(() =>
    dataTypeOptionsData()
  );

  const listPushTypeOptions = computed<SelectOptionData[]>(() =>
    listPushTypeOptionsData(t)
  );

  // 树宽度
  const keyTreeWidth = ref(250);

  // 表格宽度
  const keyTableWidth = ref(950);

  // =========== key树开始 ===========
  const keysTreePattern = ref('*');

  const keysTreeLoading = ref(false);

  const keysTreeData = ref<any[]>([]);

  const keysTreeRequest = async () => {
    keysTreeLoading.value = true;
    try {
      const { data } = await keysTreeApi(keysTreePattern.value);
      keysTreeData.value = data;
      keysList();
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      keysTreeLoading.value = false;
    }
  };
  // =========== key树结束 ===========

  // =========== key列表开始 ===========
  const keysListPattern = ref('');

  const keysListLoading = ref(false);

  const keysListData = ref<KeyListResponseBody[]>([]);

  const keysListColumns = computed(() => [
    {
      title: '#',
      dataIndex: 'index',
      slotName: 'index',
      width: 65,
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('ware.redis.dataType'),
      dataIndex: 'dataType',
      slotName: 'dataType',
      width: 120,
      ellipsis: true,
      tooltip: true,
      filterable: {
        filters: dataTypeOptions.value.map((item) => {
          return {
            text: item.label,
            value: item.value,
          };
        }),
        filter: (value: string[], record: TableData): boolean =>
          value.includes(record.dataType),
        multiple: true,
      },
    },
    {
      title: t('ware.redis.key'),
      dataIndex: 'key',
      slotName: 'key',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: t('ware.redis.expire'),
      dataIndex: 'expireFormat',
      slotName: 'expireFormat',
      ellipsis: true,
      tooltip: true,
      sortable: tableSortField('expire'),
    },
    {
      title: t('common.action.operate'),
      slotName: 'operate',
      width: 265,
      fixed: 'right',
    },
  ]);

  const keysTreeSelect = async (newSelectedKeys: Array<string | number>) => {
    keysListPattern.value = `${newSelectedKeys[0] as string}*`;
    keysList();
  };

  const keysList = async () => {
    if (keysListPattern.value) {
      keysListLoading.value = true;
      try {
        const { data } = await keysListApi(keysListPattern.value);
        keysListData.value = data;
      } catch (err) {
        // you can report use errorHandler or other
      } finally {
        keysListLoading.value = false;
      }
    }
  };
  // =========== key列表结束 ===========

  // =========== 编辑有效期开始 ===========

  interface ExpireSaveModelData {
    key: string;
    value?: number;
  }

  // 是否显示保存表单
  const expireSaveModalVisible = ref(false);
  // 保存表单加载
  const expireLoading = ref(false);
  // 保存按钮加载
  const expireSaveLoading = ref(false);
  // 保存ref
  const expireSaveFormRef = ref<FormInstance>();

  const expireSaveFormModelDefault = (): ExpireSaveModelData => {
    return {
      key: '',
    };
  };

  // 保存表单
  const expireSaveFormModel = ref<ExpireSaveModelData>(
    expireSaveFormModelDefault()
  );

  const expireSaveModalShow = async (record: KeyListResponseBody) => {
    expireLoading.value = true;
    try {
      const { data } = await keyExpireInfoApi(record.key);
      expireSaveFormModel.value = {
        key: record.key,
        value: data,
      };
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      expireLoading.value = false;
    }
    expireSaveModalVisible.value = true;
  };

  const expireSaveCancel = () => {
    expireSaveModalVisible.value = false;
    expireSaveFormRef.value?.resetFields();
  };

  const expireSaveBeforeOk = async () => {
    if (expireSaveLoading.value) {
      return false;
    }
    const res = await expireSaveFormRef.value?.validate();
    if (res) {
      return false;
    }
    expireSaveLoading.value = true;
    try {
      const { key, ...requestBody } = expireSaveFormModel.value;
      await keySetExpireApi(key, {
        value: requestBody.value ? requestBody.value : null,
      });
      Message.success(t('common.success.update'));
      return true;
    } catch (err) {
      return false;
    } finally {
      expireSaveLoading.value = false;
    }
  };

  // =========== 编辑有效期结束 ===========

  // =========== 删除开始 ===========
  // 删除按钮加载
  const deleteKeyLoading = ref(false);
  // 删除ID
  const deleteKey = ref('');

  const deleteKeyShow = (record: any) => {
    deleteKey.value = record.key;
  };

  const deleteKeyCancel = () => {
    deleteKey.value = '';
  };

  const deleteKeyBeforeOk = async () => {
    if (deleteKeyLoading.value) {
      return false;
    }
    deleteKeyLoading.value = true;
    try {
      await keyDeleteApi(deleteKey.value);
      deleteKey.value = '';
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      deleteKeyLoading.value = false;
    }
  };
  // =========== 删除结束 ===========

  // =========== 卡片信息开始 ===========
  interface SaveKeyCardInfoData {
    show: boolean;
    add: boolean;
    key: string;
    dataType: string;
  }

  const saveKeyCardInfoDefault = (): SaveKeyCardInfoData => {
    return {
      show: false,
      add: true,
      key: '',
      dataType: '',
    };
  };

  const saveKeyCardInfo = ref<SaveKeyCardInfoData>(saveKeyCardInfoDefault());

  const saveKeyCardShow = () => {
    saveKeyDefault(true);
  };

  const saveKeyCardHide = () => {
    saveKeyDefault(false);
  };

  const saveKeyDefault = (show: boolean) => {
    saveKeyCardInfo.value = saveKeyCardInfoDefault();
    addKeyFormModel.value = addKeyFormModelDefault();
    keyValidateStatus.value = '';
    updateKeyInfo.value = {};
    saveKeyCardInfo.value.show = show;
  };

  // =========== 卡片信息结束 ===========

  // =========== 新增开始 ===========
  interface AddKeyZSetFormModelData {
    value: string;
    score?: number;
  }

  interface AddKeyHashFormModelData {
    field: string;
    value: string;
  }

  interface AddKeyFormModelData extends KeyInfoBody {
    stringValue?: string;
    listValue: string[];
    setValue: string[];
    zSetValue: AddKeyZSetFormModelData[];
    hashValue: AddKeyHashFormModelData[];
  }

  const addKeyFormModelDefault = (): AddKeyFormModelData => {
    return {
      dataType: 'STRING',
      key: '',
      value: '',
      stringValue: '',
      listValue: [''],
      setValue: [''],
      zSetValue: [
        {
          value: '',
        },
      ],
      hashValue: [
        {
          field: '',
          value: '',
        },
      ],
    };
  };

  const keyValidateStatus = ref();

  const addKeyLoading = ref(false);

  const addKeyFormRef = ref<FormInstance>();

  const addKeyFormModel = ref<AddKeyFormModelData>(addKeyFormModelDefault());

  const addKeyFormRules = {
    dataType: [
      {
        required: true,
        message: t('ware.redis.dataType') + t('common.required.select'),
      },
    ],
    key: [
      {
        required: true,
        message: t('ware.redis.key') + t('common.required.enter'),
      },
      {
        validator: (
          value: string,
          callback: (apiErrorRMsg: string) => void
        ) => {
          return new Promise((resolve) => {
            keyValidateStatus.value = 'validating';
            hasKeyApi(value)
              .then((res) => {
                if (res.data) {
                  keyValidateStatus.value = 'error';
                  callback(t('ware.redis.key.exists'));
                  resolve('');
                } else {
                  keyValidateStatus.value = 'success';
                  resolve('');
                }
              })
              .catch((err) => {
                callback(apiErrorRMsg(err));
                keyValidateStatus.value = 'error';
                resolve('');
              });
          });
        },
      },
    ],
  };

  const addKeyFormModelReset = () => {
    addKeyFormRef.value?.resetFields();
  };

  const addKeyFormSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (addKeyLoading.value) return;
    if (!errors) {
      addKeyLoading.value = true;
      try {
        if (values.dataType === 'STRING' && values.stringValue) {
          values.value = jsonParse(values.stringValue);
        }
        if (values.dataType === 'LIST' && values.listValue) {
          values.value = values.listValue.map((item: string) =>
            jsonParse(item)
          );
        }
        if (values.dataType === 'SET' && values.setValue) {
          values.value = values.setValue.map((item: string) => jsonParse(item));
        }
        if (values.dataType === 'ZSET' && values.zSetValue) {
          values.value = values.zSetValue.map(
            (item: AddKeyZSetFormModelData) => {
              return {
                value: jsonParse(item.value),
                score: item.score,
              };
            }
          );
        }
        if (values.dataType === 'HASH' && values.hashValue) {
          values.value = values.hashValue.map(
            (item: AddKeyHashFormModelData) => {
              return {
                field: item.field,
                value: jsonParse(item.value),
              };
            }
          );
        }
        const {
          stringValue,
          listValue,
          setValue,
          zSetValue,
          hashValue,
          ...redisKeyInfo
        } = values;
        await keyAddApi(redisKeyInfo as KeyInfoBody);
        Message.success(t('common.success.add'));
        saveKeyCardHide();
        keysTreeRequest();
        keysList();
      } catch (err) {
        // err
      } finally {
        addKeyLoading.value = false;
      }
    }
  };

  // =========== 新增结束 ===========

  // =========== 编辑开始 ===========
  interface updateKeyInfoData {
    stringValue?: string;
    listValue?: any[];
    setValue?: any[];
    zSetValue?: any[];
    hashValue?: any[];
    value?: any | any[];
  }

  const updateKeyInfoDataLoading = ref(false);

  const updateKeyInfo = ref<updateKeyInfoData>({});

  const updateKeyStringLoading = ref(false);
  const updateKeyStringFormRef = ref<FormInstance>();

  const updateKeyInfoDataLoad = (data: KeyInfoBody) => {
    if (data) {
      saveKeyCardInfo.value = {
        show: true,
        add: false,
        key: data.key,
        dataType: data.dataType,
      };
      updateKeyInfo.value = data;
      if (data.dataType === 'STRING') {
        updateKeyInfo.value.stringValue = JSON.stringify(data.value);
      }
      if (data.dataType === 'LIST') {
        updateKeyInfo.value.listValue = (data.value as Array<any>).map(
          (item: any, index: number) => {
            return {
              index,
              key: data.key,
              value: JSON.stringify(item),
            };
          }
        );
      }
      if (data.dataType === 'SET') {
        updateKeyInfo.value.setValue = (data.value as Array<any>).map(
          (item: any) => {
            return {
              value: JSON.stringify(item),
            };
          }
        );
      }
      if (data.dataType === 'ZSET') {
        updateKeyInfo.value.zSetValue = (
          data.value as Array<KeyInfoZSetBody>
        ).map((item: KeyInfoZSetBody) => {
          return {
            value: JSON.stringify(item.value),
            score: item.score,
          };
        });
      }
      if (data.dataType === 'HASH') {
        updateKeyInfo.value.hashValue = (
          data.value as Array<KeyInfoHashBody>
        ).map((item: KeyInfoHashBody) => {
          return {
            value: JSON.stringify(item.value),
            field: item.field,
          };
        });
      }
    } else {
      saveKeyCardInfo.value = saveKeyCardInfoDefault();
    }
  };

  const keyInfo = async (record: any) => {
    updateKeyInfoDataLoading.value = true;
    try {
      const { data } = await keyInfoApi(record.key);
      updateKeyInfoDataLoad(data);
    } catch (err) {
      //
    } finally {
      updateKeyInfoDataLoading.value = false;
    }
  };

  const updateKeyStringFormSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (updateKeyStringLoading.value) return;
    if (!errors) {
      updateKeyStringLoading.value = true;
      try {
        const { data } = await keyStringUpdateApi(values.key, {
          value: jsonParse(values.stringValue),
        });
        updateKeyInfoDataLoad(data);
        Message.success(t('common.success.update'));
      } catch (err) {
        // err
      } finally {
        updateKeyStringLoading.value = false;
      }
    }
  };

  // =========== 编辑结束 ===========

  // =========== 操作List元素开始 ===========

  interface ListActionFormModelData {
    add: boolean;
    pushType: number;
    value: string;
    count?: number;
  }

  // 是否显示操作List元素表单
  const listActionFormVisible = ref(false);
  // 操作List元素按钮加载
  const listLoading = ref(false);
  // 操作List元素ref
  const listActionFormRef = ref<FormInstance>();

  const listActionFormModelDefault = (): ListActionFormModelData => {
    return {
      add: true,
      pushType: 1,
      value: '',
    };
  };

  // 操作List元素表单
  const listActionFormModel = ref<ListActionFormModelData>(
    listActionFormModelDefault()
  );

  const listActionFormShow = (add: boolean) => {
    listActionFormModel.value = listActionFormModelDefault();
    listActionFormModel.value.add = add;
    listActionFormVisible.value = true;
  };

  const listActionFormReset = () => {
    listActionFormRef.value?.resetFields();
  };

  const listActionFormHide = () => {
    listActionFormVisible.value = false;
    listActionFormRef.value?.resetFields();
  };

  const listActionFormSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (listLoading.value) return;
    if (!errors) {
      listLoading.value = true;
      try {
        const { add, pushType, value, count } = values;
        const { data } = add
          ? await keyListAddApi(saveKeyCardInfo.value.key, {
              pushType,
              value: jsonParse(value),
            })
          : await keyListDeleteApi(saveKeyCardInfo.value.key, {
              pushType,
              count,
            });
        updateKeyInfoDataLoad(data);
        listActionFormHide();
        Message.success(
          add ? t('common.success.add') : t('common.success.delete')
        );
      } catch (err) {
        // err
      } finally {
        listLoading.value = false;
      }
    }
  };

  // =========== 操作List元素结束 ===========

  // =========== 编辑List元素开始 ===========

  // 是否显示更新List元素表单
  const listUpdateModalVisible = ref(false);
  // 更新List元素按钮加载
  const listUpdateLoading = ref(false);
  // 更新List元素ref
  const listUpdateFormRef = ref<FormInstance>();

  const listUpdateFormModelDefault = (): KeyInfoListUpdateRequestBody => {
    return {
      index: 0,
      value: '',
    };
  };

  // 更新List元素表单
  const listUpdateFormModel = ref<KeyInfoListUpdateRequestBody>(
    listUpdateFormModelDefault()
  );

  const listUpdateModalShow = (record: any) => {
    listUpdateFormModel.value = {
      index: record.index,
      value: record.value,
    };
    listUpdateModalVisible.value = true;
  };

  const listUpdateCancel = () => {
    listUpdateModalVisible.value = false;
    listUpdateFormRef.value?.resetFields();
  };

  const listUpdateBeforeOk = async () => {
    if (listUpdateLoading.value) {
      return false;
    }
    const res = await listUpdateFormRef.value?.validate();
    if (res) {
      return false;
    }
    listUpdateLoading.value = true;
    try {
      const { index, value } = listUpdateFormModel.value;
      const { data } = await keyListUpdateApi(saveKeyCardInfo.value.key, {
        index,
        value: jsonParse(value),
      });
      updateKeyInfoDataLoad(data);
      Message.success(t('common.success.update'));
      return true;
    } catch (err) {
      return false;
    } finally {
      listUpdateLoading.value = false;
    }
  };

  const listUpdateOk = () => {
    listUpdateFormModel.value = {
      index: 0,
      value: '',
    };
  };

  // =========== 编辑List元素结束 ===========

  // =========== 删除Set成员开始 ===========
  // 删除按钮加载
  const setDeleteLoading = ref(false);
  // 删除值
  const setDeleteValue = ref('');

  const setDeleteShow = (record: any) => {
    setDeleteValue.value = record.value;
  };

  const setDeleteCancel = () => {
    setDeleteValue.value = '';
  };

  const setDeleteBeforeOk = async () => {
    if (setDeleteLoading.value) {
      return false;
    }
    setDeleteLoading.value = true;
    try {
      const { data } = await keySetDeleteApi(saveKeyCardInfo.value.key, {
        value: [jsonParse(setDeleteValue.value)],
      });
      setDeleteValue.value = '';
      updateKeyInfoDataLoad(data);
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      setDeleteLoading.value = false;
    }
  };
  // =========== 删除Set成员结束 ===========

  // =========== 新增Set成员开始 ===========

  interface SetAddFormModelData {
    value: string[];
  }

  // 是否显示新增Set成员表单
  const setAddFormVisible = ref(false);
  // 新增Set成员按钮加载
  const setAddLoading = ref(false);
  // 新增Set成员ref
  const setAddFormRef = ref<FormInstance>();

  const setAddFormModelDefault = (): SetAddFormModelData => {
    return {
      value: [''],
    };
  };
  // 新增Set成员表单
  const setAddFormModel = ref<SetAddFormModelData>(setAddFormModelDefault());

  const setAddFormShow = () => {
    setAddFormModel.value = setAddFormModelDefault();
    setAddFormVisible.value = true;
  };

  const setAddFormReset = () => {
    setAddFormRef.value?.resetFields();
  };

  const setAddFormHide = () => {
    setAddFormVisible.value = false;
    setAddFormRef.value?.resetFields();
  };

  const setAddFormSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (setAddLoading.value) return;
    if (!errors) {
      setAddLoading.value = true;
      try {
        const { value } = values;
        const { data } = await keySetAddApi(saveKeyCardInfo.value.key, {
          value: value.map((item: string) => jsonParse(item)),
        });
        updateKeyInfoDataLoad(data);
        setAddFormHide();
        Message.success(t('common.success.add'));
      } catch (err) {
        // err
      } finally {
        setAddLoading.value = false;
      }
    }
  };

  // =========== 新增Set成员结束 ===========

  // =========== 删除ZSET成员开始 ===========
  // 删除按钮加载
  const zSetDeleteLoading = ref(false);
  // 删除值
  const deleteZSetValue = ref('');

  const zSetdeleteShow = (record: any) => {
    deleteZSetValue.value = record.value;
  };

  const zSetDeleteCancel = () => {
    deleteZSetValue.value = '';
  };

  const zSetDeleteBeforeOk = async () => {
    if (zSetDeleteLoading.value) {
      return false;
    }
    zSetDeleteLoading.value = true;
    try {
      const { data } = await keyZSetDeleteApi(saveKeyCardInfo.value.key, {
        value: [jsonParse(deleteZSetValue.value)],
      });
      deleteZSetValue.value = '';
      updateKeyInfoDataLoad(data);
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      zSetDeleteLoading.value = false;
    }
  };
  // =========== 删除ZSet成员结束 ===========

  // =========== 新增ZSet成员开始 ===========
  // 是否显示新增ZSet成员表单
  const zSetAddFormVisible = ref(false);
  // 新增ZSet成员按钮加载
  const zSetAddLoading = ref(false);
  // 新增ZSet成员ref
  const zSetAddFormRef = ref<FormInstance>();

  const zSetAddFormModelDefault = (): DataBody<KeyInfoZSetBody[]> => {
    return {
      value: [
        {
          value: '',
        },
      ],
    };
  };
  // 新增ZSet成员表单
  const zSetAddFormModel = ref<DataBody<KeyInfoZSetBody[]>>(
    zSetAddFormModelDefault()
  );

  const zSetAddFormShow = () => {
    zSetAddFormModel.value = zSetAddFormModelDefault();
    zSetAddFormVisible.value = true;
  };

  const zSetAddFormReset = () => {
    zSetAddFormRef.value?.resetFields();
  };

  const zSetAddFormHide = () => {
    zSetAddFormVisible.value = false;
    zSetAddFormRef.value?.resetFields();
  };

  const zSetAddFormSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (zSetAddLoading.value) return;
    if (!errors) {
      zSetAddLoading.value = true;
      try {
        const { value } = values;
        const { data } = await keyZSetAddApi(saveKeyCardInfo.value.key, {
          value: value.map((item: KeyInfoZSetBody) => {
            return {
              value: jsonParse(item.value),
              score: item.score,
            };
          }),
        });
        updateKeyInfoDataLoad(data);
        zSetAddFormHide();
        Message.success(t('common.success.add'));
      } catch (err) {
        // err
      } finally {
        zSetAddLoading.value = false;
      }
    }
  };

  // =========== 新增ZSET成员结束 ===========

  // =========== 编辑ZSet成员开始 ===========

  // 是否显示更新ZSet成员表单
  const zSetUpdateModalVisible = ref(false);
  // 更新ZSet成员按钮加载
  const zSetUpdateLoading = ref(false);
  // 更新ZSet成员ref
  const zSetUpdateFormRef = ref<FormInstance>();

  const zSetUpdateFormModelDefault = (): KeyInfoZSetBody => {
    return {
      value: '',
    };
  };

  // 更新ZSet成员表单
  const zSetUpdateFormModel = ref<KeyInfoZSetBody>(
    zSetUpdateFormModelDefault()
  );

  const zSetUpdateModalShow = (record: any) => {
    zSetUpdateFormModel.value = {
      value: record.value,
      score: record.score,
    };
    zSetUpdateModalVisible.value = true;
  };

  const zSetUpdateCancel = () => {
    zSetUpdateModalVisible.value = false;
    zSetUpdateFormRef.value?.resetFields();
  };

  const zSetUpdateBeforeOk = async () => {
    if (zSetUpdateLoading.value) {
      return false;
    }
    const res = await zSetUpdateFormRef.value?.validate();
    if (res) {
      return false;
    }
    zSetUpdateLoading.value = true;
    try {
      const { value, score } = zSetUpdateFormModel.value;
      const { data } = await keyZSetScoreApi(saveKeyCardInfo.value.key, {
        value: {
          value: jsonParse(value),
          score,
        },
      });
      updateKeyInfoDataLoad(data);
      Message.success(t('common.success.update'));
      return true;
    } catch (err) {
      return false;
    } finally {
      zSetUpdateLoading.value = false;
    }
  };

  const zSetUpdateOk = () => {
    zSetUpdateFormModel.value = {
      value: {
        value: '',
      },
    };
  };

  // =========== 编辑ZSet成员结束 ===========

  // =========== 新增Hash字段开始 ===========

  interface HashAddFormModelData {
    field: string;
    value: string;
  }

  // 是否显示新增Hash字段表单
  const hashAddFormVisible = ref(false);
  // 新增Hash字段按钮加载
  const hashAddLoading = ref(false);
  // 新增Hash字段ref
  const hashAddFormRef = ref<FormInstance>();

  const hashAddFormModelDefault = (): DataBody<HashAddFormModelData[]> => {
    return {
      value: [
        {
          field: '',
          value: '',
        },
      ],
    };
  };
  // 新增Hash字段表单
  const hashAddFormModel = ref<DataBody<HashAddFormModelData[]>>(
    hashAddFormModelDefault()
  );

  const hashAddFormShow = () => {
    hashAddFormModel.value = hashAddFormModelDefault();
    hashAddFormVisible.value = true;
  };

  const hashAddFormReset = () => {
    hashAddFormRef.value?.resetFields();
  };

  const hashAddFormHide = () => {
    hashAddFormVisible.value = false;
    hashAddFormRef.value?.resetFields();
  };

  const hashAddFormSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (hashAddLoading.value) return;
    if (!errors) {
      hashAddLoading.value = true;
      try {
        const { value } = values;
        const { data } = await keyHashAddApi(saveKeyCardInfo.value.key, {
          value: value.map((item: HashAddFormModelData) => {
            return {
              field: item.field,
              value: jsonParse(item.value),
            };
          }),
        });
        updateKeyInfoDataLoad(data);
        hashAddFormHide();
        Message.success(t('common.success.add'));
      } catch (err) {
        // err
      } finally {
        hashAddLoading.value = false;
      }
    }
  };

  // =========== 新增Hash字段结束 ===========

  // =========== 删除Hash字段开始 ===========
  // 删除按钮加载
  const hashDeleteLoading = ref(false);
  // 删除值
  const hashDeleteField = ref('');

  const hashDeleteShow = (record: any) => {
    hashDeleteField.value = record.field;
  };

  const hashDeleteCancel = () => {
    hashDeleteField.value = '';
  };

  const hashDeleteBeforeOk = async () => {
    if (hashDeleteLoading.value) {
      return false;
    }
    hashDeleteLoading.value = true;
    try {
      const { data } = await keyHashDeleteApi(saveKeyCardInfo.value.key, {
        value: [hashDeleteField.value],
      });
      hashDeleteField.value = '';
      updateKeyInfoDataLoad(data);
      Message.success(t('common.success.delete'));
      return true;
    } catch (err) {
      return false;
    } finally {
      hashDeleteLoading.value = false;
    }
  };
  // =========== 删除Hash字段结束 ===========

  // =========== 编辑Hash字段值开始 ===========

  // 是否显示更新Hash字段值表单
  const hashUpdateModalVisible = ref(false);
  // 更新Hash字段值按钮加载
  const hashUpdateLoading = ref(false);
  // 更新Hash字段值ref
  const hashUpdateFormRef = ref<FormInstance>();
  // 更新Hash字段值表单
  const hashUpdateFormModel = ref<KeyInfoHashBody>({
    field: '',
    value: '',
  });

  const hashUpdateModalShow = (record: any) => {
    hashUpdateFormModel.value = {
      field: record.field,
      value: record.value,
    };
    hashUpdateModalVisible.value = true;
  };

  const hashUpdateCancel = () => {
    hashUpdateModalVisible.value = false;
    hashUpdateFormRef.value?.resetFields();
  };

  const hashUpdateBeforeOk = async () => {
    if (hashUpdateLoading.value) {
      return false;
    }
    const res = await hashUpdateFormRef.value?.validate();
    if (res) {
      return false;
    }
    hashUpdateLoading.value = true;
    try {
      const { field, value } = hashUpdateFormModel.value;
      const { data } = await keyHashUpdateApi(saveKeyCardInfo.value.key, {
        value: {
          field,
          value: jsonParse(value),
        },
      });
      updateKeyInfoDataLoad(data);
      Message.success(t('common.success.update'));
      return true;
    } catch (err) {
      return false;
    } finally {
      hashUpdateLoading.value = false;
    }
  };

  const hashUpdateOk = () => {
    hashUpdateFormModel.value = {
      field: '',
      value: '',
    };
  };

  // =========== 编辑Hash字段值结束 ===========

  onMounted(() => {
    if (keysTreePattern.value) {
      keysTreeRequest();
    }
  });
</script>

<script lang="ts">
  export default {
    name: 'Redis',
  };
</script>

<style scoped lang="less">
  .layout-height {
    height: calc(100vh - 355px);
  }

  .layout-div :deep(.arco-layout-header) {
    height: 64px;
    justify-content: left;
  }

  .layout-div :deep(.arco-layout-content) {
    display: flex;
    justify-content: center;
  }

  .layout-div :deep(.arco-layout-sider) {
    width: 206px;
  }

  .container {
    padding: 0 20px 0px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
</style>
