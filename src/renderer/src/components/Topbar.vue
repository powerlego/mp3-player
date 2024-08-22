<script setup lang="ts">
import Moon from "@icons/moon.svg";
import Sun from "@icons/sun.svg";
import { useDarkMode } from "@composables/darkMode";

const darkMode = useDarkMode();

</script>

<template>
  <div>
    <Sun
      v-if="darkMode"
      class="w-6 h-6 ml-4 mr-3 text-gray-500 transition duration-300 ease-in-out cursor-pointer hover:text-stone-400"
    />
    <Moon
      v-else
      class="w-6 h-6 ml-4 mr-3 text-gray-500 transition duration-300 ease-in-out cursor-pointer hover:text-stone-400"
    />
  </div>
</template>
