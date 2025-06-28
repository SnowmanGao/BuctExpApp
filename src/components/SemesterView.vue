<template>
  <div class="flex flex-col space-y-4">
    <p class="ml-1 font-light text-2xl">教学日历</p>
    <hr />
    <span class="text-base ml-1">⌛ 今天是 {{ getTimeString() }}</span>
    <span class="text-base ml-1">⏲️ 小学期的第 {{ getDayString() }} 日</span>
  </div>
</template>

<script lang="ts" setup>
import { queryCurrentDayNumber } from '@/core/view_models/QueryRealTimes';
import dayjs from 'dayjs';

function getTimeString(): string {
  return dayjs().format('YYYY年M月D日 星期dd');
}

function getDayString(): string {
  return queryCurrentDayNumber().toString();
}
</script>
