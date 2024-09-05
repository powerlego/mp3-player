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

const fieldId = computed(() => `checkbox_${useId()}`);
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
      const id = `${fieldId.value}_${index}`;
      const checked = localValue.includes(option.value);
      return {
        id,
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
  const idx = target.id.split("_")[2];
  const option = props.field.options[parseInt(idx)];

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
        :for="option.id"
      >
        {{ option.label }}
        <input
          :id="option.id"
          class="absolute w-0 h-0 opacity-0 cursor-pointer peer"
          :aria-label="option.label"
          :checked="option.checked"
          type="checkbox"
          @change="handleChange"
        >
        <span
          class="absolute top-0 left-0 w-5 h-5 bg-black dark:bg-white bg-opacity-0 dark:bg-opacity-0 border-gray-650 dark:border-gray-400 border border-solid rounded group-hover:bg-opacity-10 dark:group-hover:bg-opacity-5 peer-checked:bg-blue-500 peer-checked:border-blue-500 dark:peer-checked:bg-blue-500 dark:peer-checked:border-blue-500 peer-checked:border-2 peer-focus:border-2 peer-focus:border-blue-500 dark:peer-focus:border-blue-500 peer-checked:peer-focus:border-blue-300 dark:peer-checked:peer-focus:border-blue-300 group-hover:peer-checked:bg-blue-600 group-hover:peer-checked:border-blue-600 dark:group-hover:peer-checked:bg-blue-600 dark:group-hover:peer-checked:border-blue-600 after:absolute after:hidden peer-checked:after:block after:left-[5px] after:top-0.5 after:w-[5px] after:h-2.5 after:border-solid after:border-white dark:after:border-gray-900 after:border-t-0 after:border-r-2 after:border-b-2 after:border-l-0 after:scale-100 after:rotate-45 after:animation-delay-50 after:animate-zoom-in-check-square "
        />
      </label>
    </Tooltip>
  </div>
</template>
