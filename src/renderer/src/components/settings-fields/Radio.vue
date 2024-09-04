<script setup lang="ts">
import { ref } from "vue";
import { SettingsRadioField } from "@/types";
import Tooltip from "@components/Tooltip.vue";
import { useGuid } from "@composables/guid";

const props = defineProps<{
  field: SettingsRadioField;
  value: number | string | boolean;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const { newGuid } = useGuid();
const fieldId = ref(`radio_${newGuid()}`);
const value = ref(props.value);

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement;
  value.value = props.field.options[parseInt(target.id.split("_")[2])].value;
  emit("change", props.field.options[parseInt(target.id.split("_")[2])].value);
}

</script>

<template>
  <div :id="'field-radio-' + props.field.key">
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
        :key="`${fieldId}_${idx}`"
        class="relative block pl-8 mb-3 transition-all duration-300 ease-out cursor-pointer select-none group"
        :for="`${fieldId}_${idx}`"
      >
        {{ option.label }}
        <input
          :id="`${fieldId}_${idx}`"
          :aria-label="option.label"
          :checked="value === option.value"
          class="absolute opacity-0 cursor-pointer peer"
          :name="fieldId"
          type="radio"
          @change="handleChange"
        >
        <span
          class="absolute top-0 left-0 w-5 h-5 bg-black dark:bg-white  bg-opacity-0 dark:bg-opacity-0 border-gray-650 dark:border-gray-400 border border-solid rounded-full transition-all duration-300 ease-out group-hover:bg-opacity-5 dark:group-hover:bg-opacity-10 peer-checked:bg-blue-500 peer-checked:border-blue-500 dark:peer-checked:bg-blue-500 dark:peer-checked:border-blue-500 peer-focus:bg-blue-400 peer-focus:border-blue-400 dark:peer-focus:bg-blue-400 dark:peer-focus:border-blue-400 group-hover:peer-checked:bg-blue-600 group-hover:peer-checked:border-blue-600 dark:group-hover:peer-checked:bg-blue-600 dark:group-hover:peer-checked:border-blue-600 after:absolute after:hidden after:scale-100 after:animation-delay-50 after:animate-zoom-in-check-circle after:top-[3px] after:left-[3px] after:w-3 after:h-3 after:rounded-full after:bg-transparent after:border-2 after:border-solid after:border-white dark:after:border-gray-900 peer-checked:after:block"
        />
      </label>
    </Tooltip>
  </div>
</template>
