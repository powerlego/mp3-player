<!-- eslint-disable @typescript-eslint/no-misused-promises -->
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";
import { FilePayload } from "@/types";
import log from "electron-log/renderer";
import MainWindow from "@components/MainWindow.vue";
import MediaControlsBar from "@components/MediaControlsBar.vue";
import Sidebar from "@components/Sidebar.vue";
import { storeToRefs } from "pinia";
import Topbar from "@components/Topbar.vue";
import { useAudio } from "@stores/audio";

const audioStore = useAudio();
const { audio } = storeToRefs(audioStore);
const { loadAndPlay } = audioStore;
const { setAudio } = audioStore;
const audioElement = useTemplateRef<HTMLAudioElement>("audioElement");
const audioSrc = ref("");

function playAudio() {
  if (audio.value) {
    if (audioSrc.value !== "") {
      loadAndPlay();
    }
    else {
      log.error("Audio source is empty");
    }
  }
}

async function handleFileOpen(_event: Electron.IpcRendererEvent, file: FilePayload, play: boolean) {
  audioSrc.value = URL.createObjectURL(new Blob([file.uint8Array], { type: "audio/mpeg" }));
  await nextTick();
  if (play) {
    playAudio();
  }
}

watch(audioElement, (value) => {
  if (value) {
    setAudio(value);
  }
});

watch(audioSrc, () => {
  if (audioElement.value) {
    setAudio(audioElement.value);
  }
});


onMounted(() => {
  window.api.on("open-file", handleFileOpen);
});

onUnmounted(() => {
  window.api.off("open-file", handleFileOpen);
});

</script>

<template>
  <audio
    v-if="audioSrc !== ''"
    ref="audioElement"
    :src="audioSrc"
    preload="none"
    :controls="false"
  />
  <audio
    v-else
    ref="audioElement"
    preload="none"
    :controls="false"
  />
  <div
    class="relative grid w-full h-full min-h-full overflow-y-hidden grid-areas-layout grid-rows-layout grid-cols-layout"
  >
    <Topbar class="z-10 flex flex-row items-center w-full h-16 m-0 grid-in-main-view justify-evenly" />
    <Sidebar class="z-20 w-56 m-0 text-gray-800 grid-in-nav-bar bg-gray-150 dark:bg-gray-900 dark:text-white" />
    <MediaControlsBar
      class="grid-in-now-playing z-30 h-[90px] w-full bg-gray-220 dark:bg-gray-880 px-4 outline-nothing"
    />
    <MainWindow class="flex flex-col w-full overflow-hidden grid-in-main-view bg-gray-180 dark:bg-gray-860" />
  </div>
</template>
