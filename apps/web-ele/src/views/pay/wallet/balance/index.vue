<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PayWalletApi } from '#/api/pay/wallet/balance';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getWalletPage } from '#/api/pay/wallet/balance';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import WalletDetail from './modules/detail.vue';

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

const [WalletModal, walletModalApi] = useVbenModal({
  connectedComponent: WalletDetail,
  destroyOnClose: true,
});

function handleDetail(row: Required<PayWalletApi.Wallet>) {
  walletModalApi.setData(row).open();
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
          return await getWalletPage({
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
  } as VxeTableGridOptions<PayWalletApi.Wallet>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert title="钱包余额" url="https://doc.iocoder.cn/pay/build/" />
    </template>

    <WalletModal @reload="onRefresh" />

    <Grid>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.detail'),
              type: 'primary',
              link: true,
              icon: ACTION_ICON.VIEW,
              onClick: handleDetail.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
