<script setup lang="ts">
import { computed } from 'vue';

import { ElTag } from 'element-plus';

// import { isHexColor } from '@/utils/color' // TODO @芋艿：【可优化】增加 cssClass 的处理 https://gitee.com/yudaocode/yudao-ui-admin-vben/blob/v2.4.1/src/components/DictTag/src/DictTag.vue#L60
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
  const defaultDict = {
    label: '',
    colorType: 'primary',
  };
  // 校验参数有效性
  if (!props.type || props.value === undefined || props.value === null) {
    return defaultDict;
  }

  // 获取字典对象
  const dict = getDictObj(props.type, String(props.value));
  if (!dict) {
    return defaultDict;
  }

  // 处理颜色类型
  let colorType = dict.colorType;
  switch (colorType) {
    case 'danger': {
      colorType = 'danger';
      break;
    }
    case 'info': {
      colorType = 'info';
      break;
    }
    case 'primary': {
      colorType = 'primary';
      break;
    }
    case 'success': {
      colorType = 'success';
      break;
    }
    case 'warning': {
      colorType = 'warning';
      break;
    }
    default: {
      if (!colorType) {
        colorType = 'primary';
      }
    }
  }

  return {
    label: dict.label || '',
    colorType,
  };
});
</script>

<template>
  <ElTag v-if="dictTag.label" :type="dictTag.colorType as any">
    {{ dictTag.label }}
  </ElTag>
</template>
