<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";

const audioStore = useAudio();
const { duration, audio } = storeToRefs(audioStore);
const { updateDurationDisplay } = audioStore;

onMounted(() => {
  if (audio.value) {
    audio.value.addEventListener("durationchange", updateDurationDisplay);
    audio.value.addEventListener("abort", updateDurationDisplay);
  }
});

onUnmounted(() => {
  if (audio.value) {
    audio.value.removeEventListener("durationchange", updateDurationDisplay);
    audio.value.removeEventListener("abort", updateDurationDisplay);
  }
});

</script>

<template>
  <div class="min-w-[2.5rem] text-xs text-gray-800 dark:text-gray-250">
    {{ duration }}
  </div>
</template>
