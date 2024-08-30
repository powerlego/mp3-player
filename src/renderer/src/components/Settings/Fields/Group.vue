<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Group,
  SettingsAcceleratorField,
  SettingsCheckboxField,
  SettingsColorField,
  SettingsDirectoryField,
  SettingsDropdownField,
  SettingsFileField,
  SettingsListField,
  SettingsNumberField,
  SettingsRadioField,
  SettingsSliderField,
  SettingsTextField,
} from "@/types";
import AcceleratorField from "./AcceleratorField.vue";
import CheckboxField from "./CheckboxField.vue";

const fieldMap = {
  accelerator: AcceleratorField,
  checkbox: CheckboxField,
  color: ColorField,
  directory: DirectoryField,
  dropdown: DropdownField,
  file: FileField,
  group: Group,
  list: ListField,
  number: NumberField,
  radio: RadioField,
  slider: SliderField,
  text: TextField,
};
}

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferences: { [key: string]: any };
  group: Group;
  value?: string;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldChange: [key: string, value: any];
}>();

const fields = computed(() => {
  return props.group.fields.map((value, idx) => {

  });
});

</script>

<template>
  <div :id="'group-' + props.group.id">
    <div v-if="props.group.label" class="mb-3 text-xl font-bold text-black dark:text-white">
      {{ props.group.label }}
    </div>
  </div>
</template>
