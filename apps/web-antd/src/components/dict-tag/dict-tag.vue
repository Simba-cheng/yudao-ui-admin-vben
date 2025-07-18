<script setup lang="ts">
import { computed } from 'vue';

import { isValidColor, TinyColor } from '@vben/utils';

import { Tag } from 'ant-design-vue';

import { getDictObj } from '#/utils';

interface DictTagProps {
  /**
   * 字典类型
   */
  type: string;
  /**
   * 字典值
   */
  value: any;
  /**
   * 图标
   */
  icon?: string;
}

const props = defineProps<DictTagProps>();

/** 获取字典标签 */
const dictTag = computed(() => {
  // 校验参数有效性
  if (!props.type || props.value === undefined || props.value === null) {
    return null;
  }

  // 获取字典对象
  const dict = getDictObj(props.type, String(props.value));
  if (!dict) {
    return null;
  }

  // 处理颜色类型
  let colorType = dict.colorType;
  switch (colorType) {
    case 'danger': {
      colorType = 'error';
      break;
    }
    case 'info': {
      colorType = 'default';
      break;
    }
    case 'primary': {
      colorType = 'processing';
      break;
    }
    default: {
      if (!colorType) {
        colorType = 'default';
      }
    }
  }

  if (isValidColor(dict.cssClass)) {
    colorType = new TinyColor(dict.cssClass).toHexString();
  }

  return {
    label: dict.label || '',
    colorType,
    cssClass: dict.cssClass,
  };
});
</script>

<template>
  <Tag
    v-if="dictTag"
    :color="dictTag.colorType ? dictTag.colorType : dictTag.cssClass"
  >
    {{ dictTag.label }}
  </Tag>
</template>
