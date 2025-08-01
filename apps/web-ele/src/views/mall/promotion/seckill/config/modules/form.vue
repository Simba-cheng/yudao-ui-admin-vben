<script lang="ts" setup>
import type { MallSeckillConfigApi } from '#/api/mall/promotion/seckill/seckillConfig';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  createSeckillConfig,
  getSeckillConfig,
  updateSeckillConfig,
} from '#/api/mall/promotion/seckill/seckillConfig';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<MallSeckillConfigApi.SeckillConfig>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['秒杀时段'])
    : $t('ui.actionTitle.create', ['秒杀时段']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data =
      (await formApi.getValues()) as MallSeckillConfigApi.SeckillConfig;
    try {
      await (formData.value?.id
        ? updateSeckillConfig(data)
        : createSeckillConfig(data));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      ElMessage.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    const data = modalApi.getData<MallSeckillConfigApi.SeckillConfig>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getSeckillConfig(data.id as number);
      // 设置到 values
      await formApi.setValues(formData.value);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal class="w-2/5" :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
