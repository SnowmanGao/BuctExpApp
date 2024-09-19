<template>
  <div class="snow-card hover:outline-none hover:ring-2">
    <div class="flex flex-col space-y-4">
      <p class="ml-1 font-light text-2xl">
        <slot name="title">Title</slot>
      </p>
      <hr />
      <span class="text-base ml-1">
        <slot name="content">Content</slot>
      </span>
    </div>
  </div>
</template>
