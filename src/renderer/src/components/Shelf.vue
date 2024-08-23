<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, watchEffect } from "vue";
import { getColumns } from "@renderer/constants";


const props = defineProps<{
  title?: string;
}>();

const defaultColGap = 24;
const columns = reactive({
  count: -1,
  width: -1,
  minContainerWidth: -1,
  gap: defaultColGap,
});
const columnConfig = ref(getColumns("default"));
const container = ref<HTMLElement | null>(null);
const width = ref(0);

defineExpose({ columns });

watchEffect(() => {
  width.value = container.value?.offsetWidth ?? 0;
});

function getColumnParams(
  width: number,
  columnConfig: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MINIMUM_COLUMN_WIDTH: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    TWO_COLUMNS_MAX_WIDTH: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    THREE_COLUMNS_MAX_WIDTH: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    FOUR_COLUMNS_MAX_WIDTH: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MIN_COLUMNS_COUNT: number;
  },
) {
  let temp: number;
  const params = ((width, config) =>
    width < config.TWO_COLUMNS_MAX_WIDTH
      ? 2
      : width < config.THREE_COLUMNS_MAX_WIDTH
        ? 3
        : width < config.FOUR_COLUMNS_MAX_WIDTH
          ? 4
          : Math.floor((width + defaultColGap) / (config.MINIMUM_COLUMN_WIDTH + defaultColGap)))(width, columnConfig);
  const gridGap = (temp = params) === 2 ? 12 : temp === 3 ? 18 : defaultColGap;
  return {
    columnCountMainGrid: params,
    gapMainGrid: gridGap,
    columnWidthMainGrid: Math.floor((width - (params - 1) * gridGap) / params),
  };
}

function updateColumns(newWidth: number) {
  const params = getColumnParams(width.value, columnConfig.value);
  columns.width = params.columnWidthMainGrid;
  columns.gap = params.gapMainGrid;
  columns.count = Math.round((newWidth + params.gapMainGrid) / (params.columnWidthMainGrid + params.gapMainGrid));
  columns.minContainerWidth = (params.columnWidthMainGrid + params.gapMainGrid)
    * columnConfig.value.MIN_COLUMNS_COUNT - params.gapMainGrid;
}

function onResize() {
  if (container.value) {
    updateColumns(container.value.offsetWidth);
  }
}

onMounted(() => {
  onResize();
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
});

</script>

<template>
  <section
    ref="container"
    class="min-w-[var(--min-container-width)] "
    style="--shelf-min-height: 300px; contain-intrinsic-size: var(--shelf-min-height); content-visibility: auto;"
  >
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-gray-850 dark:text-gray-100">
        {{ props.title }}
      </h2>
    </div>
    <div
      class="auto-rows-[0] overflow-y-hidden grid-container grid gap-[var(--column-gap)] grid-cols-[repeat(var(--columns-count),minmax(0,1fr))] min-w-[var(--min-container-width)]"
      :style="{ '--columns-count': columns.count, '--column-width': columns.width + 'px', '--min-container-width': columns.minContainerWidth + 'px', '--column-gap': columns.gap + 'px', 'grid-template-rows': '1fr' }"
    >
      <slot />
    </div>
  </section>
</template>
