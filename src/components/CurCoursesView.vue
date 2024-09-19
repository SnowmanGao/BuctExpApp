<template>
  <div class="snow-card hover:outline-none hover:ring-2">
    <SemesterView />
  </div>
  <div class="snow-card hover:outline-none hover:ring-2">
    <div v-if="nextJikken" class="flex flex-col space-y-4">
      <p class="ml-1 font-light text-2xl">近期实验</p>
      <hr />
      <span class="text-base ml-1">{{ getDetailTimeString(nextJikken) }} 要做的实验：</span>
      <div class="flex items-center relative rounded-md p-3 bg-gray-100">
        <span class="snow-big-num text-blue-500">{{ nextJikken.serial }}</span>
        <div>
          <h3 class="text-base font-medium leading-5">{{ nextJikken.title }}</h3>
          <ul class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
            <li>{{ getDateTimeString(nextJikken) }}</li>
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

  <div class="snow-card hover:outline-none hover:ring-2">
    <pre class="text-base ml-1">{{
      ScheduleSystem.weekNumberToDate(new Date('2024/8/26'), 4)
    }}</pre>
    <pre class="text-base ml-1">{{ JSON.stringify(timetable, null, 2) }}</pre>
  </div>
</template>

<script lang="ts" setup>
import { waitForJikkenDataAsync } from '@/core/FetchSystem';
import { BuctSchedule, ScheduleSystem } from '@/core/ScheduleSystem';
import { curStudent, queryTimetable } from '@/core/MainSystem';
import { onBeforeMount, ref, type Ref } from 'vue';
import SemesterView from '@/components/SemesterView.vue';
import type { JikkenTimetable, JikkenTimetableItem } from '@/core/MainModel';

let nextJikken: Ref<JikkenTimetableItem | null> = ref(null);
let timetable: Ref<JikkenTimetable | null> = ref(null);

onBeforeMount(async () => {
  await waitForJikkenDataAsync();
  if (curStudent.value === null) {
    timetable.value = null;
    nextJikken.value = null;
  } else {
    timetable.value = queryTimetable(curStudent.value.batch);
    nextJikken.value = BuctSchedule.getNextJikken(timetable.value);
  }
});

function getDateTimeString(jikken: JikkenTimetableItem) {
  const date = jikken.start;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function getDetailTimeString(jikken: JikkenTimetableItem) {
  function dayString(day: number) {
    const delta = jikken.week - BuctSchedule.getCurWeekNumber();
    const prefix = '下'.repeat(delta);
    return prefix + '日一二三四五六'[date.getDay()];
  }

  const date = jikken.start;
  return `${dayString} 上午 ${date.getHours()}:${date.getMinutes()}`;
}

function getDeltaTimeString(jikken: JikkenTimetableItem) {
  const delta_secs = (jikken.start.getTime() - new Date().getTime()) / 1000;
  const delta_hours = Math.floor(delta_secs / 3600) % 24;
  const delta_days = Math.floor(delta_secs / 3600 / 24);
  return `${delta_days} 天 ${delta_hours} 小时`;
}
</script>
