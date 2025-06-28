<template>
  <div class="snow-card hover:outline-none hover:ring-2">
    <SemesterView />
  </div>
  <suspense>
    <div v-if="nextJikken">
      <CardView>
        <template v-slot:title>近期实验</template>
        <template v-slot:content>
          <span class="text-base ml-1">{{ getDetailTimeString(nextJikken) }} 要做的实验：</span>
          <div class="snow-stripe flex items-center relative rounded-md p-3">
            <span class="snow-big-num text-blue-500">{{ nextJikken.nth }}</span>
            <div>
              <h3 class="text-base font-medium leading-5">{{ nextJikken.jikken.title }}</h3>
              <ul class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
                <li>{{ getDateTimeString(nextJikken) }}</li>
                <li>&middot;</li>
                <li>{{ nextJikken.jikken.place }}</li>
                <li>&middot;</li>
                <li>{{ nextJikken.jikken.teacher }}</li>
              </ul>
              <a
                class="snow-jikken-border ring-blue-400"
                :href="queryPdfResource(nextJikken.jikken.id)"
              />
            </div>
          </div>
          <span id="time-box" class="text-base ml-1">距离实验还有&nbsp;</span>
        </template>
      </CardView>
      <CardView class="snow-warning-card mt-4">
        <template v-slot:title>⚠️ 危险性提示</template>
        <template v-slot:content>
          <p v-for="(item, index) in nextJikken.jikken.info.split('\n')" :key="index">{{ item }}</p>
        </template>
      </CardView>
    </div>
    <CardView v-else-if="curStudent === null">
      <template v-slot:title>近期实验？</template>
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
import { curStudent } from '@/core/GlobalVars';
import { onBeforeMount, onMounted, onUnmounted, ref, type Ref } from 'vue';
import SemesterView from '@/components/SemesterView.vue';
import CardView from '@/components/CardView.vue';
import type { JikkenTimetable, JikkenTimetableItem } from '@/core/models/CookedModel';
import { queryTimetable } from '@/core/view_models/QueryPersonTimetable';
import { queryJikkenStartAndEndTime } from '@/core/view_models/QueryRealTimes';
import { queryNextJikken } from '@/core/view_models/QueryNextJikken';
import { formatTimeOfDay } from '@/core/Utils';
import dayjs from 'dayjs';
import { queryPdfResource } from '@/core/view_models/queryPdfResource';

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
    nextJikken.value = queryNextJikken(timetable.value);
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
  const remainingSeconds = dayjs.duration(-dayjs().diff(nextJikken.value.start_time));
  deltaTimeEl.innerText = remainingSeconds.format('D 天 H 小时 m 分 s 秒');
}

function getDateTimeString(jikken: JikkenTimetableItem) {
  const date = jikken.start_time;
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function getDetailTimeString(jikken: JikkenTimetableItem) {
  const week = dayjs(jikken.start_time).format('ddd');
  // const delta_week = '下'.repeat(dayjs().diff(jikken.start_time, 'week') + 1);

  const [start, end] = queryJikkenStartAndEndTime(jikken);
  const startStr = formatTimeOfDay(start.getHours(), start.getMinutes());
  const endStr = formatTimeOfDay(end.getHours(), end.getMinutes());

  return `${week} ${startStr} ~ ${endStr}`;
}
</script>

<style>
#time-box > span {
  opacity: 0;
  animation: SnowOpacityIn 0.3s linear forwards;
}
</style>
