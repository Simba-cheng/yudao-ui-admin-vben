<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberAddressApi } from '#/api/member/address';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAddressList } from '#/api/member/address';

const props = defineProps<{
  userId: number;
}>();

const [Grid] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        field: 'id',
        title: '地址编号',
      },
      {
        field: 'name',
        title: '收件人名称',
      },
      {
        field: 'mobile',
        title: '手机号',
      },
      {
        field: 'areaId',
        title: '地区编码',
      },
      {
        field: 'detailAddress',
        title: '收件详细地址',
      },
      {
        field: 'defaultStatus',
        title: '是否默认',
        slots: {
          default: ({ row }) => {
            return h(
              Tag,
              {
                class: 'mr-1',
                color: row.defaultStatus ? 'blue' : 'red',
              },
              () => (row.defaultStatus ? '是' : '否'),
            );
          },
        },
      },
      {
        field: 'createTime',
        title: '创建时间',
        formatter: 'formatDateTime',
      },
    ],
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          return await getAddressList({
            userId: props.userId,
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
  } as VxeTableGridOptions<MemberAddressApi.Address>,
});
</script>

<template>
  <Grid />
</template>
