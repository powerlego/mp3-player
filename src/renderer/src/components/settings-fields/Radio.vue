<script setup lang="ts">
import { ref, useId } from "vue";
import { SettingsRadioField } from "@/types";
import Tooltip from "@components/Tooltip.vue";

const props = defineProps<{
  field: SettingsRadioField;
  value: number | string | boolean;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const id = useId();

const fieldId = ref(`radio_${useId()}`);
const value = ref(props.value);

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  value.value = props.field.options[parseInt(target.getAttribute("data-idx")!)].value;
  emit("change", props.field.options[parseInt(target.getAttribute("data-idx")!)].value);
}

</script>

<template>
  <div :id="`field-radio-${props.field.key}-${id}`">
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
      <label
        v-for="(option, idx) in props.field.options"
        :key="`${id}-${idx}`"
        class="inline-flex items-center gap-2 px-1 py-2 select-none"
        :for="`${id}-${idx}`"
      >
        {{ option.label }}
        <input
          :id="`${id}-${idx}`"
          :data-idx="idx"
          :aria-label="option.label"
          :checked="value === option.value"
          class="radio w-6 h-6"
          :name="fieldId"
          type="radio"
          @change="handleChange"
        >
      </label>
    </Tooltip>
  </div>
</template>

<style>
.radio {
  --chkbg: theme(colors.indigo.500);
  @apply border-gray-650 dark:border-gray-400 cursor-pointer appearance-none rounded-full border border-opacity-20 flex-shrink-0;

  &:focus {
    box-shadow: none;
  }

  &:is(.dark *) {
    --shdw: theme(colors.gray.860);
  }

  &:not(:is(.dark *)) {
    --shdw: theme(colors.gray.180);
  }

  &:focus-visible {
    @apply outline-gray-650 dark:outline-gray-400 outline outline-2 outline-offset-2;
  }

  &:checked,
  &[aria-checked="true"] {
    @apply bg-indigo-500;
    background-image: none;
    animation: radiomark var(--animation-input, 0.2s) ease-out;
    box-shadow:
      0 0 0 4px var(--shdw) inset,
      0 0 0 4px var(--shdw) inset;
  }

  &:disabled {
    @apply cursor-not-allowed opacity-20;
  }
}

@keyframes radiomark {
  0% {
    box-shadow:
      0 0 0 12px var(--shdw) inset,
      0 0 0 12px var(--shdw) inset;
  }

  50% {
    box-shadow:
      0 0 0 3px var(--shdw) inset,
      0 0 0 3px var(--shdw) inset;
  }

  100% {
    box-shadow:
      0 0 0 4px var(--shdw) inset,
      0 0 0 4px var(--shdw) inset;
  }
}
</style>
