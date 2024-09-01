<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { SettingsDropdownField } from "@/types";
import Tooltip from "@components/Tooltip";

const props = defineProps<{
  field: SettingsDropdownField;
  value: string | number;
}>(); // Define the props for the component

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>(); // Define the emit for the component

const isOpen = ref(false);
const value = ref(props.value);
const options = ref(
  [
    {
      label: "-- Select One --",
      value: "hide",
    },
    ...props.field.options,
  ],
);
const currentIndex = ref(
  options.value.findIndex((option) => option.value === props.value) === -1
    ? 0
    : options.value.findIndex((option) => option.value === props.value),
);
const outsideClickRef = ref<HTMLDivElement | null>(null);

function handleChange(event: Event) {
  emit("change", (event.target as HTMLSelectElement).value);
}

function handleOutsideClick(event: MouseEvent) {
  if (
    outsideClickRef.value && !outsideClickRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function handleOptionClick(event: MouseEvent) {
  if (!event.currentTarget) {
    return;
  }
  const val = (event.currentTarget as HTMLElement).getAttribute("data-value") ?? "hide";
  const index = options.value.findIndex((option) => option.value === val);
  value.value = val;
  currentIndex.value = index;
  isOpen.value = false;
  emit("change", val);
}

onMounted(() => {
  document.addEventListener("mousedown", handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleOutsideClick);
});

</script>

<template>
  <div :id="'field-dropdown-' + props.field.key">
    <div class="mb-3 text-base font-bold text-black dark:text-white">
      {{ props.field.label }}
    </div>
    <Tooltip
      class="w-full"
      :content="props.field.description ?? ''"
    >
      <div
        ref="outsideClickRef"
        class="relative w-full h-10 text-sm text-black cursor-pointer dark:text-white"
      >
        <select
          :aria-label="props.field.label"
          class="invisible hidden"
          :value="value"
          @change="handleChange"
        >
          <option
            v-for="(opt, idx) in options"
            :key="props.field.key + '-' + idx + '-option'"
            :aria-label="opt.label"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <ul
          class="absolute top-full w-full z-[999] m-0 p-0 list-none peer outline-nothing"
          :class="{ 'block': isOpen, 'hidden': !isOpen }"
        >
          <template
            v-for="(opt, idx) in options"
            :key="props.field.key + '-' + idx"
          >
            <li
              v-if="opt.value === 'hide'"
              class="m-0 py-2 indent-4 transition-all duration-150 ease-in bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hidden border-t border-solid border-gray-350 dark:border-gray-700 outline-nothing [&:nth-child(2)]:rounded-t-lg last:rounded-b-lg last:mb-1"
              tabindex="0"
              :data-value="opt.value"
              @click="handleOptionClick"
            >
              {{ opt.label }}
            </li>
            <li
              v-else
              class="m-0 py-2 indent-4 transition-all duration-150 ease-in bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border-t border-solid border-gray-350 dark:border-gray-700 outline-nothing [&:nth-child(2)]:rounded-t-lg last:rounded-b-lg last:mb-1"
              tabindex="0"
              :data-value="opt.value"
              @click="handleOptionClick"
            />
          </template>
        </ul>
        <div
          tabindex="0"
          class="absolute w-full rounded-lg py-2 px-4 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 outline-nothing transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 focus:border-2 dark:focus:border-blue-400 peer-focus-within:m-0 peer-focus-within:border-blue-500 peer-focus-within:border-2 peer-focus-within:focus:border-blue-400 after:w-0 after:h-0 after:absolute after:right-3 after:border-8 after:border-transparent after:border-solid"
          :class="{ 'after:top-1.5 after:border-b-gray-900 dark:after:border-b-gray-200': isOpen, 'after:top-3.5 after:border-t-gray-900 dark:after:border-t-gray-200': !isOpen }"
          @click="isOpen = !isOpen"
        >
          {{ options[currentIndex].label }}
        </div>
      </div>
    </Tooltip>
  </div>
</template>
