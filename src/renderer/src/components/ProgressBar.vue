<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";
import { MediaReadyState } from "@/types";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";
import { usePositionX } from "@composables/positionX";
import { useThrottle } from "@composables/throttle";

const props = withDefaults(defineProps<{
  progressUpdateInterval?: number;
}>(), {
  progressUpdateInterval: 0,
});

const { getPositionX } = usePositionX();
const { throttle } = useThrottle();

const { audio, readyState, duration, currentTime, isAudioAvailable } = storeToRefs(useAudio());

const progress = useTemplateRef<HTMLDivElement>("progress");
const isDragging = ref(false);
const timeOnMouseMove = ref(0);
const currentTimePosition = ref("0.00%");

function getCurrentProgress(event: MouseEvent | TouchEvent) {
  if (!progress.value) {
    return { currentTimeValue: 0, currentTimePositionValue: "0.00%" };
  }
  const { left, width: maxRelativePosition } = progress.value.getBoundingClientRect();

  const relativePosition = Math.min(Math.max(getPositionX(event) - left, 0), maxRelativePosition);
  const currentTimeValue = (duration.value * relativePosition) / maxRelativePosition;
  const currentTimePositionValue = `${((relativePosition / maxRelativePosition) * 100).toFixed(2)}%`;
  return { currentTimeValue, currentTimePositionValue };
}

function handleMouseOrTouchMove(event: MouseEvent | TouchEvent) {
  if (event instanceof MouseEvent) {
    event.preventDefault();
  }
  event.stopPropagation();
  if (!audio.value) {
    return;
  }

  const windowSelection = window.getSelection();
  if (windowSelection && windowSelection.type === "Range") {
    windowSelection.removeAllRanges();
  }
  if (isDragging.value) {
    const { currentTimeValue, currentTimePositionValue } = getCurrentProgress(event);
    timeOnMouseMove.value = currentTimeValue;
    currentTimePosition.value = currentTimePositionValue;
  }
}

function handleMouseOrTouchUp(event: MouseEvent | TouchEvent) {
  event.stopPropagation();
  isDragging.value = false;
  if (!audio) {
    return;
  }
  if (readyState.value === MediaReadyState.HAVE_NOTHING
    || readyState.value === MediaReadyState.HAVE_METADATA
    || !isFinite(timeOnMouseMove.value)) {
    currentTimePosition.value = "0.00%";
  }
  else {
    currentTime.value = timeOnMouseMove.value;
  }
  if (event instanceof MouseEvent) {
    window.removeEventListener("mousemove", handleMouseOrTouchMove);
    window.removeEventListener("mouseup", handleMouseOrTouchUp);
  }
  else {
    window.removeEventListener("touchmove", handleMouseOrTouchMove);
    window.removeEventListener("touchend", handleMouseOrTouchUp);
  }
}

function handleMouseDownOrTouchStart(event: MouseEvent | TouchEvent) {
  event.stopPropagation();
  if (!audio.value) {
    return;
  }
  isDragging.value = true;
  const { currentTimeValue, currentTimePositionValue } = getCurrentProgress(event);
  if (isFinite(currentTimeValue)) {
    timeOnMouseMove.value = currentTimeValue;
    isDragging.value = true;
    currentTimePosition.value = currentTimePositionValue;
    if (event instanceof MouseEvent) {
      window.addEventListener("mousemove", handleMouseOrTouchMove);
      window.addEventListener("mouseup", handleMouseOrTouchUp);
    }
    else {
      window.addEventListener("touchmove", handleMouseOrTouchMove);
      window.addEventListener("touchend", handleMouseOrTouchUp);
    }
  }
}

const handleAudioTimeUpdate = throttle((_event: Event) => {
  if (isDragging.value) {
    return;
  }
  currentTimePosition.value = `${((currentTime.value / duration.value) * 100).toFixed(2)}%`;
}, props.progressUpdateInterval);

onMounted(() => {
  audio.value?.addEventListener("timeupdate", handleAudioTimeUpdate);
});

onUnmounted(() => {
  audio.value?.removeEventListener("timeupdate", handleAudioTimeUpdate);
});

</script>

<template>
  <div
    v-if="isAudioAvailable"
    ref="progress"
    aria-valuemax="100"
    aria-valuemin="0"
    :aria-valuenow="Number(currentTimePosition.split('%')[0])"
    class="flex flex-row items-center justify-center flex-1 w-4/5 h-5 group"
    role="progressbar"
    @mousedown="handleMouseDownOrTouchStart"
    @touchstart="handleMouseDownOrTouchStart"
  >
    <div class="box-border relative w-full h-1 rounded-full bg-gray-350 dark:bg-gray-750 ">
      <div
        class="box-border absolute z-20 rounded-full h-13/4 aspect-square group-hover:scale-100"
        :class="{ 'scale-100': isDragging, 'scale-0': !isDragging }"
        :style="{ 'left': currentTimePosition }"
      >
        <div
          class="absolute h-full w-full top-[calc((50%*-1)+1px)] ml-[calc(50%*-1)] box-border rounded-full group-hover:bg-gray-550 dark:group-hover:bg-gray-250 shadow shadow-gray-800 dark:shadow-gray-250"
          :class="{ 'bg-gray-550 dark:bg-gray-250': isDragging, 'bg-gray-450 dark:bg-gray-600': !isDragging }"
        />
      </div>
      <div
        class="box-border absolute z-10 h-full rounded-full group-hover:bg-green-700 dark:group-hover:bg-green-600"
        :class="{ 'bg-green-700 dark:bg-green-600': isDragging, 'bg-gray-550 dark:bg-gray-250': !isDragging }"
        :style="{ 'width': currentTimePosition }"
      />
    </div>
  </div>
  <div
    ref="progress"
    class="flex flex-row items-center justify-center flex-1 w-4/5 h-5 group"
    role="progressbar"
  >
    <div class="box-border relative w-full h-1 rounded-full bg-gray-350 dark:bg-gray-750">
      <div class="box-border absolute z-10 h-full bg-gray-300 rounded-full dark:bg-gray-600" />
    </div>
  </div>
</template>
