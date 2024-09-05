<script setup lang="ts">
import { ref } from "vue";

const props = withDefaults(defineProps<
  {
    direction?: "top" | "bottom" | "left" | "right";
    delay?: number;
    content: string;
  }
>(), {
  direction: "top",
  delay: 400,
});

const timeout = ref<NodeJS.Timeout | null>(null);
const active = ref(false);

function showTip() {
  timeout.value = setTimeout(() => {
    active.value = true;
  }, props.delay);
}

function hideTip() {
  if (timeout.value) {
    clearTimeout(timeout.value);
    timeout.value = null;
  }

  active.value = false;
}

</script>

<template>
  <template v-if="!props.content">
    <slot />
  </template>
  <div
    v-else
    class="relative inline-block"
    @mouseenter="showTip"
    @mouseleave="hideTip"
    @blur="hideTip"
  >
    <slot />
    <div
      v-show="active"
      class="absolute rounded left-1/2 -translate-x-1/2 p-2 bg-gray-850 dark:bg-gray-800 text-white dark:text-white text-sm leading-none whitespace-nowrap z-50 before:left-1/2 before:border-solid before:border-transparent before:h-0 before:w-0 before:absolute before:pointer-events-none before:border-[calc(1*var(--tooltip-arrow-size))] before:ml-[calc(-1*var(--tooltip-arrow-size))]"
      :class="{
        'before:top-full before:border-t-gray-850 dark:before:border-t-gray-800 top-[calc(-1*var(--tooltip-margin))]': props.direction === 'top', 'before:bottom-full before:border-b-gray-850 dark:before:border-b-gray-800 bottom-[calc(-1*var(--tooltip-margin))]': props.direction === 'bottom', 'before:left-auto before:right-[calc(-2*var(--tooltip-arrow-size))] before:top-1/2 before:translate-x-0 before:-translate-y-1/2 before:border-l-gray-850 dark:before:border-l-gray-800 left-auto right-[calc(100%+var(--tooltip-margin))] top-1/2 translate-x-0 -translate-y-1/2': props.direction === 'left', 'before:left-[calc(-1*var(--tooltip-arrow-size))] before:top-1/2 before:translate-x-0 before:-translate-y-1/2 before:border-r-gray-850 dark:before:border-r-gray-800 left-[calc(100%+var(--tooltip-margin))] top-1/2 translate-x-0 -translate-y-1/2': props.direction === 'right'
      }"
    >
      {{ props.content }}
    </div>
  </div>
</template>
