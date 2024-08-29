<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import CurrentTime from "@components/CurrentTime.vue";
import Duration from "@components/Duration.vue";
import { FilePayload } from "@/types";
import PlayButton from "@components/PlayButton.vue";
import ProgressBar from "@components/ProgressBar.vue";
import RepeatButton from "@components/RepeatButton.vue";
import ShuffleButton from "@components/ShuffleButton.vue";
import SkipBackButton from "@components/SkipBackButton.vue";
import SkipForwardButton from "@components/SkipForwardButton.vue";
import SongArtists from "@components/SongArtists.vue";
import SongDetails from "@components/SongDetails.vue";
import SongName from "@components/SongName.vue";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";
import { useMediaKeyBindings } from "@stores/mediaKeyBindings";

const props = withDefaults(defineProps<{
  progressUpdateInterval?: number;
  volumeJumpStep?: number;
}>(), {
  progressUpdateInterval: 0,
  volumeJumpStep: 0.05,
});

const audioStore = useAudio();
const mediaKeyBindingsStore = useMediaKeyBindings();

const { audio } = storeToRefs(audioStore);
const { getNextSong, play, pause, skipPrevious,
  togglePlay, jumpVolume, incrementRepeatMode, toggleMute, toggleShuffle } = audioStore;
const { keyBindings } = storeToRefs(mediaKeyBindingsStore);
const { combineKeyCodes } = mediaKeyBindingsStore;


const songName = ref("");
const songArtists = ref("");
const coverArt = ref("");

const container = ref<HTMLDivElement | null>(null);

function handleKeyDown(event: KeyboardEvent) {
  const keys = combineKeyCodes(event);
  event.preventDefault();
  switch (keys) {
  case keyBindings.value.playPause:
    if (!container.value) {
      return;
    }
    if (event.target === container.value) {
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
  if (!audio.value) {
    return;
  }
  audio.value.addEventListener("ended", getNextSong);
  window.api.on("open-file", handleFileOpen);
  if ("mediaSession" in navigator) {
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);
    navigator.mediaSession.setActionHandler("previoustrack", skipPrevious);
    navigator.mediaSession.setActionHandler("nexttrack", getNextSong);
  }
});

onUnmounted(() => {
  if (!audio.value) {
    return;
  }
  audio.value.removeEventListener("ended", getNextSong);
  window.api.off("open-file", handleFileOpen);
});

</script>

<template>
  <div
    ref="container"
    tabindex="0"
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
            <ShuffleButton />
            <SkipBackButton />
          </div>
          <PlayButton />
          <div class="flex items-center justify-start flex-1 w-full gap-2">
            <SkipForwardButton />
            <RepeatButton />
          </div>
        </div>
        <div class="flex flex-row items-center w-full gap-2 justify-evenly">
          <CurrentTime class="text-right" />
          <ProgressBar :progress-update-interval="props.progressUpdateInterval" />
          <Duration class="text-left" />
        </div>
      </div>
      <div class="w-[20%] min-w-[11.25rem] flex flex-row justify-end items-center">
        <div class="flex items-center justify-end flex-grow">
          <div
            class="flex items-center"
            style="flex: 0 1 7.75rem;"
          >
            <!-- VolumeButton -->
            <!-- VolumeBar -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
