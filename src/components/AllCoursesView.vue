<template>
  <div v-if="timeTable.length" class="snow-card">
    <ul class="space-y-2">
      <li
        v-for="(item, index) in timeTable"
        :key="item.nth"
        class="flex items-center relative rounded-md p-3 hover:bg-gray-100"
      >
        <span class="snow-big-num text-blue-500">{{ index + 1 }}</span>
        <div>
          <h3 class="text-base font-medium leading-5">{{ item.jikken.title }}</h3>
          <ul class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
            <li>第{{ parseTimeTuple(item.start_time_tuple)[0] }}日</li>
            <li>&middot;</li>
            <li>{{ item.jikken.place }}</li>
            <li>&middot;</li>
            <li>{{ item.jikken.teacher }}</li>
          </ul>
        </div>
        <a class="snow-jikken-border ring-blue-400" href="javascript:void(0);" />
      </li>
    </ul>
  </div>
  <CardView v-else>
    <template v-slot:title>哇襖！无课程</template>
    <template v-slot:content>请先在设置页面设置您的学号。</template>
  </CardView>
</template>

<script lang="ts" setup>
import { curStudent } from '@/core/GlobalVars';
import { type Ref, ref } from 'vue';
import { waitForJikkenDataAsync } from '@/core/FetchSystem';
import CardView from '@/components/CardView.vue';
import type { JikkenTimetable } from '@/core/models/CookedModel';
import { queryTimetable } from '@/core/view_models/QueryPersonTimetable';
import { parseTimeTuple } from '@/core/TimeTuple';

const timeTable: Ref<JikkenTimetable> = ref([]);

await waitForJikkenDataAsync();
if (curStudent.value !== null) {
  timeTable.value = queryTimetable(curStudent.value.batch);
}
</script>
