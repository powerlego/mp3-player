<script setup lang="ts">
import { computed, ref } from "vue";
import { OpenDialogSyncOptions } from "electron";
import { SettingsFileField } from "@/types";
import Tooltip from "@components/Tooltip.vue";

const props = defineProps<{
  field: SettingsFileField;
  value?: string[];
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const value = ref(props.value ?? []);

const btnLabel = computed(() => {
  if (props.field.buttonLabel) {
    return props.field.buttonLabel;
  }
  else if (value.value.length > 0) {
    if (props.field.multiSelections) {
      return "Choose Other Files";
    }
    else {
      return "Choose Another File";
    }
  }
  else if (props.field.multiSelections) {
    return "Choose Files";
  }
  else {
    return "Choose A File";
  }
});

function choose() {
  const properties: OpenDialogSyncOptions["properties"] = ["openFile"];

  if (props.field.multiSelections) {
    properties.push("multiSelections");
  }
  if (props.field.showHiddenFiles) {
    properties.push("showHiddenFiles");
  }
  if (props.field.noResolveAliases) {
    properties.push("noResolveAliases");
  }
  if (props.field.treatPackageAsDirectory) {
    properties.push("treatPackageAsDirectory");
  }
  if (props.field.dontAddToRecent) {
    properties.push("dontAddToRecent");
  }

  const result = window.settings.showOpenDialog({
    properties,
    filters: props.field.filters,
  });
  if (result && result.length > 0) {
    value.value = props.field.multiSelections ? result : [result[0]];
    emit("change", props.field.multiSelections ? result : [result[0]]);
  }
}

</script>

<template>
  <div :id="'field-file-' + props.field.key">
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
      <div @click="choose">
        <div
          class="w-full px-2 py-1 font-bold border-t-2 border-solid rounded-t-lg border-x-2 bg-gray-150 dark:bg-gray-750 border-gray-350 dark:border-gray-700"
        >
          {{ props.field.multiSelections ? "Files" : "File" }}:&nbsp;
        </div>
        <ul v-if="props.field.multiSelections || value.length > 1">
          <li
            v-for="(val, idx) in value"
            :key="props.field.key + '-' + idx"
            class="w-full px-2 py-1 bg-gray-100 border-t border-solid border-x-2 last:border-b-2 dark:bg-gray-800 border-gray-350 dark:border-gray-700 last:mb-1 last:rounded-b-lg"
          >
            {{ val }}
          </li>
        </ul>
        <div
          v-else-if="!props.field.multiSelections && value.length <= 1"
          class="w-full px-2 py-1 mb-1 bg-gray-100 border border-b-2 border-solid rounded-b-lg border-x-2 dark:bg-gray-800 border-gray-350 dark:border-gray-700"
        >
          {{ value[0] }}
        </div>
        <div
          v-else
          class="w-full px-2 py-1 mb-1 bg-gray-100 border border-b-2 border-solid rounded-b-lg border-x-2 dark:bg-gray-800 border-gray-350 dark:border-gray-700"
        >
          None
        </div>
      </div>
      <button
        :aria-label="btnLabel"
        class="px-2 py-1 transition ease-in-out rounded-md bg-gray-50 dark:bg-gray-800 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:cursor-not-allowed enabled:active:bg-gray-150 dark:enabled:active:bg-gray-650"
        @click="choose"
      >
        {{ btnLabel }}
      </button>
    </Tooltip>
  </div>
</template>
