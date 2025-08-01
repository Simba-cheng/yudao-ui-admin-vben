<script lang="ts" setup>
import type {
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { MallPropertyApi } from '#/api/mall/product/property';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage, ElMessageBox } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteProperty, getPropertyPage } from '#/api/mall/product/property';
import { $t } from '#/locales';

import { usePropertyGridColumns, usePropertyGridFormSchema } from '../data';
import PropertyForm from './property-form.vue';

const emit = defineEmits(['select']);

const [PropertyFormModal, propertyFormModalApi] = useVbenModal({
  connectedComponent: PropertyForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建属性 */
function handleCreate() {
  propertyFormModalApi.setData(null).open();
}

/** 编辑属性 */
function handleEdit(row: any) {
  propertyFormModalApi.setData(row).open();
}

/** 删除属性 */
async function handleDelete(row: MallPropertyApi.Property) {
  await ElMessageBox.confirm('确定删除该属性吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  await deleteProperty(row.id as number);
  ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
  onRefresh();
}

/** 表格事件 */
const gridEvents: VxeGridListeners<MallPropertyApi.Property> = {
  cellClick: ({ row }) => {
    emit('select', row.id);
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: usePropertyGridFormSchema(),
  },
  gridOptions: {
    columns: usePropertyGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getPropertyPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isCurrent: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MallPropertyApi.Property>,
  gridEvents,
});
</script>

<template>
  <div class="h-full">
    <PropertyFormModal @success="onRefresh" />

    <Grid table-title="属性列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['属性']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['product:property:create'],
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
              auth: ['product:property:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE,
              auth: ['product:property:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </div>
</template>
