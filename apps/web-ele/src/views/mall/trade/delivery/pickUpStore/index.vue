<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallDeliveryPickUpStoreApi } from '#/api/mall/trade/delivery/pickUpStore';

import { Page, useVbenModal } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDeliveryPickUpStore,
  getDeliveryPickUpStorePage,
} from '#/api/mall/trade/delivery/pickUpStore';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import BindForm from './modules/bind-form.vue';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [BindFormModal, bindFormModalApi] = useVbenModal({
  connectedComponent: BindForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建门店 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑门店 */
function handleEdit(row: MallDeliveryPickUpStoreApi.PickUpStore) {
  formModalApi.setData(row).open();
}

/** 绑定店员 */
function handleBind(row: MallDeliveryPickUpStoreApi.PickUpStore) {
  bindFormModalApi.setData(row).open();
}

/** 删除门店 */
async function handleDelete(row: MallDeliveryPickUpStoreApi.PickUpStore) {
  await ElMessageBox.confirm('确定要删除该门店吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  await deleteDeliveryPickUpStore(row.id as number);
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
          return await getDeliveryPickUpStorePage({
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
  } as VxeTableGridOptions<MallDeliveryPickUpStoreApi.PickUpStore>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <BindFormModal />
    <Grid table-title="门店列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['门店']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['trade:delivery:pick-up-store:create'],
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
              link: true,
              icon: ACTION_ICON.EDIT,
              auth: ['trade:delivery:pick-up-store:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: '绑定店员',
              link: true,
              icon: ACTION_ICON.ADD,
              auth: ['trade:delivery:pick-up-store:update'],
              onClick: handleBind.bind(null, row),
            },
            {
              label: $t('common.delete'),
              link: true,
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              auth: ['trade:delivery:pick-up-store:delete'],
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
