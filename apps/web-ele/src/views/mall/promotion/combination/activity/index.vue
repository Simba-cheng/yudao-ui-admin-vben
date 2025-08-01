<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallCombinationActivityApi } from '#/api/mall/promotion/combination/combinationActivity';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  closeCombinationActivity,
  deleteCombinationActivity,
  getCombinationActivityPage,
} from '#/api/mall/promotion/combination/combinationActivity';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import CombinationActivityForm from './modules/form.vue';

defineOptions({ name: 'PromotionCombinationActivity' });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: CombinationActivityForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建拼团活动 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑拼团活动 */
function handleEdit(row: MallCombinationActivityApi.CombinationActivity) {
  formModalApi.setData(row).open();
}

/** 关闭拼团活动 */
async function handleClose(
  row: MallCombinationActivityApi.CombinationActivity,
) {
  await ElMessageBox.confirm('确定关闭该拼团活动吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });

  await closeCombinationActivity(row.id as number);
  ElMessage.success('关闭成功');
  onRefresh();
}

/** 删除拼团活动 */
async function handleDelete(
  row: MallCombinationActivityApi.CombinationActivity,
) {
  await ElMessageBox.confirm('确定删除该拼团活动吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });

  await deleteCombinationActivity(row.id as number);
  ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
  onRefresh();
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
          return await getCombinationActivityPage({
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
  } as VxeTableGridOptions<MallCombinationActivityApi.CombinationActivity>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="【营销】拼团活动"
        url="https://doc.iocoder.cn/mall/promotion-combination/"
      />
    </template>

    <FormModal @success="onRefresh" />

    <Grid table-title="拼团活动列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['拼团活动']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['promotion:combination-activity:create'],
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
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT,
              auth: ['promotion:combination-activity:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '关闭',
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:combination-activity:close'],
              ifShow: row.status === 0,
              onClick: handleClose.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:combination-activity:delete'],
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
