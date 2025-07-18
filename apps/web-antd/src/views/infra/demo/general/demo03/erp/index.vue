<script lang="ts" setup>
import type { Demo03StudentApi } from '#/api/infra/demo/demo03/erp';

import { h, onMounted, reactive, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Download, Plus, Trash2 } from '@vben/icons';
import {
  cloneDeep,
  downloadFileFromBlobPart,
  formatDateTime,
  isEmpty,
} from '@vben/utils';

import {
  Button,
  Form,
  Input,
  message,
  Pagination,
  RangePicker,
  Select,
  Tabs,
} from 'ant-design-vue';

import { VxeColumn, VxeTable } from '#/adapter/vxe-table';
import {
  deleteDemo03Student,
  deleteDemo03StudentList,
  exportDemo03Student,
  getDemo03StudentPage,
} from '#/api/infra/demo/demo03/erp';
import { ContentWrap } from '#/components/content-wrap';
import { DictTag } from '#/components/dict-tag';
import { TableToolbar } from '#/components/table-toolbar';
import { useTableToolbar } from '#/hooks';
import { $t } from '#/locales';
import { DICT_TYPE, getDictOptions, getRangePickerDefaultProps } from '#/utils';

import Demo03CourseList from './modules/demo03-course-list.vue';
import Demo03GradeList from './modules/demo03-grade-list.vue';
import Demo03StudentForm from './modules/form.vue';

/** 子表的列表 */
const subTabsName = ref('demo03Course');
const selectDemo03Student = ref<Demo03StudentApi.Demo03Student>();
async function onCellClick({ row }: { row: Demo03StudentApi.Demo03Student }) {
  selectDemo03Student.value = row;
}

const loading = ref(true); // 列表的加载中
const list = ref<Demo03StudentApi.Demo03Student[]>([]); // 列表的数据

const total = ref(0); // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined,
  sex: undefined,
  description: undefined,
  createTime: undefined,
});
const queryFormRef = ref(); // 搜索的表单
const exportLoading = ref(false); // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const params = cloneDeep(queryParams) as any;
    if (params.createTime && Array.isArray(params.createTime)) {
      params.createTime = (params.createTime as string[]).join(',');
    }
    const data = await getDemo03StudentPage(params);
    list.value = data.list;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields();
  handleQuery();
};

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Demo03StudentForm,
  destroyOnClose: true,
});

/** 创建学生 */
function onCreate() {
  formModalApi.setData({}).open();
}

/** 编辑学生 */
function onEdit(row: Demo03StudentApi.Demo03Student) {
  formModalApi.setData(row).open();
}

/** 删除学生 */
async function onDelete(row: Demo03StudentApi.Demo03Student) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteDemo03Student(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.id]),
      key: 'action_process_msg',
    });
    await getList();
  } finally {
    hideLoading();
  }
}

/** 批量删除学生 */
async function onDeleteBatch() {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteDemo03StudentList(checkedIds.value);
    message.success($t('ui.actionMessage.deleteSuccess'));
    await getList();
  } finally {
    hideLoading();
  }
}

const checkedIds = ref<number[]>([]);
function handleRowCheckboxChange({
  records,
}: {
  records: Demo03StudentApi.Demo03Student[];
}) {
  checkedIds.value = records.map((item) => item.id);
}

/** 导出表格 */
async function onExport() {
  try {
    exportLoading.value = true;
    const data = await exportDemo03Student(queryParams);
    downloadFileFromBlobPart({ fileName: '学生.xls', source: data });
  } finally {
    exportLoading.value = false;
  }
}

