<script setup lang="ts">
import type { CrmBusinessApi } from '#/api/crm/business';
import type { SystemOperateLogApi } from '#/api/system/operate-log';

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { Button, Card, Tabs } from 'ant-design-vue';

import { getBusiness } from '#/api/crm/business';
import { getOperateLogPage } from '#/api/crm/operateLog';
import { BizTypeEnum } from '#/api/crm/permission';
import { useDescription } from '#/components/description';
import { AsyncOperateLog } from '#/components/operate-log';
import {
  BusinessDetailsInfo,
  BusinessForm,
  UpStatusForm,
} from '#/views/crm/business';
import { ContactDetailsList } from '#/views/crm/contact';
import { ContractDetailsList } from '#/views/crm/contract';
import { FollowUp } from '#/views/crm/followup';
import { PermissionList, TransferForm } from '#/views/crm/permission';
import { ProductDetailsList } from '#/views/crm/product';

import { useDetailSchema } from './detail-data';

const loading = ref(false);

const route = useRoute();
const router = useRouter();
const tabs = useTabs();

const businessId = ref(0);

const business = ref<CrmBusinessApi.Business>({} as CrmBusinessApi.Business);
const businessLogList = ref<SystemOperateLogApi.OperateLog[]>([]);
const permissionListRef = ref<InstanceType<typeof PermissionList>>(); // 团队成员列表 Ref

const [Description] = useDescription({
  componentProps: {
    bordered: false,
    column: 4,
    class: 'mx-4',
  },
  schema: useDetailSchema(),
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: BusinessForm,
  destroyOnClose: true,
});

const [TransferModal, transferModalApi] = useVbenModal({
  connectedComponent: TransferForm,
  destroyOnClose: true,
});

const [UpStatusModal, upStatusModalApi] = useVbenModal({
  connectedComponent: UpStatusForm,
  destroyOnClose: true,
});

/** 加载详情 */
async function loadBusinessDetail() {
  loading.value = true;
  const data = await getBusiness(businessId.value);
  const logList = await getOperateLogPage({
    bizType: BizTypeEnum.CRM_BUSINESS,
    bizId: businessId.value,
  });
  businessLogList.value = logList.list;
  business.value = data;
  loading.value = false;
}

/** 返回列表页 */
function handleBack() {
  tabs.closeCurrentTab();
  router.push('/crm/business');
}

/** 编辑 */
function handleEdit() {
  formModalApi.setData({ id: businessId.value }).open();
}

/** 转移线索 */
function handleTransfer() {
  transferModalApi.setData({ bizType: BizTypeEnum.CRM_BUSINESS }).open();
}

/** 更新商机状态操作 */
async function handleUpdateStatus() {
  upStatusModalApi.setData(business.value).open();
}

// 加载数据
onMounted(() => {
  businessId.value = Number(route.params.id);
  loadBusinessDetail();
});
</script>

<template>
  <Page auto-content-height :title="business?.name" :loading="loading">
    <FormModal @success="loadBusinessDetail" />
    <TransferModal @success="loadBusinessDetail" />
    <UpStatusModal @success="loadBusinessDetail" />
    <template #extra>
      <div class="flex items-center gap-2">
        <Button
          v-if="permissionListRef?.validateWrite"
          type="primary"
          @click="handleEdit"
        >
          {{ $t('ui.actionTitle.edit') }}
        </Button>
        <Button
          v-if="permissionListRef?.validateWrite"
          @click="handleUpdateStatus"
        >
          变更商机状态
        </Button>
        <Button
          v-if="permissionListRef?.validateOwnerUser"
          @click="handleTransfer"
        >
          转移
        </Button>
      </div>
    </template>
    <Card class="min-h-[10%]">
      <Description :data="business" />
    </Card>
    <Card class="mt-4 min-h-[60%]">
      <Tabs>
        <Tabs.TabPane tab="详细资料" key="1" :force-render="true">
          <BusinessDetailsInfo :business="business" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="跟进记录" key="2" :force-render="true">
          <FollowUp :biz-id="businessId" :biz-type="BizTypeEnum.CRM_BUSINESS" />
        </Tabs.TabPane>
        <Tabs.TabPane tab="联系人" key="3" :force-render="true">
          <ContactDetailsList
            :biz-id="businessId"
            :biz-type="BizTypeEnum.CRM_BUSINESS"
            :business-id="businessId"
            :customer-id="business.customerId"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="产品" key="4" :force-render="true">
          <ProductDetailsList
            :biz-id="businessId"
            :biz-type="BizTypeEnum.CRM_BUSINESS"
            :business="business"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="合同" key="5" :force-render="true">
          <ContractDetailsList
            :biz-id="businessId"
            :biz-type="BizTypeEnum.CRM_BUSINESS"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="团队成员" key="6" :force-render="true">
          <PermissionList
            ref="permissionListRef"
            :biz-id="businessId"
            :biz-type="BizTypeEnum.CRM_BUSINESS"
            :show-action="true"
            @quit-team="handleBack"
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="操作日志" key="7" :force-render="true">
          <AsyncOperateLog :log-list="businessLogList" />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  </Page>
</template>
