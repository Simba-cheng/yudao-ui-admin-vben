import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { InfraConfigApi } from '#/api/infra/config';

import { useAccess } from '@vben/access';

import { DICT_TYPE, getDictOptions, getRangePickerDefaultProps } from '#/utils';

const { hasAccessByCodes } = useAccess();

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'category',
      label: '参数分类',
      component: 'Input',
      componentProps: {
        placeholder: '请输入参数分类',
      },
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: '参数名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入参数名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'key',
      label: '参数键名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入参数键名',
      },
      rules: 'required',
    },
    {
      fieldName: 'value',
      label: '参数键值',
      component: 'Input',
      componentProps: {
        placeholder: '请输入参数键值',
      },
      rules: 'required',
    },
    {
      fieldName: 'visible',
      label: '是否可见',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING, 'boolean'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      defaultValue: true,
      rules: 'required',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '参数名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入参数名称',
        clearable: true,
      },
    },
    {
      fieldName: 'key',
      label: '参数键名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入参数键名',
        clearable: true,
      },
    },
    {
      fieldName: 'type',
      label: '系统内置',
      component: 'Select',
      componentProps: {
        options: getDictOptions(DICT_TYPE.INFRA_CONFIG_TYPE, 'number'),
        placeholder: '请选择系统内置',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns<T = InfraConfigApi.Config>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '参数主键',
      minWidth: 100,
    },
    {
      field: 'category',
      title: '参数分类',
      minWidth: 120,
    },
    {
      field: 'name',
      title: '参数名称',
      minWidth: 200,
    },
    {
      field: 'key',
      title: '参数键名',
      minWidth: 200,
    },
    {
      field: 'value',
      title: '参数键值',
      minWidth: 150,
    },
    {
      field: 'visible',
      title: '是否可见',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_BOOLEAN_STRING },
      },
    },
    {
      field: 'type',
      title: '系统内置',
      minWidth: 100,
      cellRender: {
        name: 'CellDict',
        props: { type: DICT_TYPE.INFRA_CONFIG_TYPE },
      },
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 150,
    },
    {
      field: 'createTime',
      title: '创建时间',
      minWidth: 180,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 130,
      align: 'center',
      fixed: 'right',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '参数',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: hasAccessByCodes(['infra:config:update']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['infra:config:delete']),
          },
        ],
      },
    },
  ];
}
