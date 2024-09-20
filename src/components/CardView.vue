<template>
  <div class="snow-card hover:outline-none hover:ring-2">
    <div class="flex flex-col space-y-4 ml-1">
      <p class="font-light text-2xl">
        <slot name="title">Title</slot>
      </p>
      <hr style="margin-left: -0.25rem" />
      <slot name="content">Content</slot>
    </div>
  </div>
</template>
