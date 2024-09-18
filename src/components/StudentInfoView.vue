<template>
  <div v-if="info" class="relative rounded-xl overflow-hidden bg-slate-50 p-4 space-y-2 font-mono">
    <span class="flex space-x-2">
      <span class="snow-mini-tag bg-purple-50 text-purple-700 ring-purple-700/10">ID</span>
      <span class="font-sans">学号：{{ info.sid }}</span>
    </span>
    <span class="flex space-x-2">
      <span class="snow-mini-tag bg-blue-50 text-blue-700 ring-blue-700/10">Class</span>
      <span class="font-sans">班级：{{ info.cls }}</span>
    </span>
    <span class="flex space-x-2">
      <span class="snow-mini-tag bg-blue-50 text-blue-700 ring-blue-700/10">Batch</span>
      <span class="font-sans">批次：{{ info.batch }}</span>
    </span>
    <span class="flex space-x-2">
      <span class="snow-mini-tag bg-blue-50 text-blue-700 ring-blue-700/10">Group</span>
      <span class="font-sans">小组：{{ info.group }}</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { curStudentId, studentDict } from '@/core/MainSystem';

const info = computed(() => {
  if (curStudentId.value == null) return null;
  return {
    sid: curStudentId.value,
    cls: studentDict.value[curStudentId.value].class,
    batch: studentDict.value[curStudentId.value].batch,
    group: studentDict.value[curStudentId.value].group
  };
});
</script>
