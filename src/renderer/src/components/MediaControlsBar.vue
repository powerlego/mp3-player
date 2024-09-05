<script setup lang="ts">
import { ComponentPublicInstance, computed, onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { FilePayload, I18nAriaLabels, RepeatMode } from "@/types";
import PlayButton from "@components/media-controls/PlayButton.vue";
import ProgressBar from "@components/ProgressBar.vue";
import RepeatButton from "@components/media-controls/RepeatButton.vue";
import ShuffleButton from "@components/media-controls/ShuffleButton.vue";
import SkipBackButton from "@components/media-controls/SkipBackButton.vue";
import SkipForwardButton from "@components/media-controls/SkipForwardButton.vue";
import SongArtists from "@components/song-details/SongArtists.vue";
import SongDetails from "@components/song-details/SongDetails.vue";
import SongName from "@components/song-details/SongName.vue";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";
import { useMediaKeyBindings } from "@stores/mediaKeyBindings";
import VolumeBar from "@components/volume-controls/VolumeBar.vue";
import VolumeButton from "@components/volume-controls/VolumeButton.vue";

const props = withDefaults(defineProps<{
  progressUpdateInterval?: number;
  volumeJumpStep?: number;
  i18nAriaLabels?: I18nAriaLabels;
}>(), {
  progressUpdateInterval: 0,
  volumeJumpStep: 0.05,
  i18nAriaLabels: () => ({
    player: "Audio player",
    progressControl: "Audio progress control",
    volumeControl: "Volume control",
    play: "Play",
    pause: "Pause",
    shuffle: "Enable shuffle",
    shuffleOn: "Disable shuffle",
    previous: "Previous",
    next: "Skip",
    loop: "Enable loop once",
    loopOnce: "Disable loop",
    loopOff: "Enable loop",
    volume: "Mute",
    volumeMute: "Unmute",
  }),
});

const audioStore = useAudio();
const mediaKeyBindingsStore = useMediaKeyBindings();

const { currentTimeDisplay, durationDisplay, isPlaying, shuffle, isMuted, repeatMode } = storeToRefs(audioStore);
const { getNextSong, play, pause, skipPrevious,
  togglePlay, jumpVolume, incrementRepeatMode, toggleMute, toggleShuffle } = audioStore;
const { keyBindings } = storeToRefs(mediaKeyBindingsStore);
const { combineKeyCodes } = mediaKeyBindingsStore;


const songName = ref("");
const songArtists = ref("");
const coverArt = ref("");

const container = useTemplateRef<HTMLDivElement>("container");
const progressBar = useTemplateRef<ComponentPublicInstance | null>("progressBar");

const volumeI18n = computed(() => {
  return isMuted ? props.i18nAriaLabels.volumeMute : props.i18nAriaLabels.volume;
});

const playPauseI18n = computed(() => {
  return isPlaying ? props.i18nAriaLabels.pause : props.i18nAriaLabels.play;
});

const shuffleI18n = computed(() => {
  return shuffle ? props.i18nAriaLabels.shuffleOn : props.i18nAriaLabels.shuffle;
});

const repeatI18n = computed(() => {
  switch (repeatMode.value) {
  case RepeatMode.ALL:
    return props.i18nAriaLabels.loop;
  case RepeatMode.ONCE:
    return props.i18nAriaLabels.loopOnce;
  case RepeatMode.NONE:
    return props.i18nAriaLabels.loopOff;
  default:
    return "";
  }
});

function handleKeyDown(event: KeyboardEvent) {
  const keys = combineKeyCodes(event);
  event.preventDefault();
  switch (keys) {
  case keyBindings.value.playPause:
    if (!container.value) {
      return;
    }
    if (!progressBar.value) {
      return;
    }
    if (event.target === container.value || event.target === progressBar.value.$el) {
      togglePlay();
    }
    break;
  case keyBindings.value.volumeUp:
    jumpVolume(props.volumeJumpStep);
    break;
  case keyBindings.value.volumeDown:
    jumpVolume(-props.volumeJumpStep);
    break;
  case keyBindings.value.repeat:
    incrementRepeatMode();
    break;
  case keyBindings.value.mute:
    toggleMute();
    break;
  case keyBindings.value.shuffle:
    toggleShuffle();
    break;
  case keyBindings.value.jumpForward:
    getNextSong();
    break;
  case keyBindings.value.jumpBackward:
    skipPrevious();
    break;
  default:
    break;
  }
}

function handleFileOpen(_event: Electron.IpcRendererEvent, file: FilePayload) {
  songName.value = file.metadata.common.title ?? "";
  songArtists.value = file.metadata.common.artist ?? "";
  if (file.picture.base64 !== "") {
    coverArt.value = `data:${file.picture.format};base64,${file.picture.base64}`;
  }
  if ("mediaSession" in navigator) {
    const artwork = file.pictures.map((picture) => {
      return {
        src: `data:${file.picture.format};base64,${file.picture.base64}`,
        sizes: picture.dimensions,
        type: picture.format,
      };
    });
    const artist = (() => {
      if (file.metadata.common.artist) {
        const artists = file.metadata.common.artist.split(",");
        if (artists.length > 1) {
          return artists.join(", ");
        }
        return artists[0];
      }
      return "";
    })();

    navigator.mediaSession.metadata = new MediaMetadata({
      title: file.metadata.common.title ?? "",
      artist,
      album: file.metadata.common.album ?? "",
      artwork,
    });
  }
}

onMounted(() => {
  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("previoustrack", skipPrevious);
    navigator.mediaSession.setActionHandler("nexttrack", getNextSong);
  }
});

