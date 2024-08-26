<script setup lang="ts">
import PauseIcon from "@icons/pause.svg";
import PlayIcon from "@icons/play.svg";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";

const { isPlaying, isAudioAvailable } = storeToRefs(useAudio());
const { togglePlay } = useAudio();
</script>

<template>
  <div
    v-if="isAudioAvailable"
    class="h-12 aspect-square flex justify-center items-center rounded-full transition-all ease-in-out duration-200 hover:scale-[1.1] bg-gray-850 dark:bg-gray-150 hover:bg-gray-800 dark:hover:bg-gray-200"
    @click="togglePlay"
  >
    <PlayIcon
      v-if="!isPlaying"
      class="w-12 h-12 m-0 fill-white dark:fill-black"
    />
    <PauseIcon
      v-else
      class="w-12 h-12 m-0 fill-white dark:fill-black"
    />
  </div>
  <div
    v-else
    class="flex items-center justify-center h-12 rounded-full aspect-square bg-gray-350 dark:bg-gray-750"
  >
    <PlayIcon class="w-12 h-12 m-0 fill-gray-220 dark:fill-gray-880" />
  </div>
</template>
