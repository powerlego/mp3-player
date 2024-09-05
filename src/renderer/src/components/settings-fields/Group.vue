<script setup lang="ts">
import { computed, useId } from "vue";
import Accelerator from "./Accelerator.vue";
import Checkbox from "./Checkbox.vue";
import Color from "./Color.vue";
import Directory from "./Directory.vue";
import Dropdown from "./Dropdown.vue";
import File from "./File.vue";
import { Group } from "@/types";
import List from "./List.vue";
import log from "electron-log/renderer";
import Number from "./Number.vue";
import Radio from "./Radio.vue";
import Slider from "./Slider.vue";
import Text from "./Text.vue";

const fieldMap = {
  accelerator: Accelerator,
  checkbox: Checkbox,
  color: Color,
  directory: Directory,
  dropdown: Dropdown,
  file: File,
  list: List,
  number: Number,
  radio: Radio,
  slider: Slider,
  text: Text,
};

const id = useId();

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferences: { [key: string]: any };
  group: Group;
}>();

defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldChange: [key: string, value: any];
}>();

const fields = computed(() => {
  return props.group.fields.map((field) => {
    const fieldComponent = fieldMap[field.type];
    if (!fieldComponent) {
      log.error(`Field type "${field.type}" is not supported`);
      return {
        component: null,
        field,
      };
    }
    return {
      component: fieldComponent,
      field,
    };
  });
});

</script>

<template>
  <div :id="`group-${props.group.id}-${id}`">
    <div
      v-if="props.group.label"
      class="mb-3 text-xl font-bold text-black dark:text-white"
    >
      {{ props.group.label }}
    </div>
    <template
      v-for="field in fields"
      :key="id + '-' + field.field.key"
    >
      <component
        :is="field.component"
        v-if="field.component"
        :field="field.field"
        :value="props.preferences[props.group.id][field.field.key]"
        @change="(value: any) => $emit('fieldChange', field.field.key, value)"
      />
    </template>
  </div>
</template>
