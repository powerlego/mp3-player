<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAudio } from "@stores/audio";
import { usePositionX } from "@composables/positionX";

const props = withDefaults(defineProps<{
  initialVolume?: number;
}>(), {
  initialVolume: 1,
});

const { getPositionX } = usePositionX();
const { audio, volume, isAudioAvailable } = storeToRefs(useAudio());

const volumeBar = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);
const lastVolume = ref(props.initialVolume);
const currentVolumePosition = ref(`${((lastVolume.value / 1) * 100).toFixed(2)}%`);

function getCurrentVolume(event: MouseEvent | TouchEvent) {
  if (!audio.value) {
    return { currentVolumeValue: lastVolume.value, currentVolumePositionValue: `${((lastVolume.value / 1) * 100).toFixed(2)}%` };
  }
  if (!volumeBar.value) {
    return { currentVolumeValue: volume.value === -1 ? lastVolume.value : volume.value, currentVolumePositionValue: `${((lastVolume.value / 1) * 100).toFixed(2)}%` };
  }

  const { left, width: maxRelativePosition } = volumeBar.value.getBoundingClientRect();

  return { currentVolumeValue: Math.min(Math.max((getPositionX(event) - left) / maxRelativePosition, 0), 1), currentVolumePositionValue: `${(Math.min(Math.max((getPositionX(event) - left) / maxRelativePosition, 0), 1) * 100).toFixed(2)}%` };
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
    const { currentVolumeValue, currentVolumePositionValue } = getCurrentVolume(event);
    volume.value = currentVolumeValue;
    currentVolumePosition.value = currentVolumePositionValue;
  }
}

function handleMouseOrTouchUp(event: MouseEvent | TouchEvent) {
  event.stopPropagation();
  isDragging.value = false;
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
  const { currentVolumeValue, currentVolumePositionValue } = getCurrentVolume(event);
  volume.value = currentVolumeValue;
  currentVolumePosition.value = currentVolumePositionValue;
  isDragging.value = true;
  if (event instanceof MouseEvent) {
    window.addEventListener("mousemove", handleMouseOrTouchMove);
    window.addEventListener("mouseup", handleMouseOrTouchUp);
  }
  else {
    window.addEventListener("touchmove", handleMouseOrTouchMove);
    window.addEventListener("touchend", handleMouseOrTouchUp);
  }
}

function handleAudioVolumeChange() {
  if (!audio.value) {
    return;
  }
  lastVolume.value = volume.value;
  if (isDragging.value) {
    return;
  }
  currentVolumePosition.value = `${((volume.value / 1) * 100).toFixed(2)}%`;
}

onMounted(() => {
  audio.value?.addEventListener("volumechange", handleAudioVolumeChange);
});

onUnmounted(() => {
  audio.value?.removeEventListener("volumechange", handleAudioVolumeChange);
});

</script>

<template>
  <div
    v-if="volume === -1"
    ref="volumeBar"
    class="flex flex-row items-center justify-center flex-1 w-full h-5"
    role="progressbar"
  >
    <div class="box-border relative w-full h-1 rounded-full bg-gray-350 dark:bg-gray-750">
      <div class="box-border absolute z-10 h-full bg-gray-300 rounded-full dark:bg-gray-600" />
    </div>
  </div>
  <div
    v-else-if="!isAudioAvailable"
    ref="volumeBar"
    class="flex flex-row items-center justify-center flex-1 w-full h-5"
    role="progressbar"
  >
    <div class="box-border relative w-full h-1 rounded-full bg-gray-350 dark:bg-gray-750">
      <div class="box-border absolute z-10 h-full bg-gray-300 rounded-full dark:bg-gray-600" />
    </div>
  </div>
  <div
    v-else
    ref="volumeBar"
    class="flex flex-row items-center justify-center flex-1 w-full h-5 group"
    role="progressbar"
    aria-valuemax="100"
    aria-valuemin="0"
    :aria-valuenow="Number(currentVolumePosition.split('%')[0])"
    @mousedown="handleMouseDownOrTouchStart"
    @touchstart="handleMouseDownOrTouchStart"
    @contextmenu="($event) => $event.preventDefault()"
  >
    <div className="relative box-border h-1 w-full rounded-full bg-gray-350 dark:bg-gray-750">
      <div
        class="box-border absolute z-20 rounded-full h-13/4 aspect-square group-hover:scale-100"
        :class="{ 'scale-100': isDragging, 'scale-0': !isDragging }"
        :style="{ 'left': currentVolumePosition }"
      >
        <div
          class="absolute h-full w-full top-[calc((50%*-1)+1px)] ml-[calc(50%*-1)] box-border rounded-full shadow shadow-gray-800 dark:shadow-gray-250 group-hover:scale-100 group-hover:bg-gray-550 dark:group-hover:bg-gray-250"
          :class="{ 'bg-gray-550 dark:bg-gray-250': isDragging, 'bg-gray-450 dark:bg-gray-600': !isDragging }"
        />
        />
      </div>
      <div
        class="box-border absolute z-10 h-full rounded-full group-hover:bg-green-700 dark:group-hover:bg-green-600"
        :class="{ 'bg-green-700 dark:bg-green-600': isDragging, 'bg-gray-600 dark:bg-gray-250': !isDragging }"
      />
    </div>
  </div>
</template>
