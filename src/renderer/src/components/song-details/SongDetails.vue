<script setup lang="ts">
import ChevronDownIcon from "@icons/chevron_down.svg";
import ChevronUpIcon from "@icons/chevron_up.svg";
import { storeToRefs } from "pinia";
import { useSongDetailsExpand } from "@stores/songDetailsExpand";

const songDetailsExpandStore = useSongDetailsExpand();
const { expanded } = storeToRefs(songDetailsExpandStore);
const { expandSongDetails } = songDetailsExpandStore;

const props = defineProps<{
  coverArt: string;
}>();

</script>

<template>
  <div class="m-0 flex flex-row items-center h-full w-[30%] min-w-[11.25rem]">
    <div
      v-if="props.coverArt"
      class="relative h-4/5 aspect-square group/parent"
      :class="{ 'scale-0': expanded }"
    >
      <div class="absolute top-0 right-0 scale-0 group/tooltip group-hover/parent:scale-100">
        <div
          class="absolute right-0 top-0 object-cover rounded-full bg-opacity-75 dark:bg-opacity-75 bg-gray-350 dark:bg-black w-5 h-5 m-0.5 flex items-center justify-center hover:h-6 hover:w-6"
          @click="expandSongDetails"
        >
          <ChevronUpIcon
            v-if="!expanded"
            class="fill-gray-800 dark:fill-gray-200 h-[90%] w-[90%] m-0 opacity-100 stroke-gray-800 dark:stroke-gray-200 hover:stroke-1"
          />
          <ChevronDownIcon
            v-else
            class="fill-gray-800 dark:fill-gray-200 h-[90%] w-[90%] m-0 opacity-100 stroke-gray-800 dark:stroke-gray-200 hover:stroke-1"
          />
        </div>
      </div>
      <img
        :src="props.coverArt"
        alt="Cover Art"
        class="w-full h-full rounded shadow-cover-art shadow-black/50 dark:shadow-gray-800/50"
        :class="{ 'scale-0': expanded }"
      >
    </div>
    <div
      class="grid items-center mx-4 gap-x-2 grid-areas-songDetails grid-cols-songDetails grid-rows-songDetails"
      :class="{ '-translate-x-20': expanded }"
    >
      <slot name="song-name" />
      <slot name="song-artists" />
    </div>
  </div>
</template>
