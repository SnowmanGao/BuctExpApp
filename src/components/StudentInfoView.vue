<template>
  <div
    v-if="curStudentId"
    class="relative rounded-xl overflow-hidden bg-slate-50 p-4 space-y-2 font-mono"
  >
    <span class="flex space-x-2">
      <span class="snow-mini-tag bg-purple-50 text-purple-700 ring-purple-700/10">ID</span>
      <span class="font-sans">学号：{{ curStudentId }}</span>
    </span>
    <span class="flex space-x-2">
      <span class="snow-mini-tag bg-blue-50 text-blue-700 ring-blue-700/10">Class</span>
      <span class="font-sans">班级：{{ curStudent?.class }}</span>
    </span>
    <span class="flex space-x-2">
      <span class="snow-mini-tag bg-blue-50 text-blue-700 ring-blue-700/10">Batch</span>
      <span class="font-sans">批次：{{ curStudent?.batch }}</span>
    </span>
    <span class="flex space-x-2">
      <span class="snow-mini-tag bg-blue-50 text-blue-700 ring-blue-700/10">Group</span>
      <span class="font-sans">小组：{{ curStudent?.group }}</span>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { curStudent, curStudentId } from '@/core/GlobalVars';
</script>
