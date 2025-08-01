<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AiModelChatRoleApi } from '#/api/ai/model/chatRole';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';

import { Image, message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteChatRole, getChatRolePage } from '#/api/ai/model/chatRole';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建 */
function handleCreate() {
  formModalApi.setData({ formType: 'create' }).open();
}

/** 编辑 */
function handleEdit(row: AiModelChatRoleApi.ChatRole) {
  formModalApi.setData({ formType: 'update', ...row }).open();
}

/** 删除 */
async function handleDelete(row: AiModelChatRoleApi.ChatRole) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    key: 'action_key_msg',
  });
  try {
    await deleteChatRole(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
      key: 'action_key_msg',
    });
    onRefresh();
  } finally {
    hideLoading();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getChatRolePage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<AiModelChatRoleApi.ChatRole>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert title="AI 对话聊天" url="https://doc.iocoder.cn/ai/chat/" />
    </template>
    <FormModal @success="onRefresh" />
    <Grid table-title="聊天角色列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['聊天角色']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['ai:chat-role:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #knowledgeIds="{ row }">
        <span v-if="!row.knowledgeIds || row.knowledgeIds.length === 0">-</span>
        <span v-else>引用 {{ row.knowledgeIds.length }} 个</span>
      </template>
      <template #toolIds="{ row }">
        <span v-if="!row.toolIds || row.toolIds.length === 0">-</span>
        <span v-else>引用 {{ row.toolIds.length }} 个</span>
      </template>
      <template #avatar="{ row }">
        <Image :src="row.avatar" class="h-8 w-8" />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['ai:chat-role:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['ai:chat-role:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
