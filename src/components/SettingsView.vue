<template>
  <div :class="['rounded-xl bg-white p-4 ring-white/60 ring-offset-2 ring-offset-blue-400',
                'snow-card hover:outline-none hover:ring-2']">
    <div class="flex flex-col space-y-4">
      <p class="ml-1 font-light text-2xl">欢迎</p>
      <hr>
      <span v-if="curStudentId" class="text-base ml-1">✅ 查询成功，准许查看排课</span>
      <span v-else class="text-base ml-1">ℹ️ 开始查询前，请先在下栏输入您的学号</span>
    </div>
  </div>

  <div :class="['rounded-xl bg-white p-4 ring-white/60 ring-offset-2 ring-offset-blue-400',
                'snow-card hover:outline-none hover:ring-2']">
    <div class="flex flex-col space-y-4">
      <p class="ml-1 font-light text-2xl">个人信息</p>
      <hr class="h-3">
      <StudentSelectorView />
      <transition>
        <StudentInfoView />
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import StudentSelectorView from '@/components/StudentSelectorView.vue'
import StudentInfoView from '@/components/StudentInfoView.vue'
import { curStudentId } from '@/core/MainSystem'
</script>

<style>
.v-enter-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>