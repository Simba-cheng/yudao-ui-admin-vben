<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallBannerApi } from '#/api/mall/market/banner';

import { Page, useVbenModal } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteBanner, getBannerPage } from '#/api/mall/market/banner';
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

/** 创建Banner */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑Banner */
function handleEdit(row: MallBannerApi.Banner) {
  formModalApi.setData(row).open();
}

/** 删除Banner */
async function handleDelete(row: MallBannerApi.Banner) {
  await ElMessageBox.confirm('确定删除该Banner吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  await deleteBanner(row.id as number);
  ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.title]));
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
          return await getBannerPage({
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
  } as VxeTableGridOptions<MallBannerApi.Banner>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <Grid table-title="Banner列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['Banner']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['promotion:banner:create'],
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
              auth: ['promotion:banner:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE,
              auth: ['promotion:banner:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.title]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
