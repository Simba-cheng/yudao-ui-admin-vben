<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DemoWithdrawApi } from '#/api/pay/demo/withdraw';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';
import { erpPriceInputFormatter } from '@vben/utils';

import { ElLoading, ElMessage, ElTag } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getDemoWithdrawPage,
  transferDemoWithdraw,
} from '#/api/pay/demo/withdraw';
import { $t } from '#/locales';

import { useGridColumns } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建提现单 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 处理转账操作 */
async function handleTransfer(row: DemoWithdrawApi.Withdraw) {
  const loadingInstance = ElLoading.service({
    text: '转账中，请稍后...',
    fullscreen: true,
  });
  try {
    const payTransferId = await transferDemoWithdraw(row.id as number);
    ElMessage.success(`转账提交成功，转账单号：${payTransferId}`);
    onRefresh();
  } finally {
    loadingInstance.close();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDemoWithdrawPage({
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
  } as VxeTableGridOptions<DemoWithdrawApi.Withdraw>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="支付宝转账接入"
        url="https://doc.iocoder.cn/pay/alipay-transfer-demo/"
      />
      <DocAlert
        title="微信转账接入"
        url="https://doc.iocoder.cn/pay/wx-transfer-demo/"
      />
    </template>

    <FormModal @success="onRefresh" />
    <Grid table-title="示例提现单列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['示例提现单']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              onClick: handleCreate,
            },
          ]"
        />
      </template>
      <template #type="{ row }">
        <ElTag v-if="row.type === 1">支付宝</ElTag>
        <ElTag v-else-if="row.type === 2">微信余额</ElTag>
        <ElTag v-else-if="row.type === 3">钱包余额</ElTag>
      </template>
      <template #price="{ row }">
        <span>￥{{ erpPriceInputFormatter(row.price) }}</span>
      </template>
      <template #status="{ row }">
        <ElTag v-if="row.status === 0 && !row.payTransferId" type="warning">
          等待转账
        </ElTag>
        <ElTag v-else-if="row.status === 0 && row.payTransferId" type="info">
          转账中
        </ElTag>
        <ElTag v-else-if="row.status === 10" type="success"> 转账成功 </ElTag>
        <ElTag v-else-if="row.status === 20" type="danger"> 转账失败 </ElTag>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: '发起转账',
              type: 'primary',
              link: true,
              ifShow: row.status === 0 && !row.payTransferId,
              onClick: handleTransfer.bind(null, row),
            },
            {
              label: '重新转账',
              type: 'primary',
              link: true,
              ifShow: row.status === 20,
              onClick: handleTransfer.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
