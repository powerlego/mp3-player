<script setup lang="ts">
import { computed, ref } from "vue";
import { IterationType } from "@/types";
import { useScrollingAnimation } from "@composables/scrollingAnimation";

const props = withDefaults(defineProps<{
  artistNames: string;
  speed?: number;
  pauseAtEndEdgeDurationMs?: number;
  initialMouseIntDelayMs?: number;
  iterationType?: IterationType;
}>(), {
  speed: 0.2,
  pauseAtEndEdgeDurationMs: 1200,
  initialMouseIntDelayMs: 200,
  iterationType: IterationType.SINGLE,
});

const containerRef = ref<HTMLDivElement | null>(null);
const offsetRef = ref<HTMLDivElement | null>(null);
const { handleMouseOver, handleMouseOut } = useScrollingAnimation(
  containerRef,
  offsetRef,
  {
    speed: props.speed,
    pauseAtEndEdgeDurationMs: props.pauseAtEndEdgeDurationMs,
    initialMouseIntDelayMs: props.initialMouseIntDelayMs,
    iterationType: props.iterationType,
  },
);
const artists = computed(() => {
  const artistNames = props.artistNames.split(",");
  const output: string[] = [];
  artistNames.forEach((artistName, index) => {
    output.push(artistName);
    if (index < artistNames.length - 1) {
      output.push(",");
    }
  });
  return output;
});

</script>

<template>
  <div
    class="w-full min-w-0"
    style="grid-area: subtitle; grid-column-start: badges;"
    @blur="handleMouseOut"
    @focus="handleMouseOver"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
  >
    <div
      ref="containerRef"
      class="relative overflow-hidden -mx-1.5"
      style="mask-image: linear-gradient(90deg, transparent 0, black 6px, black calc(100% - 12px), transparent ); -webkit-mask-image: linear-gradient(90deg, transparent 0, black 6px, black calc(100% - 12px), transparent );"
    >
      <div class="overflow-hidden">
        <div
          ref="offsetRef"
          class="flex w-fit whitespace-nowrap translate-x-[var(--trans-x)] ps-1.5 pe-3"
        >
          <template
            v-for="(artist, index) in artists"
            :key="'artist-name-'+index"
          >
            <span
              v-if="artist === ','"
              class="text-sm font-normal text-gray-800 truncate cursor-default dark:text-gray-200"
            >
              ,&nbsp;
            </span>
            <span
              v-else
              class="text-sm font-normal text-gray-900 truncate cursor-default dark:text-gray-100 hover:underline"
            >
              {{ artist }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
