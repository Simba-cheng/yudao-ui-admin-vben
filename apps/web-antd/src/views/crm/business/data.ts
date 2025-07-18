import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { useUserStore } from '@vben/stores';
import { erpPriceMultiply } from '@vben/utils';

import { z } from '#/adapter/form';
import { getBusinessStatusTypeSimpleList } from '#/api/crm/business/status';
import { getCustomerSimpleList } from '#/api/crm/customer';
import { getSimpleUserList } from '#/api/system/user';

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
  const userStore = useUserStore();
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
      label: '商机名称',
      component: 'Input',
      rules: 'required',
    },
    {
      fieldName: 'ownerUserId',
      label: '负责人',
      component: 'ApiSelect',
      componentProps: {
        api: () => getSimpleUserList(),
        fieldNames: {
          label: 'nickname',
          value: 'id',
        },
      },
      defaultValue: userStore.userInfo?.id,
      rules: 'required',
    },
    {
      fieldName: 'customerId',
      label: '客户名称',
      component: 'ApiSelect',
      componentProps: {
        api: () => getCustomerSimpleList(),
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },
      dependencies: {
        triggerFields: ['id'],
        disabled: (values) => values.customerDefault,
      },
      rules: 'required',
    },
    {
      fieldName: 'contactId',
      label: '合同名称',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'statusTypeId',
      label: '商机状态组',
      component: 'ApiSelect',
      componentProps: {
        api: () => getBusinessStatusTypeSimpleList(),
        fieldNames: {
          label: 'name',
          value: 'id',
        },
      },
      dependencies: {
        triggerFields: ['id'],
        disabled: (values) => values.id,
      },
      rules: 'required',
    },
    {
      fieldName: 'dealTime',
      label: '预计成交日期',
      component: 'DatePicker',
      rules: 'required',
      componentProps: {
        showTime: false,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'product',
      label: '产品清单',
      component: 'Input',
      formItemClass: 'col-span-3',
    },
    {
      fieldName: 'totalProductPrice',
      label: '产品总金额',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
      },
      rules: z.number().min(0).optional().default(0),
    },
    {
      fieldName: 'discountPercent',
      label: '整单折扣（%）',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
      },
      rules: z.number().min(0).max(100).optional().default(0),
    },
    {
      fieldName: 'totalPrice',
      label: '折扣后金额',
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
        disabled: true,
      },
      dependencies: {
        triggerFields: ['totalProductPrice', 'discountPercent'],
        trigger(values, form) {
          const discountPrice =
            erpPriceMultiply(
              values.totalProductPrice,
              values.discountPercent / 100,
            ) ?? 0;
          form.setFieldValue(
            'totalPrice',
            values.totalProductPrice - discountPrice,
          );
        },
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '商机名称',
      component: 'Input',
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '商机名称',
      fixed: 'left',
      minWidth: 240,
      slots: { default: 'name' },
    },
    {
      field: 'customerName',
      title: '客户名称',
      fixed: 'left',
      minWidth: 240,
      slots: { default: 'customerName' },
    },
    {
      field: 'totalPrice',
      title: '商机金额（元）',
      minWidth: 140,
      formatter: 'formatAmount2',
    },
    {
      field: 'dealTime',
      title: '预计成交日期',
      formatter: 'formatDate',
      minWidth: 180,
    },
    {
      field: 'remark',
      title: '备注',
      minWidth: 200,
    },
    {
      field: 'contactNextTime',
      title: '下次联系时间',
      formatter: 'formatDate',
      minWidth: 180,
    },
    {
      field: 'ownerUserName',
      title: '负责人',
      minWidth: 120,
    },
    {
      field: 'ownerUserDeptName',
      title: '所属部门',
      minWidth: 120,
    },
    {
      field: 'contactLastTime',
      title: '最后跟进时间',
      formatter: 'formatDateTime',
      minWidth: 180,
    },
    {
      field: 'createTime',
      title: '创建时间',
      formatter: 'formatDateTime',
      minWidth: 180,
    },
    {
      field: 'creatorName',
      title: '创建人',
      minWidth: 120,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      formatter: 'formatDateTime',
      minWidth: 180,
    },
    {
      field: 'statusTypeName',
      title: '商机状态组',
      fixed: 'right',
      minWidth: 120,
    },
    {
      field: 'statusName',
      title: '商机阶段',
      fixed: 'right',
      minWidth: 120,
    },
    {
      title: '操作',
      width: 130,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}
