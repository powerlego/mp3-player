import { defineStore } from "pinia";
import { ref } from "vue";

export const useSongDetailsExpand = defineStore("songDetailsExpand", () => {
  const expanded = ref(false);

  function expandSongDetails() {
    expanded.value = !expanded.value;
  }

  return {
    expanded,
    expandSongDetails,
  };
});
