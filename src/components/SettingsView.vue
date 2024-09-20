<template>
  <CardView>
    <template v-slot:title>欢迎</template>
    <template v-slot:content>
      <span>🆚 版本：v{{ VERSION }} ({{ BUILD_TIME }})</span>
      <span v-if="curStudentId">✅ 查询成功，准许查看排课</span>
      <span v-else>ℹ️ 开始查询前，请先在下栏输入您的学号</span>
    </template>
  </CardView>

  <CardView>
    <template v-slot:title>个人信息</template>
    <template v-slot:content>
      <div style="margin-bottom: -0.15rem" />
      <StudentSelectorView />
      <transition>
        <StudentInfoView />
      </transition>
    </template>
  </CardView>
</template>

<script lang="ts" setup>
import StudentSelectorView from '@/components/StudentSelectorView.vue';
import StudentInfoView from '@/components/StudentInfoView.vue';
import { curStudentId } from '@/core/MainSystem';
import CardView from '@/components/CardView.vue';

const VERSION = '0.4.4';
const BUILD_TIME = '2024-09-20';
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
