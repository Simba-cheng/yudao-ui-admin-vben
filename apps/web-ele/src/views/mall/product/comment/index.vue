<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallCommentApi } from '#/api/mall/product/comment';

import { h } from 'vue';

import { confirm, DocAlert, Page, prompt, useVbenModal } from '@vben/common-ui';

import { ElInput, ElMessage } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getCommentPage,
  replyComment,
  updateCommentVisible,
} from '#/api/mall/product/comment';
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

/** 创建评价 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 回复评价 */
function handleReply(row: MallCommentApi.Comment) {
  prompt({
    component: () => {
      return h(ElInput, {
        type: 'textarea',
      });
    },
    content: row.content
      ? `用户评论：${row.content}\n请输入回复内容：`
      : '请输入回复内容：',
    title: '回复评论',
    modelPropName: 'value',
  }).then(async (val) => {
    if (val) {
      await replyComment({
        id: row.id as number,
        replyContent: val,
      });
      onRefresh();
    }
  });
}

/** 更新状态 */
async function handleStatusChange(
  newStatus: boolean,
  row: MallCommentApi.Comment,
): Promise<boolean | undefined> {
  return new Promise((resolve, reject) => {
    const text = newStatus ? '展示' : '隐藏';
    confirm({
      content: `确认要${text + row.id}评论吗?`,
    })
      .then(async () => {
        // 更新状态
        const res = await updateCommentVisible({
          id: row.id as number,
          visible: newStatus,
        });
        if (res) {
          // 提示并返回成功
          ElMessage.success(`${text}成功`);
          resolve(true);
        } else {
          reject(new Error('操作失败'));
        }
      })
      .catch(() => {
        reject(new Error('取消操作'));
      });
  });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(handleStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getCommentPage({
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
  } as VxeTableGridOptions<MallCommentApi.Comment>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="【商品】商品评价"
        url="https://doc.iocoder.cn/mall/product-comment/"
      />
    </template>
    <FormModal @success="onRefresh" />
    <Grid table-title="评论列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['虚拟评论']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['product:comment:create'],
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '回复',
              type: 'primary',
              link: true,
              auth: ['product:comment:update'],
              onClick: handleReply.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
