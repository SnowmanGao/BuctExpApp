<template>
  <div class="snow-card rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400">
    <ul v-if="timeTable.length" class="space-y-2">
      <li
        v-for="(item, index) in timeTable"
        :key="`${item.week}_${item.time_of_day}_${item.lab_id}`"
        class="flex items-center relative rounded-md p-3 hover:bg-gray-100"
      >
        <span class="snow-block size-10 mr-4 text-blue-500">{{ index + 1 }}</span>
        <div>
          <h3 class="text-base font-medium leading-5">{{ item.title }}</h3>
          <ul class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
            <li>第{{ item.week }}周</li>
            <li>&middot;</li>
            <li>{{ item.place }}</li>
            <li>&middot;</li>
            <li>{{ item.teacher }}</li>
          </ul>
        </div>
        <a
          class="absolute inset-0 rounded-md ring-blue-400 focus:z-10 focus:outline-none focus:ring-2"
          href="javascript:void(0);"
        />
      </li>
    </ul>
    <div v-else class="text-center text-gray-500 text-2xl font-light">[无课程]</div>
  </div>
</template>

<script lang="ts" setup>
import { curStudent, isJikkenLoaded, queryJikkenOfBatch, transJikkenData } from '@/core/MainSystem';
import { onMounted, type Ref, ref } from 'vue';
import type { JikkenTimetable, RawJikken } from '@/core/MainModel';

// Vue Event
onMounted(() => {
  if (isJikkenLoaded.value) {
    query();
    return;
  }
  fetch('/resources/jikken_map.json')
    .then((response) => response.json())
    .then((data: RawJikken) => transJikkenData(data))
    .then(() => (isJikkenLoaded.value = true))
    .then(query);
});

const timeTable: Ref<JikkenTimetable> = ref([]);
const query = () => {
  if (curStudent.value === null) return;
  timeTable.value = queryJikkenOfBatch(curStudent.value?.batch);
};
</script>

<style scoped>
.snow-block {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  /* font */
  font-size: 2rem;
  line-height: 2rem;
  font-family: fantasy;
  font-style: italic;
  transform: translateX(-4px);
}
</style>
