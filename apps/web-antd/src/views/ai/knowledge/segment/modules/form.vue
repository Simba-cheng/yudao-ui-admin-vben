<script lang="ts" setup>
import type { AiKnowledgeSegmentApi } from '#/api/ai/knowledge/segment';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createKnowledgeSegment,
  getKnowledgeSegment,
  updateKnowledgeSegment,
} from '#/api/ai/knowledge/segment';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<AiKnowledgeSegmentApi.KnowledgeSegment>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['分段'])
    : $t('ui.actionTitle.create', ['分段']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 140,
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
      (await formApi.getValues()) as AiKnowledgeSegmentApi.KnowledgeSegment;
    try {
      await (formData.value?.id
        ? updateKnowledgeSegment(data)
        : createKnowledgeSegment(data));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
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
    const data = modalApi.getData<AiKnowledgeSegmentApi.KnowledgeSegment>();
    if (!data || !data.id) {
      await formApi.setValues(data);
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getKnowledgeSegment(data.id as number);
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
