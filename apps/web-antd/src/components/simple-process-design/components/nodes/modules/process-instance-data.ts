import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import { DICT_TYPE } from '#/utils';

/** 流程实例列表字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'startUser',
      title: '发起人',
      slots: {
        default: ({ row }: { row: any }) => {
          return row.startUser?.nickname;
        },
      },
      minWidth: 100,
    },
    {
      field: 'deptName',
      title: '部门',
      slots: {
        default: ({ row }: { row: any }) => {
          return row.startUser?.deptName;
        },
      },
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: '开始时间',
      formatter: 'formatDateTime',
      minWidth: 140,
    },
    {
      field: 'endTime',
      title: '结束时间',
      formatter: 'formatDateTime',
      minWidth: 140,
    },
    {
      field: 'status',
      title: '流程状态',
      minWidth: 90,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS },
      },
    },
    {
      field: 'durationInMillis',
      title: '耗时',
      minWidth: 100,
      formatter: 'formatPast2',
    },
  ];
}
