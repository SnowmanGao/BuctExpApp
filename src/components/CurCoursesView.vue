<template>
  <div class="snow-card">
    <h1 class="pl-1">请输入文字</h1>
    <h1>{{ nextJikken }}</h1>
  </div>
</template>

<script lang="ts" setup>
import { waitForJikkenDataAsync } from '@/core/FetchSystem';
import { BuctSchedule, ScheduleSystem } from '@/core/ScheduleSystem';
import { curStudent, queryTimetable } from '@/core/MainSystem';
import { type Ref, ref } from 'vue';
import type { JikkenData } from '@/core/MainModel';

const nextJikken: Ref<JikkenData | null> = ref(null);

await waitForJikkenDataAsync();
if (curStudent.value !== null) {
  // TODO: Pipeline Optimize
  nextJikken.value = ScheduleSystem.getNextJikken(
    BuctSchedule.transToSchedule(queryTimetable(curStudent.value.batch))
  );
}
</script>
