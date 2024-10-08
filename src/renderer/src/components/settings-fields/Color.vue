<script setup lang="ts">
import { ColorInput, TinyColor } from "@ctrl/tinycolor";
import { computed, onMounted, onUnmounted, ref, useId, useTemplateRef, watch } from "vue";
import { Chrome } from "@ckpack/vue-color";
import { SettingsColorField } from "@/types";
import Tooltip from "@components/Tooltip.vue";

const props = defineProps<{
  field: SettingsColorField;
  value: ColorInput;
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const color = ref(new TinyColor(props.value));

watch(color, (value) => {
  switch (props.field.format) {
  case "hex":
    emit("change", value.toHex());
    break;
  case "rgb":
    emit("change", value.toRgb());
    break;
  case "hsl":
    emit("change", value.toHsl());
    break;
  case "hsv":
    emit("change", value.toHsv());
    break;
  default:
    emit("change", value.toHex());
    break;
  }
});

const wrapper = useTemplateRef<HTMLDivElement>("wrapper");
const show = ref(false);
const colorDisplayStyle = computed(() => {
  return {
    backgroundColor: color.value.toRgbString(),
  };
});

function handleClick() {
  show.value = !show.value;
}

function handleClickOutside(event: MouseEvent) {
  if (wrapper.value && !wrapper.value.contains(event.target as Node)) {
    show.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside, true);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside, true);
});

</script>
<template>
  <div
    :id="`field-color-${props.field.key}-${useId()}`"
    ref="wrapper"
  >
    <div class="mb-3 text-base font-bold text-black dark:text-white">
      {{ props.field.label }}
    </div>
    <Tooltip
      class="w-full"
      :content="props.field.description ?? ''"
    >
      <div class="relative">
        <div
          class="p-1 bg-gray-50 dark:bg-gray-800 inline-block rounded-[1px] cursor-pointer"
          style="box-shadow: 0 0 0 1px rgba(0,0,0,.1);"
          @click="handleClick"
        >
          <div
            className="w-9 h-4 rounded-sm"
            :style="colorDisplayStyle"
          />
        </div>
        <div
          v-show="show"
          class="absolute top-0 z-10 left-12"
        >
          <Chrome
            v-model="color"
            @update:model-value="($event) => color = new TinyColor($event.rgba)"
          />
        </div>
      </div>
    </Tooltip>
  </div>
</template>
