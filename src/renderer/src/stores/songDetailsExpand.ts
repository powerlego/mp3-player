import { acceptHMRUpdate, defineStore } from "pinia";
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

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSongDetailsExpand, import.meta.hot));
}
