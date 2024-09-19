<template>
  <div class="snow-card hover:outline-none hover:ring-2">
    <SemesterView />
  </div>
  <div v-if="nextJikken" class="snow-card hover:outline-none hover:ring-2">
    <div class="flex flex-col space-y-4">
      <p class="ml-1 font-light text-2xl">近期实验</p>
      <hr />
      <span class="text-base ml-1">{{ getDetailTimeString(nextJikken) }} 要做的实验：</span>
      <div class="snow-stripe flex items-center relative rounded-md p-3">
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
      <span class="text-base ml-1">距离实验还有 {{ deltaHours!.toFixed(6) }} h</span>
    </div>
  </div>
  <DummyView v-else>
    <template v-slot:title>近期排课？</template>
    <template v-slot:content>请先在设置页面设置您的学号。</template>
  </DummyView>
</template>

<script lang="ts" setup>
import { waitForJikkenDataAsync } from '@/core/FetchSystem';
import { BuctSchedule } from '@/core/ScheduleSystem';
import { curStudent, queryTimetable } from '@/core/MainSystem';
import { onBeforeMount, ref, type Ref } from 'vue';
import SemesterView from '@/components/SemesterView.vue';
import type { JikkenTimetable, JikkenTimetableItem } from '@/core/MainModel';
import DummyView from '@/components/DummyView.vue';

let nextJikken: Ref<JikkenTimetableItem | null> = ref(null);
let timetable: Ref<JikkenTimetable | null> = ref(null);
let deltaHours: Ref<number | null> = ref(null);

onBeforeMount(async () => {
  await waitForJikkenDataAsync();
  if (curStudent.value === null) {
    timetable.value = null;
    nextJikken.value = null;
  } else {
    timetable.value = queryTimetable(curStudent.value.batch);
    nextJikken.value = BuctSchedule.getNextJikken(timetable.value);
  }
  // 开始每帧循环
  onTicking();
});

// My Event
function onTicking() {
  const next = nextJikken.value;
  if (next !== null) {
    deltaHours.value = (next.start.getTime() - Date.now()) / 1000 / 3600;
  } else deltaHours.value = null;
  requestAnimationFrame(onTicking);
}

function getDateTimeString(jikken: JikkenTimetableItem) {
  const date = jikken.start;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function getDetailTimeString(jikken: JikkenTimetableItem) {
  function dayString() {
    const delta = jikken.week - BuctSchedule.getCurWeekNumber();
    const prefix = delta ? '下'.repeat(delta) : '本';
    const week = '日一二三四五六'[date.getDay()];
    return `${prefix}周${week}`;
  }

  function timeString() {
    return jikken.start.toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  const date = jikken.start;
  return `${dayString()} ${timeString()}`;
}
</script>