/** 初始化 */
const { hiddenSearchBar, tableToolbarRef, tableRef } = useTableToolbar();
onMounted(() => {
  getList();
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="getList" />

    <ContentWrap v-if="!hiddenSearchBar">
      <!-- 搜索工作栏 -->
      <Form :model="queryParams" ref="queryFormRef" layout="inline">
        <Form.Item label="名字" name="name">
          <Input
            v-model:value="queryParams.name"
            placeholder="请输入名字"
            allow-clear
            @press-enter="handleQuery"
            class="w-full"
          />
        </Form.Item>
        <Form.Item label="性别" name="sex">
          <Select
            v-model:value="queryParams.sex"
            placeholder="请选择性别"
            allow-clear
            class="w-full"
          >
            <Select.Option
              v-for="dict in getDictOptions(
                DICT_TYPE.SYSTEM_USER_SEX,
                'number',
              )"
              :key="dict.value"
              :value="dict.value"
            >
              {{ dict.label }}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="创建时间" name="createTime">
          <RangePicker
            v-model:value="queryParams.createTime"
            v-bind="getRangePickerDefaultProps()"
            class="w-full"
          />
        </Form.Item>
        <Form.Item>
          <Button class="ml-2" @click="resetQuery"> 重置 </Button>
          <Button class="ml-2" @click="handleQuery" type="primary">
            搜索
          </Button>
        </Form.Item>
      </Form>
    </ContentWrap>

    <!-- 列表 -->
    <ContentWrap title="学生">
      <template #extra>
        <TableToolbar
          ref="tableToolbarRef"
          v-model:hidden-search="hiddenSearchBar"
        >
          <Button
            class="ml-2"
            :icon="h(Plus)"
            type="primary"
            @click="onCreate"
            v-access:code="['infra:demo03-student:create']"
          >
            {{ $t('ui.actionTitle.create', ['学生']) }}
          </Button>
          <Button
            :icon="h(Download)"
            type="primary"
            class="ml-2"
            :loading="exportLoading"
            @click="onExport"
            v-access:code="['infra:demo03-student:export']"
          >
            {{ $t('ui.actionTitle.export') }}
          </Button>
          <Button
            :icon="h(Trash2)"
            type="primary"
            danger
            class="ml-2"
            :disabled="isEmpty(checkedIds)"
            @click="onDeleteBatch"
            v-access:code="['infra:demo03-student:delete']"
          >
            批量删除
          </Button>
        </TableToolbar>
      </template>
      <VxeTable
        ref="tableRef"
        :data="list"
        @cell-click="onCellClick"
        :row-config="{
          keyField: 'id',
          isHover: true,
          isCurrent: true,
        }"
        show-overflow
        :loading="loading"
        @checkbox-all="handleRowCheckboxChange"
        @checkbox-change="handleRowCheckboxChange"
      >
        <VxeColumn type="checkbox" width="40" />
        <VxeColumn field="id" title="编号" align="center" />
        <VxeColumn field="name" title="名字" align="center" />
        <VxeColumn field="sex" title="性别" align="center">
          <template #default="{ row }">
            <DictTag :type="DICT_TYPE.SYSTEM_USER_SEX" :value="row.sex" />
          </template>
        </VxeColumn>
        <VxeColumn field="birthday" title="出生日期" align="center">
          <template #default="{ row }">
            {{ formatDateTime(row.birthday) }}
          </template>
        </VxeColumn>
        <VxeColumn field="description" title="简介" align="center" />
        <VxeColumn field="createTime" title="创建时间" align="center">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </VxeColumn>
        <VxeColumn field="operation" title="操作" align="center">
          <template #default="{ row }">
            <Button
              size="small"
              type="link"
              @click="onEdit(row as any)"
              v-access:code="['infra:demo03-student:update']"
            >
              {{ $t('ui.actionTitle.edit') }}
            </Button>
            <Button
              size="small"
              type="link"
              danger
              class="ml-2"
              @click="onDelete(row as any)"
              v-access:code="['infra:demo03-student:delete']"
            >
              {{ $t('ui.actionTitle.delete') }}
            </Button>
          </template>
        </VxeColumn>
      </VxeTable>
      <!-- 分页 -->
      <div class="mt-2 flex justify-end">
        <Pagination
          :total="total"
          v-model:current="queryParams.pageNo"
          v-model:page-size="queryParams.pageSize"
          show-size-changer
          @change="getList"
        />
      </div>
    </ContentWrap>

    <ContentWrap>
      <!-- 子表的表单 -->
      <Tabs v-model:active-key="subTabsName">
        <Tabs.TabPane key="demo03Course" tab="学生课程" force-render>
          <Demo03CourseList :student-id="selectDemo03Student?.id" />
        </Tabs.TabPane>
        <Tabs.TabPane key="demo03Grade" tab="学生班级" force-render>
          <Demo03GradeList :student-id="selectDemo03Student?.id" />
        </Tabs.TabPane>
      </Tabs>
    </ContentWrap>
  </Page>
</template>
