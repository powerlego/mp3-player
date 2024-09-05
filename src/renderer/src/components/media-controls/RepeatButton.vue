<script setup lang="ts">
import RepeatAllIcon from "@icons/repeat_all.svg";
import { RepeatMode } from "@/types";
import RepeatOnceIcon from "@icons/repeat_once.svg";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";

const { repeatMode } = storeToRefs(useAudio());
const { incrementRepeatMode } = useAudio();
</script>

<template>
  <div
    class="flex items-center justify-center h-8 aspect-square"
    @click="incrementRepeatMode"
  >
    <RepeatAllIcon
      v-if="repeatMode === RepeatMode.ALL"
      id="repeat-all"
      class="w-4 h-4 m-0 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
    />
    <RepeatOnceIcon
      v-else-if="repeatMode === RepeatMode.ONCE"
      id="repeat-once"
      class="w-4 h-4 m-0 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
    />
    <RepeatAllIcon
      v-else
      id="repeat-none"
      class="w-4 h-4 m-0 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
    />
  </div>
</template>
