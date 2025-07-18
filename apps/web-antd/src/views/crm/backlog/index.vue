<script lang="ts" setup>
import { computed, onActivated, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Badge, Card, List } from 'ant-design-vue';

import * as ClueApi from '#/api/crm/clue';
import * as ContractApi from '#/api/crm/contract';
import * as CustomerApi from '#/api/crm/customer';
import * as ReceivableApi from '#/api/crm/receivable';
import * as ReceivablePlanApi from '#/api/crm/receivable/plan';

import { useLeftSides } from './data';
import ClueFollowList from './modules/clue-follow-list.vue';
import ContractAuditList from './modules/contract-audit-list.vue';
import ContractRemindList from './modules/contract-remind-list.vue';
import CustomerFollowList from './modules/customer-follow-list.vue';
import CustomerPutPoolRemindList from './modules/customer-put-pool-remind-list.vue';
import CustomerTodayContactList from './modules/customer-today-contact-list.vue';
import ReceivableAuditList from './modules/receivable-audit-list.vue';
import ReceivablePlanRemindList from './modules/receivable-plan-remind-list.vue';

const leftMenu = ref('customerTodayContact');

const clueFollowCount = ref(0);
const customerFollowCount = ref(0);
const customerPutPoolRemindCount = ref(0);
const customerTodayContactCount = ref(0);
const contractAuditCount = ref(0);
const contractRemindCount = ref(0);
const receivableAuditCount = ref(0);
const receivablePlanRemindCount = ref(0);

const leftSides = useLeftSides(
  customerTodayContactCount,
  clueFollowCount,
  customerFollowCount,
  customerPutPoolRemindCount,
  contractAuditCount,
  contractRemindCount,
  receivableAuditCount,
  receivablePlanRemindCount,
);

const currentComponent = computed(() => {
  const components = {
    customerTodayContact: CustomerTodayContactList,
    clueFollow: ClueFollowList,
    contractAudit: ContractAuditList,
    receivableAudit: ReceivableAuditList,
    contractRemind: ContractRemindList,
    customerFollow: CustomerFollowList,
    customerPutPoolRemind: CustomerPutPoolRemindList,
    receivablePlanRemind: ReceivablePlanRemindList,
  } as const;
  return components[leftMenu.value as keyof typeof components];
});

/** 侧边点击 */
function sideClick(item: { menu: string }) {
  leftMenu.value = item.menu;
}

/** 获取数量 */
async function getCount() {
  customerTodayContactCount.value =
    await CustomerApi.getTodayContactCustomerCount();
  customerPutPoolRemindCount.value =
    await CustomerApi.getPutPoolRemindCustomerCount();
  customerFollowCount.value = await CustomerApi.getFollowCustomerCount();
  clueFollowCount.value = await ClueApi.getFollowClueCount();
  contractAuditCount.value = await ContractApi.getAuditContractCount();
  contractRemindCount.value = await ContractApi.getRemindContractCount();
  receivableAuditCount.value = await ReceivableApi.getAuditReceivableCount();
  receivablePlanRemindCount.value =
    await ReceivablePlanApi.getReceivablePlanRemindCount();
}

/** 激活时 */
onActivated(async () => {
  getCount();
});

/** 初始化 */
onMounted(async () => {
  getCount();
});
</script>
<template>
  <Page auto-content-height>
    <div class="flex h-full w-full">
      <Card class="w-1/5">
        <List item-layout="horizontal" :data-source="leftSides">
          <template #renderItem="{ item }">
            <List.Item
              @click="sideClick(item)"
              class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <List.Item.Meta>
                <template #title>
                  {{ item.name }}
                </template>
              </List.Item.Meta>
              <template #extra>
                <Badge
                  :color="item.menu === leftMenu ? 'blue' : 'red'"
                  :count="item.count.value"
                  :show-zero="true"
                />
              </template>
            </List.Item>
          </template>
        </List>
      </Card>
      <component class="ml-4 w-4/5" :is="currentComponent" />
    </div>
  </Page>
</template>
