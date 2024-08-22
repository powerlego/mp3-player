<script setup lang="ts">
import { computed } from "vue";
import CoverPlay from "@icons/cover_play.svg";
import ImageCard from "./ImageCard.vue";
import log from "electron-log/renderer";

const props = defineProps<{
  fileLocation: string;
}>();

function onClickButton() {
  window.api.loadAudioFile(props.fileLocation, true).catch((e) => log.error(e));
}

const resource = await window.api.getAudioInfo(props.fileLocation).catch((e) => {
  log.error(e);
  return {
    title: "Unknown",
    artist: "Unknown",
    pictureBase64: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABKklEQVQ4jZWTsUoDQRCFv7",
    pictureFormat: "png",
  };
});

const artist = computed(() => {
  const artists = resource.artist.split(",");
  if (artists.length > 1) {
    return artists.join(", ");
  }
  return artists[0];
});

</script>
<template>
  <ImageCard
    :line1="resource.title"
    :line2="artist"
    loading="lazy"
    :src="`data:image/${resource.pictureFormat};base64,${resource.pictureBase64}`"
    :on-click-button="onClickButton"
  >
    <template #icon>
      <span
        class="box-border relative flex items-center justify-center rounded-full bg-green-550 group-hover/button:scale-105"
        style="-webkit-tap-highlight-color: transparent; min-block-size: 48px; inline-size: 48px; block-size: 48px;"
      >
        <span class="absolute flex top-3 left-3 ">
          <CoverPlay class="fill-black" />
        </span>
      </span>
    </template>
  </ImageCard>
</template>
