<script setup lang="ts">
</script>

<template>
  <div
    class="bg-gray-250 dark:bg-gray-800 group isolate relative w-full p-4 hover:bg-gray-300 hover:dark:bg-gray-750 transition-[background-color] duration-300 ease-[ease]"
    style="--card-container-border-radius: clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px); border-radius: calc(var(--card-container-border-radius) + 2px);"
  >
    <div class="h-full select-none">
      <div class="relative mb-4">
        <div
          class="relative pb-[100%]"
          style="--card-image-border-radius: clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px); border-radius: var(--card-image-border-radius);box-shadow: 0 8px 24px rgb(0 0 0 / 50%);"
        >
          <div
            class="absolute top-0 left-0 w-full h-full bg-gray-350 dark:bg-gray-700 animate-pulse"
            style="--card-image-border-radius: clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px); border-radius: var(--card-image-border-radius);"
          />
        </div>
      </div>
      <div class="flex flex-col justify-center">
        <div class="w-full h-5 rounded-full bg-gray-350 dark:bg-gray-700 animate-pulse" />
        <div class="w-2/3 h-4 mt-2 rounded-full bg-gray-350 dark:bg-gray-700 animate-pulse" />
      </div>
    </div>
  </div>
</template>
