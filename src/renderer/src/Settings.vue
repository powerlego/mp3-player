<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref, toRaw, useTemplateRef, watch } from "vue";
import CustomScrollbar from "@components/CustomScrollbar.vue";
import Group from "@components/settings-fields/Group.vue";
import lodash from "lodash";
import { useDarkMode } from "@composables/darkMode";
import { useDebounce } from "@composables/debounce";

useDarkMode();
const { debounce } = useDebounce();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dSavePreferences = debounce((preferences: { [key: string]: any }) => {
  window.settings.setPreferences(preferences);
}, 500);


const preferences = reactive(window.settings.getPreferences());
const sections = ref(window.settings.getSections());
const activeSectionId = ref(sections.value[0].id);
const activeSection = computed(() => lodash.find(sections.value, { id: activeSectionId.value }) ?? sections.value[0]);
const oldPreferences = ref(preferences);

const scrollbarRef = useTemplateRef<InstanceType<typeof CustomScrollbar>>("scrollbarRef");

function close() {
  window.close();
}

async function apply() {
  await dSavePreferences(toRaw(preferences));
  oldPreferences.value = structuredClone(toRaw(preferences));
}

async function saveAndClose() {
  await dSavePreferences(toRaw(preferences));
  window.close();
}

function selectSection(sectionId: string) {
  activeSectionId.value = sectionId;
}

function handleTablistKeyDown(event: KeyboardEvent) {
  if (!event.repeat && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code) && sections.value.length > 0) {
    const tabIncrement = event.code === "ArrowRight" || event.code === "ArrowDown" ? 1 : -1;

    const currentIndex = sections.value.findIndex((section) => section.id === activeSectionId.value);
    const nextIndex = (currentIndex + tabIncrement + sections.value.length) % sections.value.length;

    selectSection(sections.value[nextIndex].id);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fieldChange(groupId: string, fieldId: string, value: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  preferences[activeSectionId.value][groupId][fieldId] = value;
}


watch(activeSectionId, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (scrollbarRef.value) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (scrollbarRef.value.scrollHost) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        scrollbarRef.value.scrollHost.scrollTo({ top: 0 });
      }
    }
  }
});

onBeforeMount(() => {
  sections.value.forEach((section) => {
    if (!preferences[section.id]) {
      preferences[section.id] = {};
    }
    else {
      section.form.groups.forEach((group) => {
        group.fields.forEach(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (!preferences[section.id][group.id]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            preferences[section.id][group.id] = {};
          }
        });
      });
    }
  });
  oldPreferences.value = structuredClone(toRaw(preferences));
});

</script>

<template>
  <div
    class="absolute top-0 left-0 right-0 bottom-[4.5rem] bg-gray-180 dark:bg-gray-860 text-gray-800 dark:text-white flex flex-row"
  >
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
        :aria-selected="section.id === activeSectionId"
        role="tab"
        :tabindex="section.id === activeSectionId ? 0 : -1"
        class="h-10 min-h-[2.5rem] max-h-[2.5rem] w-1/5 min-w-[150px] max-w-[199px] overflow-hidden p-2 flex flex-row justify-start items-center transition-colors duration-200 ease-in-out cursor-pointer outline-nothing focus:border-2 focus:border-solid focus:border-blue-500 dark:focus:border-blue-500 text-black dark:text-white"
        :class="{ 'font-bold bg-gray-250 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-650': section.id === activeSectionId, 'font-semibold bg-gray-50 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-650': section.id !== activeSectionId }"
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
    <CustomScrollbar
      ref="scrollbarRef"
      class="h-full min-h-full w-4/5 min-w-[500px] text-sm cursor-default"
      scroll-host-class="p-3 overflow-x-hidden overflow-y-auto"
    >
      <Group
        v-for="group in activeSection.form.groups"
        :key="activeSection.id + group.id"
        :preferences="preferences[activeSectionId]"
        :group="group"
        :label="group.label"
        @field-change="(fieldKey: string, value: any) => fieldChange(group.id, fieldKey, value)"
      />
    </CustomScrollbar>
  </div>
  <div
    class="absolute left-0 right-0 flex flex-row items-center justify-end h-10 text-gray-800 bottom-8 bg-gray-220 dark:bg-gray-880 dark:text-white"
  >
    <div class="flex flex-row justify-between gap-2 mr-2">
      <button
        class="w-[6.5rem] bg-gray-50 dark:bg-gray-800 px-2 rounded-md py-1 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:bg-gray-100 dark:disabled:bg-gray-850 enabled:active:bg-gray-150 dark:enabled:active:bg-gray-650 disabled:cursor-not-allowed"
        @click="close"
      >
        <span class="text-sm">Cancel</span>
      </button>
      <button
        class="w-[6.5rem] bg-gray-50 dark:bg-gray-800 px-2 rounded-md py-1 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:bg-gray-100 dark:disabled:bg-gray-850 enabled:active:bg-gray-150 dark:enabled:active:bg-gray-650 disabled:cursor-not-allowed"
        :enabled="!lodash.isEqual(preferences, oldPreferences)"
        @click="apply"
      >
        <span class="text-sm">Apply</span>
      </button>
      <button
        class="w-[6.5rem] bg-gray-50 dark:bg-gray-800 px-2 rounded-md py-1 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:bg-gray-100 dark:disabled:bg-gray-850 enabled:active:bg-gray-150 dark:enabled:active:bg-gray-650 disabled:cursor-not-allowed"
        @click="saveAndClose"
      >
        <span class="text-sm">Save & Close</span>
      </button>
    </div>
  </div>
</template>

<style>
.sidebar::-webkit-scrollbar {
  width: 0.5rem;
}
</style>
