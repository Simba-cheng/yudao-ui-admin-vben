<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MallSpuApi } from '#/api/mall/product/spu';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { confirm, DocAlert, Page } from '@vben/common-ui';
import {
  downloadFileFromBlobPart,
  fenToYuan,
  handleTree,
  treeToString,
} from '@vben/utils';

import { ElDescriptions, ElMessage, ElMessageBox, ElTabs } from 'element-plus';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCategoryList } from '#/api/mall/product/category';
import {
  deleteSpu,
  exportSpu,
  getSpuPage,
  getTabsCount,
  updateStatus,
} from '#/api/mall/product/spu';
import { $t } from '#/locales';
import { ProductSpuStatusEnum } from '#/utils';

import { useGridColumns, useGridFormSchema } from './data';

const { push } = useRouter();
const tabType = ref(0);

const categoryList = ref();

// tabs 数据
const tabsData = ref([
  {
    name: '出售中',
    type: 0,
    count: 0,
  },
  {
    name: '仓库中',
    type: 1,
    count: 0,
  },
  {
    name: '已售罄',
    type: 2,
    count: 0,
  },
  {
    name: '警戒库存',
    type: 3,
    count: 0,
  },
  {
    name: '回收站',
    type: 4,
    count: 0,
  },
]);

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 获得每个 Tab 的数量 */
async function getTabCount() {
  const res = await getTabsCount();
  for (const objName in res) {
    const index = Number(objName);
    if (tabsData.value[index]) {
      tabsData.value[index].count = res[objName] as number;
    }
  }
}

/** 创建商品 */
function handleCreate() {
  push({ name: 'ProductSpuAdd' });
}

/** 导出表格 */
async function handleExport() {
  const data = await exportSpu(await gridApi.formApi.getValues());
  downloadFileFromBlobPart({ fileName: '商品.xls', source: data });
}

/** 编辑商品 */
function handleEdit(row: MallSpuApi.Spu) {
  push({ name: 'ProductSpuEdit', params: { id: row.id } });
}

/** 删除商品 */
async function handleDelete(row: MallSpuApi.Spu) {
  await ElMessageBox.confirm('确定删除该商品吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  await deleteSpu(row.id as number);
  ElMessage.success($t('ui.actionMessage.deleteSuccess', [row.name]));
  onRefresh();
}

/** 添加到仓库 / 回收站的状态 */
async function handleStatus02Change(row: MallSpuApi.Spu, newStatus: number) {
  const text =
    newStatus === ProductSpuStatusEnum.RECYCLE.status
      ? '加入到回收站'
      : '恢复到仓库';
  // 二次确认
  await ElMessageBox.confirm(`确认要jian"${row.name}"${text}吗？`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  await updateStatus({ id: row.id as number, status: newStatus });
  ElMessage.success(`${text}成功`);
  onRefresh();
}

/** 更新状态 */
async function handleStatusChange(
  newStatus: number,
  row: MallSpuApi.Spu,
): Promise<boolean | undefined> {
  return new Promise((resolve, reject) => {
    // 二次确认
    const text = row.status ? '上架' : '下架';
    confirm({
      content: `确认要${text + row.name}吗?`,
    })
      .then(async () => {
        // 更新状态
        const res = await updateStatus({
          id: row.id as number,
          status: newStatus,
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

/** 查看商品详情 */
function handleDetail(row: MallSpuApi.Spu) {
  push({ name: 'ProductSpuDetail', params: { id: row.id } });
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(handleStatusChange),
    height: 'auto',
    cellConfig: {
      height: 80,
    },
    expandConfig: {
      height: 100,
    },
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getSpuPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            tabType: tabType.value,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      resizable: true,
    },
    toolbarConfig: {
      refresh: true,
      search: true,
    },
  } as VxeTableGridOptions<MallSpuApi.Spu>,
});

function onChangeTab(key: any) {
  tabType.value = Number(key);
  gridApi.query();
}

onMounted(() => {
  getTabCount();
  getCategoryList({}).then((res) => {
    categoryList.value = handleTree(res, 'id', 'parentId', 'children');
  });
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="【商品】商品 SPU 与 SKU"
        url="https://doc.iocoder.cn/mall/product-spu-sku/"
      />
    </template>

    <Grid>
      <template #top>
        <ElTabs class="border-none" @change="onChangeTab">
          <ElTabs.TabPane
            v-for="item in tabsData"
            :key="item.type"
            :tab="`${item.name} (${item.count})`"
          />
        </ElTabs>
      </template>
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['商品']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['product:spu:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['product:spu:export'],
              onClick: handleExport,
            },
          ]"
        />
      </template>
      <template #expand_content="{ row }">
        <ElDescriptions
          :column="4"
          class="mt-4"
          :label-style="{
            width: '100px',
            fontWeight: 'bold',
            fontSize: '14px',
          }"
          :content-style="{ width: '100px', fontSize: '14px' }"
        >
          <ElDescriptions.Item label="商品分类">
            {{ treeToString(categoryList, row.categoryId) }}
          </ElDescriptions.Item>
          <ElDescriptions.Item label="商品名称">
            {{ row.name }}
          </ElDescriptions.Item>

          <ElDescriptions.Item label="市场价">
            {{ fenToYuan(row.marketPrice) }} 元
          </ElDescriptions.Item>
          <ElDescriptions.Item label="成本价">
            {{ fenToYuan(row.costPrice) }} 元
          </ElDescriptions.Item>
          <ElDescriptions.Item label="浏览量">
            {{ row.browseCount }}
          </ElDescriptions.Item>
          <ElDescriptions.Item label="虚拟销量">
            {{ row.virtualSalesCount }}
          </ElDescriptions.Item>
        </ElDescriptions>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT,
              auth: ['product:spu:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.detail'),
              type: 'primary',
              link: true,
              icon: ACTION_ICON.VIEW,
              onClick: handleDetail.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'danger',
              link: true,
              icon: ACTION_ICON.DELETE,
              auth: ['product:spu:delete'],
              ifShow: () => row.type === 4,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
            {
              label: '恢复',
              type: 'primary',
              link: true,
              icon: ACTION_ICON.EDIT,
              auth: ['product:spu:update'],
              ifShow: () => row.type === 4,
              onClick: handleStatus02Change.bind(
                null,
                row,
                ProductSpuStatusEnum.DISABLE.status,
              ),
            },
            {
              label: '回收',
              type: 'danger',
              link: true,
              icon: ACTION_ICON.EDIT,
              auth: ['product:spu:update'],
              ifShow: () => row.type !== 4,
              onClick: handleStatus02Change.bind(
                null,
                row,
                ProductSpuStatusEnum.RECYCLE.status,
              ),
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
