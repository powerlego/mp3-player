<script setup lang="ts">
import { altKeyName, codeToChar, metaKeyName, modifierKeyCodes, specialKeyCodes } from "@renderer/constants";
import { ref, useId } from "vue";
import { SettingsAcceleratorField } from "@/types";
import Tooltip from "@components/Tooltip.vue";

const props = withDefaults(defineProps<{
  field: SettingsAcceleratorField;
  value?: string;
}>(), {
  value: "",
});

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const accelerator = ref("");
const pressing = ref(false);
const value = ref(props.value);

function handleKeyDown(event: KeyboardEvent) {
  event.preventDefault();
  const keys = [
    event.ctrlKey && "Ctrl",
    event.metaKey && metaKeyName,
    event.altKey && altKeyName,
    event.shiftKey && "Shift",
  ].filter(Boolean) as string[];
  if (!specialKeyCodes.has(event.code) && event.code in codeToChar) {
    if (keys.length === 0 && (event.code === "Backspace" || event.code === "Delete")) {
      pressing.value = false;
      emit("change", "");
      return;
    }
    if ((props.field.modifierRequired ?? false) && keys.length === 0) {
      return;
    }
    keys.push(codeToChar[event.code]);
    emit("change", keys.join("+"));
  }
  else if ((props.field.allowOnlyModifier ?? false) && modifierKeyCodes.has(event.code) && keys.length === 1) {
    emit("change", keys[0]);
    return;
  }
  pressing.value = true;
  accelerator.value = keys.join("+");
}

function handleKeyUp(event: KeyboardEvent) {
  event.preventDefault();
  pressing.value = false;
  value.value = accelerator.value;
}

</script>
<template>
  <div :id="`field-accelerator-${props.field.key}-${useId()}`">
    <div class="mb-3 text-base font-bold text-black dark:text-white">
      {{ props.field.label }}
    </div>
    <Tooltip
      class="w-full"
      :content="props.field.description ?? ''"
    >
      <input
        readonly
        :aria-label="props.field.label"
        class="w-full rounded-lg text-sm m-0.5 p-2 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 dark:focus:border-blue-400 focus:border-2 text-black dark:text-white outline-nothing"
        type="text"
        :value="(pressing && accelerator) || value"
        @keydown="handleKeyDown"
        @keyup="handleKeyUp"
      >
    </Tooltip>
  </div>
</template>
