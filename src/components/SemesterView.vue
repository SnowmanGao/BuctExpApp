<template>
  <div class="flex flex-col space-y-4">
    <p class="ml-1 font-light text-2xl">教学日历</p>
    <hr />
    <span class="text-base ml-1">⌛ 今天是 {{ getTimeString() }}</span>
    <span class="text-base ml-1">⏲️ 现在是本学期第 {{ getWeekString() }} 周</span>
  </div>
</template>

<script lang="ts" setup>
import { BuctSchedule } from '@/core/ScheduleSystem';

function getTimeString(): string {
  const date = new Date();
  const day = '日一二三四五六'[date.getDay()];
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 星期${day}`;
}

function getWeekString(): string {
  return BuctSchedule.getCurWeekNumber().toString();
}
</script>
