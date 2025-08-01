<script lang="ts" setup>
import type { AiMindmapApi } from '#/api/ai/mindmap';

import { nextTick, onMounted, ref } from 'vue';

import { alert, Page } from '@vben/common-ui';

import { generateMindMap } from '#/api/ai/mindmap';
import { MindMapContentExample } from '#/utils';

import Left from './modules/Left.vue';
import Right from './modules/Right.vue';

const ctrl = ref<AbortController>(); // 请求控制
const isGenerating = ref(false); // 是否正在生成思维导图
const isStart = ref(false); // 开始生成，用来清空思维导图
const isEnd = ref(true); // 用来判断结束的时候渲染思维导图
const generatedContent = ref(''); // 生成思维导图结果

const leftRef = ref<InstanceType<typeof Left>>(); // 左边组件
const rightRef = ref(); // 右边组件

/** 使用已有内容直接生成 */
function directGenerate(existPrompt: string) {
  isEnd.value = false; // 先设置为 false 再设置为 true，让子组建的 watch 能够监听到
  generatedContent.value = existPrompt;
  isEnd.value = true;
}
/** 提交生成 */
function submit(data: AiMindmapApi.AiMindMapGenerateReq) {
  isGenerating.value = true;
  isStart.value = true;
  isEnd.value = false;
  ctrl.value = new AbortController(); // 请求控制赋值
  generatedContent.value = ''; // 清空生成数据
  generateMindMap({
    data,
    onMessage: async (res: any) => {
      const { code, data, msg } = JSON.parse(res.data);
      if (code !== 0) {
        alert(`生成思维导图异常! ${msg}`);
        stopStream();
        return;
      }
      generatedContent.value = generatedContent.value + data;
      await nextTick();
      rightRef.value?.scrollBottom();
    },
    onClose() {
      isEnd.value = true;
      leftRef.value?.setGeneratedContent(generatedContent.value);
      stopStream();
    },
    onError(err) {
      console.error('生成思维导图失败', err);
      stopStream();
      // 需要抛出异常，禁止重试
      throw err;
    },
    ctrl: ctrl.value,
  });
}
/** 停止 stream 生成 */
function stopStream() {
  isGenerating.value = false;
  isStart.value = false;
  ctrl.value?.abort();
}

/** 初始化 */
onMounted(() => {
  generatedContent.value = MindMapContentExample;
});
</script>

<template>
  <Page auto-content-height>
    <div class="absolute bottom-0 left-0 right-0 top-0 m-4 flex">
      <Left
        ref="leftRef"
        class="mr-4"
        :is-generating="isGenerating"
        @submit="submit"
        @direct-generate="directGenerate"
      />
      <Right
        ref="rightRef"
        :generated-content="generatedContent"
        :is-end="isEnd"
        :is-generating="isGenerating"
        :is-start="isStart"
      />
    </div>
  </Page>
</template>
