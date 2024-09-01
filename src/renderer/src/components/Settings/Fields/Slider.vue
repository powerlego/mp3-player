<script setup lang="ts">
import { ref, watch } from "vue";
import { SettingsSliderField } from "@/types";
import Tooltip from "@components/Tooltip.vue";

const props = defineProps<{
  field: SettingsSliderField;
  value: number;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const value = ref<string | number>(props.value);

watch(value, (newValue) => {
  if (typeof newValue === "string") {
    if (newValue.includes(".")) {
      emit("change", parseFloat(newValue));
    }
    else {
      emit("change", parseInt(newValue, 10));
    }
  }
  else {
    emit("change", newValue);
  }
});

</script>

<template>
  <div :id="'field-slider-' + props.field.key">
    <div
      :aria-label="props.field.label"
      class="mb-3 text-base font-bold text-black dark:text-white"
    >
      {{ props.field.label }}
    </div>
    <Tooltip
      class="w-full"
      :content="props.field.description ?? ''"
    >
      <input
        v-model="value"
        class="w-11/12 my-3 mx-0 bg-transparent transition-opacity ease-[ease] duration-200 opacity-[0.85] dark:opacity-100 hover:opacity-100 dark:hover:opacity-[0.85] outline-nothing webkit-appear-none webkit-animation-0-2s slider-field"
        :max="props.field.max ?? 100"
        :min="props.field.min ?? 0"
        :step="props.field.step ?? 1"
        type="range"
      >
      <label class="w-1/12 p-1 text-base">{{ value }}</label>
    </Tooltip>
  </div>
</template>

<style>
.slider-field::-webkit-slider-runnable-track {
  @apply rounded-md w-full h-3 cursor-pointer bg-black bg-opacity-10 focus:bg-opacity-[0.15]dark:bg-white dark:bg-opacity-5 border-all-0;
}

.slider-field:focus::-webkit-slider-runnable-track {
  @apply bg-opacity-[0.15] dark:bg-opacity-10;
}

.slider-field::-webkit-slider-thumb {
  @apply w-4 h-8 -mt-3 bg-blue-500 cursor-pointer rounded-xl border-all-0 webkit-appear-none;
}

.slider-field:focus::-webkit-slider-thumb {
  @apply bg-blue-300;
}
</style>
