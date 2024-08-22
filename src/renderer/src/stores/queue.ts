import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { Track } from "@/types";

export const useQueue = defineStore("queue", () => {
  const originalQueue = ref<Track[]>([]);
  const queue = ref<Track[]>([]);
  const currentIndex = ref(0);

  function enqueue(track: Track | Track[]) {
    if (Array.isArray(track)) {
      queue.value = queue.value.concat(track);
    }
    else {
      queue.value.push(track);
    }
  }

  function dequeue() {
    if (currentIndex.value >= queue.value.length) {
      return null;
    }
    const track = queue.value[currentIndex.value];
    currentIndex.value++;
    return track;
  }

  const length = computed(() => queue.value.length);
  const isEmpty = computed(() => queue.value.length === 0);

  const peek = computed(() => {
    if (queue.value.length === 0 || currentIndex.value >= queue.value.length) {
      return null;
    }
    return queue.value[currentIndex.value];
  });

  function setCurrentIndex(index: number) {
    currentIndex.value = index;
  }

  function setQueue(newQueue: Track[]) {
    queue.value = newQueue;
  }

  function setOriginalQueue(newQueue: Track[]) {
    originalQueue.value = newQueue;
  }

  function clear() {
    originalQueue.value = [];
    queue.value = [];
    currentIndex.value = 0;
  }

  function getNextNTracks(count: number) {
    if (currentIndex.value + count >= queue.value.length) {
      return queue.value.slice(currentIndex.value);
    }
    return queue.value.slice(currentIndex.value, count + 1);
  }

  return {
    originalQueue,
    queue,
    currentIndex,
    enqueue,
    dequeue,
    length,
    isEmpty,
    peek,
    setCurrentIndex,
    setQueue,
    setOriginalQueue,
    clear,
    getNextNTracks,
  };
});
