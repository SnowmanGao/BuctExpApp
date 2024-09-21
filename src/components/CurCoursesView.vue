<template>
  <div class="snow-card hover:outline-none hover:ring-2">
    <SemesterView />
  </div>
  <suspense>
    <CardView v-if="nextJikken">
      <template v-slot:title>近期实验</template>
      <template v-slot:content>
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
        <span id="time-box" class="text-base ml-1">距离实验还有&nbsp;</span>
      </template>
    </CardView>
    <CardView v-else-if="curStudent === null">
      <template v-slot:title>近期排课？</template>
      <template v-slot:content>请先在设置页面设置您的学号。</template>
    </CardView>
    <template v-else>
      <div class="snow-card">
        <div class="text-center text-gray-700 text-2xl font-light">Loading...</div>
      </div>
    </template>
  </suspense>
</template>

<script lang="ts" setup>
import { waitForJikkenDataAsync } from '@/core/FetchSystem';
import { BuctSchedule, ScheduleSystem } from '@/core/ScheduleSystem';
import { curStudent, queryTimetable } from '@/core/MainSystem';
import { onBeforeMount, onMounted, onUnmounted, ref, type Ref } from 'vue';
import SemesterView from '@/components/SemesterView.vue';
import { type JikkenTimetable, type JikkenTimetableItem } from '@/core/MainModel';
import CardView from '@/components/CardView.vue';

const nextJikken: Ref<JikkenTimetableItem | null> = ref(null);
const timetable: Ref<JikkenTimetable | null> = ref(null);
const timerId: Ref<number | null> = ref(null);
let deltaTimeEl: HTMLElement | null;

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

onMounted(() => {
  // 开始每 100ms 更新一次时间
  onTicking();
  timerId.value = setInterval(onTicking, 100);
});

onUnmounted(() => {
  clearInterval(timerId.value!);
});

// My Event
function onTicking() {
  if (nextJikken.value === null) return;
  if (deltaTimeEl == null) {
    const span = document.createElement('span');
    document.getElementById('time-box')!.appendChild(span);
    deltaTimeEl = span;
  }

  // 计算剩余时间（秒）
  const remainingSeconds = (nextJikken.value.start.getTime() - Date.now()) / 1000;
  // 辅助函数：格式化时间单位
  const formatTimeUnit = (n: number, unit: string) => (n === 0 ? '' : `${n} ${unit}`);
  // 计算天、时、分、秒
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = Math.floor(remainingSeconds % 60);
  // 生成时间字符串，局部更新
  deltaTimeEl.innerText = [
    formatTimeUnit(days, '天'),
    formatTimeUnit(hours, '时'),
    formatTimeUnit(minutes, '分'),
    formatTimeUnit(seconds, '秒')
  ].join(' ');
}

function getDateTimeString(jikken: JikkenTimetableItem) {
  const date = jikken.start;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function getDetailTimeString(jikken: JikkenTimetableItem) {
  const delta_week = jikken.week - BuctSchedule.getCurWeekNumber();
  const prefix = delta_week ? '下'.repeat(delta_week) : '本';
  const week = '日一二三四五六'[jikken.start.getDay()];

  const { start, end } = BuctSchedule.getJikkenStartAndEnd(jikken);
  const startStr = ScheduleSystem.formatTimeOfDay(start.getHours(), start.getMinutes());
  const endStr = ScheduleSystem.formatTimeOfDay(end.getHours(), end.getMinutes());

  return `${prefix}周${week} ${startStr} ~ ${endStr}`;
}
</script>

<style>
#time-box > span {
  opacity: 0;
  animation: SnowOpacityIn 0.2s linear forwards;
}
</style>
