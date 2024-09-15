<template>
  <div v-if="info" class="relative rounded-xl overflow-hidden bg-slate-50 p-4 space-y-2 font-mono">
      <span class="flex space-x-2">
      <span
        class="flex-row text-center min-w-12 items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">ID</span>
      <span class="font-sans">学号：{{ info.sid }}</span>
      </span>
      <span class="flex space-x-2">
        <span
          class="flex-row text-center min-w-12 items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Class</span>
        <span class="font-sans">班级：{{ info.cls }}</span>
      </span>
      <span class="flex space-x-2">
        <span
          class="flex-row text-center min-w-12 items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Batch</span>
        <span class="font-sans">批次：{{ info.batch }}</span>
      </span>
      <span class="flex space-x-2">
        <span
          class="flex-row text-center min-w-12 items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">Group</span>
        <span class="font-sans">小组：{{ info.group }}</span>
      </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { curStudentId, studentDict } from '@/core/MainSystem'

const info = computed(() => {
  if (curStudentId.value == null)
    return null
  return {
    'sid': curStudentId.value,
    'cls': studentDict.value[curStudentId.value].class,
    'batch': studentDict.value[curStudentId.value].batch,
    'group': studentDict.value[curStudentId.value].group
  }
})
</script>