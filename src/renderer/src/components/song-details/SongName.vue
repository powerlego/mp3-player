<script setup lang="ts">
import { IterationType } from "@/types";
import { useScrollingAnimation } from "@composables/scrollingAnimation";
import { useTemplateRef } from "vue";

const props = withDefaults(defineProps<{
  songName: string;
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

const container = useTemplateRef<HTMLDivElement>("container");
const offset = useTemplateRef<HTMLDivElement>("offset");
const { handleMouseOver, handleMouseOut } = useScrollingAnimation(
  container,
  offset,
  {
    speed: props.speed,
    pauseAtEndEdgeDurationMs: props.pauseAtEndEdgeDurationMs,
    initialMouseIntDelayMs: props.initialMouseIntDelayMs,
    iterationType: props.iterationType,
  },
);

</script>

<template>
  <div
    class="w-full justify-self-start grid-in-title"
    @blur="handleMouseOut"
    @focus="handleMouseOver"
    @mouseover="handleMouseOver"
    @mouseout="handleMouseOut"
  >
    <div
      ref="container"
      class="relative overflow-hidden -mx-1.5"
      style="mask-image: linear-gradient(90deg, transparent 0, black 6px, black calc(100% - 12px), transparent ); -webkit-mask-image: linear-gradient(90deg, transparent 0, black 6px, black calc(100% - 12px), transparent );"
    >
      <div class="overflow-hidden">
        <div
          ref="offset"
          class="flex w-fit whitespace-nowrap translate-x-[var(--trans-x)] ps-1.5 pe-3"
        >
          <span class="text-base font-semibold text-gray-900 cursor-default dark:text-gray-100">
            {{ props.songName }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
