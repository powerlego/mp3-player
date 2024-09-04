<script setup lang="ts">
import SkipForwardIcon from "@icons/next.svg";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";

const { isAudioAvailable } = storeToRefs(useAudio());
const { getNextSong } = useAudio();
</script>

<template>
  <div
    v-if="isAudioAvailable"
    class="flex items-center justify-center h-8 aspect-square"
    @click="getNextSong"
  >
    <SkipForwardIcon
      class="w-4 h-4 m-0 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
    />
  </div>
  <div
    v-else
    class="flex items-center justify-center h-8 aspect-square"
  >
    <SkipForwardIcon class="w-4 h-4 m-0 fill-gray-350 dark:fill-gray-750" />
  </div>
</template>
