import { computed, ref } from "vue";
import { cloneDeep } from "lodash";
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

  function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function shuffleQueue() {
    const groups: Track[][] = [];
    const filledGroupsRows: Track[][] = [];
    const filledGroups: Track[][] = [];
    const reducedGroups: Track[][] = [];
    const shuffledQueue: Track[] = [];
    queue.value.forEach((track) => {
      const group = groups.find((group) => group[0].artist === track.artist && group[0].album === track.album);
      if (group) {
        group.push(track);
      }
      else {
        groups.push([track]);
      }
    });
    groups.forEach((group) => {
      const filledArray: Track[] = [];
      let n = queue.value.length;
      let k = group.length;
      let r = clamp(Math.round((n / k) * (1 + -1 * Math.round(Math.random()) * 0.2)), 1, n - k + 1);
      let i = 0;

      while (k > 0) {
        filledArray.push(group[i]);
        for (let i = 0; i < r - 1; i++) {
          filledArray.push({
            album: "",
            artist: "",
            id: "",
            name: "",
            storageLocation: "",
          } as Track);
        }
        n -= r;
        k -= 1;
        r = clamp(Math.round((n / k) * (1 + -1 * Math.round(Math.random()) * 0.2)), 1, n - k + 1);
        i += 1;
      }
      if (i < group.length) {
        filledArray.push(group[i]);
      }
      for (let i = 0; i < r - 1; i++) {
        filledArray.push({
          album: "",
          artist: "",
          id: "",
          name: "",
          storageLocation: "",
        } as Track);
      }
      const randOffset: Track[] = [];
      const len = filledArray.length;
      for (let i = 0; i < randomInt(0, len - 1); i++) {
        randOffset.push(filledArray.shift() as Track);
      }
      filledArray.push(...randOffset);
      filledGroupsRows.push(filledArray);
    });
    for (let i = 0; i < filledGroupsRows[0].length; i++) {
      const column: Track[] = [];
      for (let j = 0; j < filledGroupsRows.length; j++) {
        column.push(filledGroupsRows[j][i]);
      }
      filledGroups.unshift(column);
    }
    filledGroups.forEach((group) => {
      const reducedArray: Track[] = [];
      let i = 0;
      while (i < group.length) {
        if (group[i].id) {
          reducedArray.push(group[i]);
        }
        i += 1;
      }
      if (reducedArray.length > 0) {
        reducedGroups.push(reducedArray);
      }
    });
    reducedGroups.forEach((group) => {
      const shuffledGroup = cloneDeep(group);
      for (let i = shuffledGroup.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledGroup[i], shuffledGroup[j]] = [shuffledGroup[j], shuffledGroup[i]];
      }
      shuffledQueue.push(...shuffledGroup);
    });
    return shuffledQueue;
  }

  return {
    originalQueue,
    queue,
    currentIndex,
    enqueue,
    dequeue,
    peek,
    setCurrentIndex,
    setQueue,
    setOriginalQueue,
    clear,
    getNextNTracks,
    shuffleQueue,
  };
});
