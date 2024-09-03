<script setup lang="ts">
import { ref } from "vue";
import { SettingsSection } from "@/types";

const props = defineProps<{
  activeSection: string;
  sections: SettingsSection[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferences: { [key: string]: any };
}>();

const emit = defineEmits<{
  selectSection: [sectionId: string];
}>();

const activeSection = ref(props.activeSection);

function selectSection(sectionId: string) {
  activeSection.value = sectionId;
  emit("selectSection", sectionId);
}

function handleTablistKeyDown(event: KeyboardEvent) {
  if (!event.repeat && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code) && props.sections.length > 0) {
    const tabIncrement = event.code === "ArrowRight" || event.code === "ArrowDown" ? 1 : -1;

    const currentIndex = props.sections.findIndex((section) => section.id === activeSection.value);
    const nextIndex = (currentIndex + tabIncrement + props.sections.length) % props.sections.length;

    selectSection(props.sections[nextIndex].id);
  }
}

</script>

<template>
  <ul
    aria-label="Sidebar"
    class="sidebar h-full min-h-full w-1/5 min-w-[150px] flex flex-col justify-start cursor-default overflow-x-hidden overflow-y-auto bg-gray-150 dark:bg-gray-850 p-0 m-0"
    role="tablist"
    @keydown="handleTablistKeyDown"
  >
    <li
      v-for="section in sections"
      :id="`tab-${section.id}`"
      :key="section.id"
      :aria-controls="`tabpanel-${section.id}`"
      :aria-label="section.label ?? ''"
      :aria-selected="section.id === activeSection"
      role="tab"
      :tabindex="section.id === activeSection ? 0 : -1"
      class="h-10 min-h-[2.5rem] max-h-[2.5rem] w-1/5 min-w-[150px] max-w-[199px] overflow-hidden p-2 flex flex-row justify-start items-center transition-colors duration-200 ease-in-out cursor-pointer outline-nothing focus:border-2 focus:border-solid focus:border-blue-500 dark:focus:border-blue-500 text-black dark:text-white"
      :class="{ 'font-bold bg-gray-250 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650': section.id === activeSection, 'font-semibold bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-650': section.id !== activeSection }"
      @click="selectSection(section.id)"
    >
      <div
        v-if="section.icon && typeof section.icon === 'string'"
        class="mr-1 w-8 h-8 min-w-[2rem] max-w-[2rem] min-h-[2rem] max-h-[2rem] bg-gray-900 dark:bg-gray-50"
        :style="{ 'mask': `url(${section.icon}) no-repeat center/contain`, '-webkit-mask': `url(${section.icon}) no-repeat center/contain` }"
      />
      <div
        v-else-if="section.icon"
        class="mr-1 w-8 h-8 min-w-[2rem] max-w-[2rem] min-h-[2rem] max-h-[2rem]"
      >
        {{ section.icon }}
      </div>
      <span class="text-sm">{{ section.label }}</span>
    </li>
  </ul>
</template>

<style>
.sidebar::-webkit-scrollbar {
  @apply w-2;
}
</style>
