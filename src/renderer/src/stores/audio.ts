import { computed, ref, watch } from "vue";
import { defineStore, storeToRefs } from "pinia";
import _ from "lodash";
import log from "electron-log/renderer";
import { MediaReadyState, RepeatMode } from "@/types";
import { useQueue } from "@stores/queue";

export const useAudio = defineStore("audio", () => {
  const queueStore = useQueue();
  const { queue, originalQueue, currentIndex, peek } = storeToRefs(queueStore);
  const { dequeue, setCurrentIndex, setQueue, shuffleQueue } = queueStore;

  const audio = ref<HTMLAudioElement | null>(null);
  function setAudio(audioElement: HTMLAudioElement) {
    audio.value = audioElement;
  }

  // Audio metadata related reactive properties and methods.
  const readyState = computed(() => {
    if (audio.value) {
      switch (audio.value.readyState) {
      case 0:
        return MediaReadyState.HAVE_NOTHING;
      case 1:
        return MediaReadyState.HAVE_METADATA;
      case 2:
        return MediaReadyState.HAVE_CURRENT_DATA;
      case 3:
        return MediaReadyState.HAVE_FUTURE_DATA;
      case 4:
        return MediaReadyState.HAVE_ENOUGH_DATA;
      default:
        return MediaReadyState.HAVE_NOTHING;
      }
    }
    else {
      return MediaReadyState.HAVE_NOTHING;
    }
  });

  // Time related reactive properties and methods.
  const currentTime = computed({
    get: () => audio.value?.currentTime ?? -1,
    set: (value: number) => {
      if (audio.value) {
        audio.value.currentTime = value;
      }
    },
  });
  const currentTimeMs = computed(() => currentTime.value * 1000);
  const duration = computed(() => audio.value?.duration ?? 0);

  function getTimeDisplay(time: number) {
    if (!isFinite(time)) {
      return "--:--";
    }
    if (time < 0) {
      return "--:--";
    }
    const addHeadingZero = (num: number): string => {
      return num > 9 ? num.toString() : `0${num}`;
    };

    return `${addHeadingZero(Math.floor(time / 60))}:${addHeadingZero(Math.floor(time % 60))}`;
  }
  const currentTimeDisplay = ref("--:--");
  const durationDisplay = ref("--:--");

  function updateCurrentTimeDisplay() {
    currentTimeDisplay.value = getTimeDisplay(currentTime.value);
  }

  function updateDurationDisplay() {
    durationDisplay.value = getTimeDisplay(duration.value);
  }

  const looping = computed({
    get: () => audio.value?.loop ?? false,
    set: (value: boolean) => {
      if (audio.value) {
        audio.value.loop = value;
      }
    },
  });

  // Repeat related reactive properties and methods.
  const repeatMode = ref(RepeatMode.NONE);
  const repeatCount = ref(0);
  function incrementRepeatMode() {
    repeatMode.value = (repeatMode.value + 1) % 3;
  }

  function setRepeatCount(count: number) {
    repeatCount.value = count;
  }

  function handleRepeatOnce() {
    if (repeatCount.value === 0) {
      repeatCount.value = 1;
    }
  }

  watch(repeatMode, (newValue) => {
    if (audio.value) {
      switch (newValue) {
      case RepeatMode.NONE:
        looping.value = false;
        audio.value.removeEventListener("ended", handleRepeatOnce);
        repeatCount.value = 0;
        break;
      case RepeatMode.ONCE:
        looping.value = false;
        audio.value.addEventListener("ended", handleRepeatOnce);
        break;
      case RepeatMode.ALL:
        looping.value = true;
        audio.value.removeEventListener("ended", handleRepeatOnce);
        repeatCount.value = 0;
        break;
      }
    }
  });

  // Shuffle related reactive properties and methods.
  const shuffle = ref(false);
  function toggleShuffle() {
    shuffle.value = !shuffle.value;
  }

  function setShuffle(value: boolean) {
    shuffle.value = value;
  }

  watch(shuffle, (newValue) => {
    if (!originalQueue.value || !queue.value || !peek.value) {
      return;
    }
    if (originalQueue.value.length === 0 || queue.value.length === 0) {
      return;
    }
    if (newValue) {
      if (_.isEqual(originalQueue.value, queue.value)) {
        const newQueue = shuffleQueue();
        setQueue(newQueue);
      }
    }
    else {
      if (_.isEqual(originalQueue.value, queue.value)) {
        return;
      }
      const currentTrackIndex = originalQueue.value.findIndex((track) => track.id === peek.value!.id);
      setCurrentIndex(currentTrackIndex);
      setQueue(originalQueue.value);
    }
  });

  watch(originalQueue, (newOriginalQueue) => {
    if (!newOriginalQueue || !queue.value || !peek.value) {
      return;
    }
    if (newOriginalQueue.length === 0 || queue.value.length === 0) {
      return;
    }
    if (shuffle.value) {
      if (_.isEqual(newOriginalQueue, queue.value)) {
        const newQueue = shuffleQueue();
        setQueue(newQueue);
      }
    }
    else {
      if (_.isEqual(newOriginalQueue, queue.value)) {
        return;
      }
      const currentTrackIndex = newOriginalQueue.findIndex((track) => track.id === peek.value!.id);
      setCurrentIndex(currentTrackIndex);
      setQueue(newOriginalQueue);
    }
  });

  // Play/Pause related reactive properties and methods.

  const isAudioAvailable = computed(() => audio.value && audio.value.src !== "");
  const isPlaying = computed(() => audio.value && (!audio.value.paused || !audio.value.ended));

  function loadAndPlay() {
    if (audio.value && audio.value.src !== "") {
      audio.value.load();
      if (repeatMode.value === RepeatMode.NONE && repeatCount.value > 0) {
        repeatCount.value = 0;
      }

      audio.value.play().catch((err) => {
        log.error(err);
      });
    }
  }

  function togglePlay() {
    if (audio.value) {
      if ((audio.value.paused || audio.value.ended) && audio.value.src) {
        if (repeatMode.value === RepeatMode.NONE && repeatCount.value > 0) {
          repeatCount.value = 0;
        }
        audio.value.play().catch((err) => {
          log.error(err);
        });
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "playing";
        }
      }
      else if (isPlaying.value) {
        audio.value.pause();
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "paused";
        }
      }
    }
  }

  // Volume related reactive properties and methods.
  const lastVolume = ref(1);
  const volume = computed({
    get: () => audio.value?.volume ?? 1,
    set: (value: number) => {
      if (audio.value) {
        audio.value.volume = value;
      }
    },
  });

  const isMuted = computed(() => volume.value === 0);
  function toggleMute() {
    if (volume.value > 0) {
      lastVolume.value = volume.value;
      volume.value = 0;
    }
    else {
      volume.value = lastVolume.value;
    }
  }

  function jumpVolume(amount: number) {
    if (isFinite(volume.value)) {
      const newVolume = Math.round((volume.value + amount) * 100) / 100;
      volume.value = Math.min(1, Math.max(0, newVolume));
    }
  }

  // Play next/previous related reactive properties and methods.
  function getNextSong() {
    if (queue.value.length <= 0) {
      return;
    }
    const song = dequeue();
    if (song) {
      window.api.loadAudioFile(song.storageLocation, true).catch((err) => {
        log.error(err);
      });
      if (
        (repeatMode.value === RepeatMode.ALL || (repeatMode.value === RepeatMode.ONCE && repeatCount.value === 0))
        && currentIndex.value > queue.value.length - 1
      ) {
        currentIndex.value = 0;
      }
    }
  }

  function getPreviousSong() {
    if (queue.value.length <= 0) {
      return;
    }
    const song = currentIndex.value > 0 ? queue.value[currentIndex.value - 1] : queue.value[0];
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
    if (song) {
      window.api.loadAudioFile(song.storageLocation, true).catch((err) => {
        log.error(err);
      });
    }
  }

  function skipPrevious() {
    if (audio.value) {
      if (currentTimeMs.value < 500) {
        getPreviousSong();
      }
      else {
        currentTime.value = 0;
      }
    }
  }

  return {
    audio,
    setAudio,
    readyState,
    currentTime,
    currentTimeMs,
    duration,
    currentTimeDisplay,
    durationDisplay,
    updateCurrentTimeDisplay,
    updateDurationDisplay,
    looping,
    repeatMode,
    repeatCount,
    incrementRepeatMode,
    setRepeatCount,
    shuffle,
    toggleShuffle,
    setShuffle,
    isAudioAvailable,
    isPlaying,
    loadAndPlay,
    togglePlay,
    volume,
    isMuted,
    toggleMute,
    jumpVolume,
    getNextSong,
    getPreviousSong,
    skipPrevious,
  };
});
