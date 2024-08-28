<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";

const audioStore = useAudio();
const { currentTime, audio } = storeToRefs(audioStore);
const { updateCurrentTimeDisplay } = audioStore;

onMounted(() => {
  if (audio.value) {
    audio.value.addEventListener("timeupdate", updateCurrentTimeDisplay);
    audio.value.addEventListener("loadedmetadata", updateCurrentTimeDisplay);
  }
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.removeEventListener("timeupdate", updateCurrentTimeDisplay);
    audio.value.removeEventListener("loadedmetadata", updateCurrentTimeDisplay);
  }
});

</script>

<template>
  <div class="min-w-[2.5rem] text-xs text-gray-800 dark:text-gray-250">
    {{ currentTime }}
  </div>
</template>
