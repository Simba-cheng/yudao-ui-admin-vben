<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallRewardActivityApi } from '#/api/mall/promotion/reward/rewardActivity';

import { confirm, DocAlert, Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  closeRewardActivity,
  deleteRewardActivity,
  getRewardActivityPage,
} from '#/api/mall/promotion/reward/rewardActivity';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import RewardActivityForm from './modules/form.vue';

defineOptions({ name: 'PromotionRewardActivity' });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: RewardActivityForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建满减送活动 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑满减送活动 */
function handleEdit(row: MallRewardActivityApi.RewardActivity) {
  formModalApi.setData(row).open();
}

/** 关闭活动 */
async function handleClose(row: MallRewardActivityApi.RewardActivity) {
  try {
    await confirm({
      content: '确认关闭该满减送活动吗？',
    });
  } catch {
    return;
  }

  const hideLoading = message.loading({
    content: '正在关闭中',
    key: 'action_key_msg',
  });
  try {
    await closeRewardActivity(row.id as number);
    message.success({
      content: '关闭成功',
      key: 'action_key_msg',
    });
    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 删除活动 */
async function handleDelete(row: MallRewardActivityApi.RewardActivity) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    key: 'action_key_msg',
  });
  try {
    await deleteRewardActivity(row.id as number);
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
          return await getRewardActivityPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MallRewardActivityApi.RewardActivity>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="【营销】满减送"
        url="https://doc.iocoder.cn/mall/promotion-record/"
      />
    </template>

    <FormModal @success="onRefresh" />

    <Grid table-title="满减送活动列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['满减送活动']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['promotion:reward-activity:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['promotion:reward-activity:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '关闭',
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:reward-activity:close'],
              ifShow: row.status === 0,
              onClick: handleClose.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:reward-activity:delete'],
              ifShow: row.status !== 0,
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
