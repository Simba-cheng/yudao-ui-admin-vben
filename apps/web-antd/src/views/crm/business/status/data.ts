import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { handleTree } from '@vben/utils';

import { getDeptList } from '#/api/system/dept';

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: '状态组名',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'deptIds',
      label: '应用部门',
      component: 'ApiTreeSelect',
      componentProps: {
        api: async () => {
          const data = await getDeptList();
          return handleTree(data);
        },
        multiple: true,
        fieldNames: { label: 'name', value: 'id', children: 'children' },
        placeholder: '请选择应用部门',
        treeDefaultExpandAll: true,
      },
      help: '不选择部门时，默认全公司生效',
    },
    {
      fieldName: 'statuses',
      label: '阶段设置',
      component: 'Input',
      rules: 'required',
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '状态组名',
    },
    {
      field: 'deptNames',
      title: '应用部门',
      formatter: ({ cellValue }) =>
        cellValue?.length > 0 ? cellValue.join(' ') : '全公司',
    },
    {
      field: 'creator',
      title: '创建人',
    },
    {
      field: 'createTime',
      title: '创建时间',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 160,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
