<template>
  <span
    :class="styleClass"
    class="snow-tag py-[6px] px-[12px] rounded-t-lg border-solid border-2 bg-purple-50"
  >
    <span class="inline-block mb-[3px] text-purple-700">
      <slot></slot>
    </span>
  </span>
</template>

<script lang="ts" setup>
const styleClass = defineModel<string>()
</script>

<style scoped>
.snow-tag {
  transition: border-color ease-in 0.1s;
}
</style>