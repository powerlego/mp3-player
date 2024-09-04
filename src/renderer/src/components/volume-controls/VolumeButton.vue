<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";
import VolumeHigh from "@icons/volume_high.svg";
import VolumeLow from "@icons/volume_low.svg";
import VolumeMedium from "@icons/volume_medium.svg";
import VolumeMute from "@icons/mute.svg";

const audioStore = useAudio();
const { volume, isMuted, isAudioAvailable } = storeToRefs(audioStore);
const { toggleMute } = audioStore;

</script>

<template>
  <div
    v-if="!isAudioAvailable"
    class="flex items-center justify-center h-8 aspect-square"
  >
    <VolumeMute class="w-4 h-4 m-0 fill-gray-350 dark:fill-gray-750" />
  </div>
  <div
    v-else
    class="flex items-center justify-center h-8 aspect-square"
    @click="toggleMute"
  >
    <VolumeMute
      v-if="isMuted"
      class="w-4 h-4 m-0 transition-all duration-300 ease-in-out cursor-pointer non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
    />
    <VolumeLow
      v-else-if="volume <= 1 / 3"
      class="w-4 h-4 m-0 transition-all duration-300 ease-in-out cursor-pointer non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
    />
    <VolumeMedium
      v-else-if="volume <= 2 / 3"
      class="w-4 h-4 m-0 transition-all duration-300 ease-in-out cursor-pointer non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
    />
    <VolumeHigh
      v-else
      class="w-4 h-4 m-0 transition-all duration-300 ease-in-out cursor-pointer non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
    />
  </div>
</template>
