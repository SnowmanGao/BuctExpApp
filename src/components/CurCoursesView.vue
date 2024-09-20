<template>
  <div class="snow-card hover:outline-none hover:ring-2">
    <SemesterView />
  </div>
  <suspense>
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
        <span class="text-base ml-1">距离实验还有 {{ deltaTimeStr }}</span>
      </div>
    </div>
    <CardView v-else>
      <template v-slot:title>近期排课？</template>
      <template v-slot:content>请先在设置页面设置您的学号。</template>
    </CardView>
    <template v-slot:fallback>
      <div class="snow-card">
        <div class="text-center text-gray-700 text-2xl font-light">Loading...</div>
      </div>
    </template>
  </suspense>
</template>

<script lang="ts" setup>
import { waitForJikkenDataAsync } from '@/core/FetchSystem';
import { BuctSchedule } from '@/core/ScheduleSystem';
import { curStudent, queryTimetable } from '@/core/MainSystem';
import { onBeforeMount, onUnmounted, ref, type Ref } from 'vue';
import SemesterView from '@/components/SemesterView.vue';
import { type JikkenTimetable, type JikkenTimetableItem, TimeOfDay } from '@/core/MainModel';
import CardView from '@/components/CardView.vue';

let nextJikken: Ref<JikkenTimetableItem | null> = ref(null);
let timetable: Ref<JikkenTimetable | null> = ref(null);
let deltaTimeStr: Ref<string | null> = ref(null);
let timerId: Ref<number | null> = ref(null);

onBeforeMount(async () => {
  await waitForJikkenDataAsync();
  if (curStudent.value === null) {
    timetable.value = null;
    nextJikken.value = null;
  } else {
    timetable.value = queryTimetable(curStudent.value.batch);
    nextJikken.value = BuctSchedule.getNextJikken(timetable.value);
  }
  // 开始每秒更新，对齐到一整秒，误差保证 50 ms 内
  onTicking();
  timerId.value = setInterval(onTicking, 100);
});

onUnmounted(() => {
  clearInterval(timerId.value!);
});

// My Event
function onTicking() {
  if (nextJikken.value === null) return;
  const sec = (nextJikken.value.start.getTime() - new Date().getTime()) / 1000;
  const check = (n: number, s: string) => (n == 0 ? '' : [n, s].join(' '));
  let days = Math.floor(sec / 3600 / 24);
  let hours = Math.floor(sec / 3600 - days * 24);
  let minutes = Math.floor(sec / 60 - days * 24 * 60 - hours * 60);
  let seconds = Math.floor(sec - days * 24 * 3600 - hours * 3600 - minutes * 60);
  deltaTimeStr.value = [
    check(days, '天'),
    check(hours, '时'),
    check(minutes, '分'),
    check(seconds, '秒')
  ].join(' ');
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
    const { start, end } = BuctSchedule.getJikkenStartAndEnd(jikken);
    const localize = (time: Date) =>
      time.toLocaleTimeString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    // TODO: 临时解决 Bad Method
    if (jikken.period == TimeOfDay.Evening) {
      const shit = localize(end).replace('下午', '晚上');
      return `${localize(start)} ~ ${shit}`;
    } else if (jikken.period == TimeOfDay.Morning) {
      const shit = localize(end).replace('下午', '中午');
      return `${localize(start)} ~ ${shit}`;
    }
    return `${localize(start)} ~ ${localize(end)}`;
  }

  const date = jikken.start;
  return `${dayString()} ${timeString()}`;
}
</script>
