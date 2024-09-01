<script setup lang="ts">
import { ref, watch } from "vue";
import { SettingsTextField } from "@/types";
import Tooltip from "@components/Tooltip.vue";

const props = defineProps<{
  field: SettingsTextField;
  value: string;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const value = ref(props.value);

watch(value, (newValue) => {
  emit("change", newValue);
});

</script>

<template>
  <div :id="'field-text-' + props.field.key">
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
        :aria-label="props.field.label"
        class="w-full rounded-lg text-sm m-0.5 p-2 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 dark:focus:border-blue-400 focus:border-2 text-black dark:text-white outline-nothing"
        type="text"
      >
    </Tooltip>
  </div>
</template>
