<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { evaluate, round } from "mathjs";
import { SettingsNumberField } from "@/types";
import Tooltip from "@components/Tooltip.vue";

const props = defineProps<{
  field: SettingsNumberField;
  value: number;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const value = ref<string | number>(props.value);
const oldValue = ref<number>(props.value);
const timer = ref<ReturnType<typeof setTimeout> | null>(null);
const precision = computed(() => Math.max(0, props.field.precision ?? 0));
const max = computed(() => props.field.max ?? Number.MAX_SAFE_INTEGER);
const min = computed(() => props.field.min ?? Number.MIN_SAFE_INTEGER);

const SPEED = 50;
const DELAY = 500;

function stop() {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
}

function increment(recurse = false) {
  stop();
  let localValue = value.value as number;
  localValue += props.field.step ?? 1;
  localValue = round(localValue, precision.value);
  if (localValue > max.value) {
    localValue = max.value;
  }
  oldValue.value = value.value as number;
  value.value = localValue;
  if (localValue < max.value || isNaN(localValue)) {
    timer.value = setTimeout(() => increment(true), recurse ? SPEED : DELAY);
  }
}

function decrement(recurse = false) {
  stop();
  let localValue = value.value as number;
  localValue -= props.field.step ?? 1;
  localValue = round(localValue, precision.value);
  if (localValue < min.value) {
    localValue = min.value;
  }
  oldValue.value = value.value as number;
  value.value = localValue;
  if (localValue > min.value || isNaN(localValue)) {
    timer.value = setTimeout(() => decrement(true), recurse ? SPEED : DELAY);
  }
}

function clamp(value: number) {
  return Math.min(Math.max(value, min.value), max.value);
}

function evaluateExpression() {
  const localValue = value.value as string;
  try {
    let result = evaluate(localValue) as number | undefined;
    if (typeof result === "undefined" || isNaN(result)) {
      const oldValueClamped = clamp(oldValue.value);
      value.value = oldValueClamped;
      oldValue.value = oldValueClamped;
      emit("change", oldValueClamped);
    }
    else {
      result = round(result, precision.value);
      if (result < min.value || result > max.value) {
        const oldValueClamped = clamp(oldValue.value);
        value.value = oldValueClamped;
        oldValue.value = oldValueClamped;
        emit("change", oldValueClamped);
      }
      value.value = result;
      oldValue.value = result;
      emit("change", result);
    }
  }
  catch (_error) {
    const oldValueClamped = clamp(oldValue.value);
    value.value = oldValueClamped;
    oldValue.value = oldValueClamped;
    emit("change", oldValueClamped);
  }
}


function handleMouseUp() {
  stop();
  emit("change", value.value);
}

function handleMouseDown(dir: "up" | "down") {
  if (dir === "up") {
    increment();
  }
  else {
    decrement();
  }
}

</script>

<template>
  <div :id="`field-number-${props.field.key}-${useId()}`">
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
      <div
        className="flex flex-row w-full content-center rounded-lg m-0.5 p-1 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 transition-[border-color] duration-300 ease-out focus-within:m-0 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:border-2 outline-nothing group"
      >
        <input
          v-model="value"
          :aria-label="props.field.label"
          class="w-full text-sm text-black bg-gray-100 dark:text-white dark:bg-gray-800 focus:outline-none"
          type="text"
          @blur="evaluateExpression"
          @keydown.enter="evaluateExpression"
        >
        <div class="w-5 flex flex-col gap-[1px]">
          <button
            aria-label="button"
            class="transition-[opacity, background-color] duration-300 ease-out opacity-0 group-hover:opacity-100 py-1 w-full h-1/2 rounded-t-md bg-gray-50 dark:bg-gray-650 hover:bg-gray-150 dark:hover:bg-gray-500 active:bg-gray-200 dark:active:bg-gray-700"
            @mousedown="handleMouseDown('up')"
            @mouseup="handleMouseUp"
          >
            <svg
              class="w-3/4 h-full mx-auto stroke-2 fill-none stroke-black dark:stroke-white"
              viewBox="0 0 26 16"
            >
              <path
                class="non-scale-stroke"
                d="M 0.99999989,14.353554 13,2.3535533 25,14.353554"
              />
            </svg>
          </button>
          <button
            aria-label="button"
            class="opacity-0 transition-[opacity, background-color] duration-300 ease-out group-hover:opacity-100 w-full py-1 h-1/2 rounded-b-md bg-gray-50 dark:bg-gray-650 hover:bg-gray-150 dark:hover:bg-gray-500 active:bg-gray-200 dark:active:bg-gray-700"
            @mousedown="handleMouseDown('down')"
            @mouseup="handleMouseUp"
          >
            <svg
              class="w-3/4 h-full mx-auto stroke-2 fill-none stroke-black dark:stroke-white"
              viewBox="0 0 26 16"
            >
              <path
                class="non-scale-stroke"
                d="M 0.99999989,1.6464465 13,13.646447 25,1.6464465"
              />
            </svg>
          </button>
        </div>
      </div>
    </Tooltip>
  </div>
</template>
