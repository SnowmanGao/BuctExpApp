<template>
  <div class="snow-card hover:outline-none hover:ring-2">
    <SemesterView />
  </div>
  <div class="snow-card hover:outline-none hover:ring-2">
    <div v-if="nextJikken" class="flex flex-col space-y-4">
      <p class="ml-1 font-light text-2xl">近期实验</p>
      <hr />
      <span class="text-base ml-1">{{ getTodoTimeString() }} 要做的实验：</span>
      <div class="flex items-center relative rounded-md p-3 bg-gray-100">
        <span class="snow-big-num text-blue-500">{{ nextJikken.lab_id }}</span>
        <div>
          <h3 class="text-base font-medium leading-5">{{ nextJikken.title }}</h3>
          <ul class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
            <li>第{{ nextJikken.week }}周</li>
            <li>&middot;</li>
            <li>{{ nextJikken.place }}</li>
            <li>&middot;</li>
            <li>{{ nextJikken.teacher }}</li>
          </ul>
          <a class="snow-jikken-border ring-blue-400" href="javascript:void(0);" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { waitForJikkenDataAsync } from '@/core/FetchSystem';
import { BuctSchedule } from '@/core/ScheduleSystem';
import { curStudent, queryTimetable } from '@/core/MainSystem';
import { computed, onBeforeMount, type Ref } from 'vue';
import SemesterView from '@/components/SemesterView.vue';
import { SnowPipe } from '@/core/Utils';
import type { JikkenTimeTableItem } from '@/core/MainModel';

let nextJikken: Ref<JikkenTimeTableItem | null> = computed(() => {
  if (curStudent.value !== null) {
    return new SnowPipe(curStudent.value.batch)
      .forward(queryTimetable)
      .forward(BuctSchedule.transToSchedule)
      .forward(BuctSchedule.getNextJikken)
      .result();
  }
  return null;
});

onBeforeMount(async () => {
  await waitForJikkenDataAsync();
});

function getTodoTimeString() {
  return '';
}
</script>
