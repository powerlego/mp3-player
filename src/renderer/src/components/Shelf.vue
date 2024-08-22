<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from "vue";
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

watchEffect(() => {
  width.value = container.value?.offsetWidth ?? 0;
});

</script>
