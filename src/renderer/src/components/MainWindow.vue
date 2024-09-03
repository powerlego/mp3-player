<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import Shelf from "./Shelf.vue";
import SongCoverCard from "@components/cards/SongCoverCard.vue";
import { storeToRefs } from "pinia";
import { useQueue } from "@stores/queue";

const queueStore = useQueue();
const { queue } = storeToRefs(queueStore);
const { shuffleQueue } = queueStore;

const recentlyPlayedList = [
  "G:\\Music\\0-59.mp3",
  "G:\\Music\\Asteroid 2467 - single version.mp3",
  "G:\\Music\\0-59.mp3",
  "G:\\Music\\0-59.mp3",
  "G:\\Music\\0-59.mp3",
  "G:\\Music\\0-59.mp3",
  "G:\\Music\\0-59.mp3",
];

const recentlyPlayedShelf = useTemplateRef<InstanceType<typeof Shelf>>("shelf");
const recentlyPlayedColumnCount = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  return recentlyPlayedShelf.value?.columns.count ?? 2;
});

</script>

<template>
  <div>
    <div class="sticky top-0 h-16">
      <section>
        <div class="flex flex-col pt-6 isolate">
          <div
            class="flex flex-row gap-6 px-4"
            style="flex-flow: row wrap;"
          >
            <Shelf title="Recently Played">
              <template v-for="(file, index) in recentlyPlayedList">
                <SongCoverCard
                  v-if="index < recentlyPlayedColumnCount"
                  :key="'recently-played-' + index"
                  :file-location="file"
                />
              </template>
            </Shelf>
            <button
              class="w-full h-8 bg-black dark:bg-white"
              @click="() => console.log(shuffleQueue())"
            >
              Shuffle
            </button>
          </div>
        </div>
      </section>
      <div
        class="grid items-center justify-center w-full h-full grid-cols-1 mx-2 overflow-y-scroll auto-rows-min sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      />
    </div>
  </div>
</template>
