<script setup lang="ts">
import ShuffleIcon from "@icons/shuffle.svg";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";

const { shuffle } = storeToRefs(useAudio());
const { toggleShuffle } = useAudio();
</script>

<template>
  <div
    class="flex items-center justify-center h-8 aspect-square"
    @click="toggleShuffle"
  >
    <ShuffleIcon
      v-if="shuffle"
      class="m-0 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
    />
    <ShuffleIcon
      v-else
      class="m-0 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
    />
  </div>
</template>
