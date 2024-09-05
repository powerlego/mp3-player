<script setup lang="ts">
import { computed, useId } from "vue";
import { SettingsCheckboxField } from "@/types";
import Tooltip from "@components/Tooltip.vue";

const props = defineProps<{
  field: SettingsCheckboxField;
  value: boolean | string | number |(string | number | boolean)[];
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const options = computed(() => {
  if (props.field.options) {
    return props.field.options.map((option, index) => {
      let localValue: (string | number | boolean)[] = [];
      if (typeof props.value === "boolean" && props.field.options!.length === 1) {
        localValue = props.value ? [option.value] : [];
      }
      else if (!Array.isArray(props.value)) {
        localValue = [];
      }
      else {
        localValue = props.value;
      }
      const id = `checkbox-${useId()}`;
      const checked = localValue.includes(option.value);
      return {
        id,
        index,
        checked,
        label: option.label,
      };
    });
  }
  return [];
});

function handleChange(event: Event) {
  if (!props.field.options) {
    return;
  }
  const target = event.target as HTMLInputElement;
  const option = props.field.options[parseInt(target.getAttribute("data-idx")!)];

  let value: (string | number | boolean)[] = [];

  if (typeof props.value === "boolean" && props.field.options.length === 1) {
    value = target.checked ? [option.value] : [];
  }
  else if (!Array.isArray(props.value)) {
    value = [];
  }
  else {
    value = props.value;
  }
  if (target.checked) {
    if (!value.includes(option.value)) {
      value.push(option.value);
    }
  }
  else {
    value = value.filter((val) => val !== option.value);
  }
  emit("change", value);
}

</script>

<template>
  <div :id="`field-checkbox-${props.field.key}-${useId()}`">
    <div class="mb-3 text-base font-bold text-black dark:text-white">
      {{ props.field.label }}
    </div>
    <Tooltip
      class="w-full"
      :content="props.field.description ?? ''"
    >
      <label
        v-for="option in options"
        :key="option.id"
        class="inline-flex items-center gap-2 px-1 py-2 select-none"
      >
        <span>{{ option.label }}</span>

        <input
          :id="option.id"
          :data-idx="option.index"
          class="w-5 h-5 cursor-pointer checkbox"
          :aria-label="option.label"
          :checked="option.checked"
          type="checkbox"
          @change="handleChange"
        >
      </label>
    </Tooltip>
  </div>
</template>

<style>
.checkbox {
  --chkbg: theme(colors.indigo.500);
  --chkfg: black;
  @apply rounded border-gray-650 dark:border-gray-400 border border-solid appearance-none border-opacity-20 flex-shrink-0;

  &:focus {
    box-shadow: none;
  }

  &:focus-visible {
    @apply outline-indigo-500 outline outline-2 outline-offset-2;
  }

  &:disabled {
    @apply border-0;
  }

  &:checked,
  &[aria-checked="true"] {
    @apply bg-no-repeat;
    animation: checkmark var(--animation-input, 0.2s) ease-out;
    background-color: var(--chkbg);
    background-image: linear-gradient(-45deg, transparent 65%, var(--chkbg) 65.99%),
      linear-gradient(45deg, transparent 75%, var(--chkbg) 75.99%),
      linear-gradient(-45deg, var(--chkbg) 40%, transparent 40.99%),
      linear-gradient(45deg,
        var(--chkbg) 30%,
        var(--chkfg) 30.99%,
        var(--chkfg) 40%,
        transparent 40.99%),
      linear-gradient(-45deg, var(--chkfg) 50%, var(--chkbg) 50.99%);
  }

  &:indeterminate {
    @apply bg-indigo-500 bg-no-repeat;
    animation: checkmark var(--animation-input, 0.2s) ease-out;
    background-image: linear-gradient(90deg, transparent 80%, var(--chkbg) 80%),
      linear-gradient(-90deg, transparent 80%, var(--chkbg) 80%),
      linear-gradient(0deg, var(--chkbg) 43%, var(--chkfg) 43%, var(--chkfg) 57%, var(--chkbg) 57%);
  }
}

@keyframes checkmark {
  0% {
    background-position-y: 5px;
  }

  50% {
    background-position-y: -2px;
  }

  100% {
    background-position-y: 0;
  }
}
</style>
