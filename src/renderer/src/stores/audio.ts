import { defineStore } from "pinia";
import { ref } from "vue";

export const useAudio = defineStore("audio", () => {
  const audio = ref<HTMLAudioElement | null>(null);
  return {
    audio,
  };
});
