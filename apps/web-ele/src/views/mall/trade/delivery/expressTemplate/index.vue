<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallDeliveryExpressTemplateApi } from '#/api/mall/trade/delivery/expressTemplate';

import { Page, useVbenModal } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDeliveryExpressTemplate,
  getDeliveryExpressTemplatePage,
} from '#/api/mall/trade/delivery/expressTemplate';
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

/** 创建快递模板 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑快递模板 */
function handleEdit(row: MallDeliveryExpressTemplateApi.ExpressTemplate) {
  formModalApi.setData(row).open();
}

/** 删除快递模板 */
async function handleDelete(
  row: MallDeliveryExpressTemplateApi.ExpressTemplate,
) {
  await ElMessageBox.confirm($t('ui.actionMessage.deleting', [row.name]), {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  await deleteDeliveryExpressTemplate(row.id as number);
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
          return await getDeliveryExpressTemplatePage({
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
  } as VxeTableGridOptions<MallDeliveryExpressTemplateApi.ExpressTemplate>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <Grid table-title="快递模板列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['快递模板']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['trade:delivery:express-template:create'],
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
              auth: ['trade:delivery:express-template:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              link: true,
              type: 'danger',
              icon: ACTION_ICON.DELETE,
              auth: ['trade:delivery:express-template:delete'],
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
