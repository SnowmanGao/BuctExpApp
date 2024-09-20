<template>
  <div class="snow-card hover:outline-none hover:ring-2">
    <div class="flex flex-col space-y-4 ml-1">
      <p class="font-light text-2xl">
        <slot name="title">Title</slot>
      </p>
      <hr class="snow-hr" />
      <slot name="content">Content</slot>
    </div>
  </div>
</template>

<style>
.snow-hr {
  margin-left: -0.25rem;
  height: 0.75rem;
}

.snow-hr + span {
  margin-top: 0 !important;
}
</style>
