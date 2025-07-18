<script setup lang="ts">
import type { Ref } from 'vue';

import type { SimpleFlowNode } from '../../consts';

import type { SystemDeptApi } from '#/api/system/dept';
import type { SystemUserApi } from '#/api/system/user';

import { inject, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import {
  Col,
  Input,
  Radio,
  RadioGroup,
  Row,
  TabPane,
  Tabs,
  Tooltip,
  TypographyText,
} from 'ant-design-vue';

import { BpmModelFormType, BpmNodeTypeEnum } from '#/utils';

import { FieldPermissionType, START_USER_BUTTON_SETTING } from '../../consts';
import {
  useFormFieldsPermission,
  useNodeName,
  useWatchNode,
} from '../../helpers';

defineOptions({ name: 'StartUserNodeConfig' });

const props = defineProps({
  flowNode: {
    type: Object as () => SimpleFlowNode,
    required: true,
  },
});

// 可发起流程的用户编号
const startUserIds = inject<Ref<any[]>>('startUserIds');
// 可发起流程的部门编号
const startDeptIds = inject<Ref<any[]>>('startDeptIds');
// 用户列表
const userOptions = inject<Ref<SystemUserApi.User[]>>('userList');
// 部门列表
const deptOptions = inject<Ref<SystemDeptApi.Dept[]>>('deptList');
// 当前节点
const currentNode = useWatchNode(props);
// 节点名称
const { nodeName, showInput, clickIcon, changeNodeName, inputRef } =
  useNodeName(BpmNodeTypeEnum.START_USER_NODE);
// 激活的 Tab 标签页
const activeTabName = ref('user');

// 表单字段权限配置
const { formType, fieldsPermissionConfig, getNodeConfigFormFields } =
  useFormFieldsPermission(FieldPermissionType.WRITE);

function getUserNicknames(userIds: number[]): string {
  if (!userIds || userIds.length === 0) {
    return '';
  }
  const nicknames: string[] = [];
  userIds.forEach((userId) => {
    const found = userOptions?.value.find((item) => item.id === userId);
    if (found && found.nickname) {
      nicknames.push(found.nickname);
    }
  });
  return nicknames.join(',');
}

function getDeptNames(deptIds: number[]): string {
  if (!deptIds || deptIds.length === 0) {
    return '';
  }
  const deptNames: string[] = [];
  deptIds.forEach((deptId) => {
    const found = deptOptions?.value.find((item) => item.id === deptId);
    if (found && found.name) {
      deptNames.push(found.name);
    }
  });
  return deptNames.join(',');
}

// 使用 VbenDrawer
const [Drawer, drawerApi] = useVbenDrawer({
  header: true,
  closable: true,
  onCancel() {
    drawerApi.setState({ isOpen: false });
  },
  onConfirm() {
    saveConfig();
  },
});

// 保存配置
async function saveConfig() {
  activeTabName.value = 'user';
  currentNode.value.name = nodeName.value!;
  currentNode.value.showText = '已设置';
  // 设置表单权限
  currentNode.value.fieldsPermission = fieldsPermissionConfig.value;
  // 设置发起人的按钮权限
  currentNode.value.buttonsSetting = START_USER_BUTTON_SETTING;
  drawerApi.setState({ isOpen: false });
  return true;
}

// 显示发起人节点配置，由父组件传过来
function showStartUserNodeConfig(node: SimpleFlowNode) {
  nodeName.value = node.name;
  // 表单字段权限
  getNodeConfigFormFields(node.fieldsPermission);
  drawerApi.open();
}

/** 批量更新权限 */
function updatePermission(type: string) {
  fieldsPermissionConfig.value.forEach((field) => {
    if (type === 'READ') {
      field.permission = FieldPermissionType.READ;
    } else if (type === 'WRITE') {
      field.permission = FieldPermissionType.WRITE;
    } else {
      field.permission = FieldPermissionType.NONE;
    }
  });
}

/**
 * 暴露方法给父组件
 */
defineExpose({ showStartUserNodeConfig });
</script>
<template>
  <Drawer>
    <template #title>
      <div class="config-header">
        <Input
          ref="inputRef"
          v-if="showInput"
          type="text"
          class="focus:border-blue-500 focus:shadow-[0_0_0_2px_rgba(24,144,255,0.2)] focus:outline-none"
          @blur="changeNodeName()"
          @press-enter="changeNodeName()"
          v-model:value="nodeName"
          :placeholder="nodeName"
        />
        <div v-else class="node-name">
          {{ nodeName }}
          <IconifyIcon
            class="ml-1"
            icon="lucide:edit-3"
            :size="16"
            @click="clickIcon()"
          />
        </div>
      </div>
    </template>
    <Tabs v-model:active-key="activeTabName" type="card">
      <TabPane tab="权限" key="user">
        <TypographyText
          v-if="
            (!startUserIds || startUserIds.length === 0) &&
            (!startDeptIds || startDeptIds.length === 0)
          "
        >
          全部成员可以发起流程
        </TypographyText>
        <div v-else-if="startUserIds && startUserIds.length > 0">
          <TypographyText v-if="startUserIds.length === 1">
            {{ getUserNicknames(startUserIds) }} 可发起流程
          </TypographyText>
          <TypographyText v-else>
            <Tooltip
              class="box-item"
              effect="dark"
              placement="top"
              :content="getUserNicknames(startUserIds)"
            >
              {{ getUserNicknames(startUserIds.slice(0, 2)) }} 等
              {{ startUserIds.length }} 人可发起流程
            </Tooltip>
          </TypographyText>
        </div>
        <div v-else-if="startDeptIds && startDeptIds.length > 0">
          <TypographyText v-if="startDeptIds.length === 1">
            {{ getDeptNames(startDeptIds) }} 可发起流程
          </TypographyText>
          <TypographyText v-else>
            <Tooltip
              class="box-item"
              effect="dark"
              placement="top"
              :content="getDeptNames(startDeptIds)"
            >
              {{ getDeptNames(startDeptIds.slice(0, 2)) }} 等
              {{ startDeptIds.length }} 个部门可发起流程
            </Tooltip>
          </TypographyText>
        </div>
      </TabPane>
      <TabPane
        tab="表单字段权限"
        key="fields"
        v-if="formType === BpmModelFormType.NORMAL"
      >
        <div class="p-1">
          <div class="mb-4 text-base font-bold">字段权限</div>

          <!-- 表头 -->
          <Row class="border border-gray-200 px-4 py-3">
            <Col :span="8" class="font-bold">字段名称</Col>
            <Col :span="16">
              <Row>
                <Col :span="8" class="flex items-center justify-center">
                  <span
                    class="cursor-pointer font-bold"
                    @click="updatePermission('READ')"
                  >
                    只读
                  </span>
                </Col>
                <Col :span="8" class="flex items-center justify-center">
                  <span
                    class="cursor-pointer font-bold"
                    @click="updatePermission('WRITE')"
                  >
                    可编辑
                  </span>
                </Col>
                <Col :span="8" class="flex items-center justify-center">
                  <span
                    class="cursor-pointer font-bold"
                    @click="updatePermission('NONE')"
                  >
                    隐藏
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>

          <!-- 表格内容 -->
          <div v-for="(item, index) in fieldsPermissionConfig" :key="index">
            <Row class="border border-t-0 border-gray-200 px-4 py-2">
              <Col :span="8" class="flex items-center truncate">
                {{ item.title }}
              </Col>
              <Col :span="16">
                <RadioGroup v-model:value="item.permission" class="w-full">
                  <Row>
                    <Col :span="8" class="flex items-center justify-center">
                      <Radio
                        :value="FieldPermissionType.READ"
                        size="large"
                        :label="FieldPermissionType.READ"
                      />
                    </Col>
                    <Col :span="8" class="flex items-center justify-center">
                      <Radio
                        :value="FieldPermissionType.WRITE"
                        size="large"
                        :label="FieldPermissionType.WRITE"
                      />
                    </Col>
                    <Col :span="8" class="flex items-center justify-center">
                      <Radio
                        :value="FieldPermissionType.NONE"
                        size="large"
                        :label="FieldPermissionType.NONE"
                      />
                    </Col>
                  </Row>
                </RadioGroup>
              </Col>
            </Row>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </Drawer>
</template>