onUnmounted(() => {
  window.api.off("open-file", handleFileOpen);
});

</script>

<template>
  <div
    ref="container"
    tabindex="0"
    :aria-label="props.i18nAriaLabels.player"
    @keydown="handleKeyDown"
  >
    <div class="flex flex-row items-center justify-between w-full h-full">
      <SongDetails :cover-art="coverArt">
        <template #song-artists>
          <SongArtists :artist-names="songArtists" />
        </template>
        <template #song-name>
          <SongName :song-name="songName" />
        </template>
      </SongDetails>
      <div class="flex w-1/2 min-w-fit max-w-[45rem] flex-col items-center justify-center">
        <div class="flex flex-row items-center w-full gap-3 mb-1 justify-evenly">
          <div class="flex items-center justify-end flex-1 w-full gap-2">
            <ShuffleButton :aria-label="shuffleI18n" />
            <SkipBackButton :aria-label="props.i18nAriaLabels.previous" />
          </div>
          <PlayButton :aria-label="playPauseI18n" />
          <div class="flex items-center justify-start flex-1 w-full gap-2">
            <SkipForwardButton :aria-label="props.i18nAriaLabels.next" />
            <RepeatButton :aria-label="repeatI18n" />
          </div>
        </div>
        <div class="flex flex-row items-center w-full gap-2 justify-evenly">
          <div class="min-w-[2.5rem] text-xs text-gray-800 dark:text-gray-250 text-right">
            {{ currentTimeDisplay }}
          </div>
          <ProgressBar
            ref="progressBar"
            :aria-label="props.i18nAriaLabels.progressControl"
            :progress-update-interval="props.progressUpdateInterval"
          />
          <div class="min-w-[2.5rem] text-xs text-gray-800 dark:text-gray-250 text-left">
            {{ durationDisplay }}
          </div>
        </div>
      </div>
      <div class="w-[20%] min-w-[11.25rem] flex flex-row justify-end items-center">
        <div class="flex items-center justify-end flex-grow">
          <div
            class="flex items-center"
            style="flex: 0 1 7.75rem;"
          >
            <VolumeButton :aria-label="volumeI18n" />
            <VolumeBar :aria-label="props.i18nAriaLabels.volumeControl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
