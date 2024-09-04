<script setup lang="ts">
import { computed, onBeforeMount, ref, useTemplateRef, watch } from "vue";
import CustomScrollbar from "@components/CustomScrollbar.vue";
import Group from "@components/settings/fields/Group.vue";
import lodash from "lodash";
import { useDarkMode } from "@composables/darkMode";
import { useDebounce } from "@composables/debounce";

useDarkMode();
const { debounce } = useDebounce();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dSavePreferences = debounce((preferences: { [key: string]: any }) => {
  window.settings.setPreferences(preferences);
}, 500);


const preferences = ref(window.settings.getPreferences());
const sections = ref(window.settings.getSections());
const activeSectionId = ref(sections.value[0].id);
const activeSection = computed(() => lodash.find(sections.value, { id: activeSectionId.value }) ?? sections.value[0]);
const oldPreferences = ref(preferences.value);

const scrollbarRef = useTemplateRef<InstanceType<typeof CustomScrollbar>>("scrollbarRef");


onBeforeMount(() => {
  sections.value.forEach((section) => {
    if (!preferences.value[section.id]) {
      preferences.value[section.id] = {};
    }
    else {
      section.form.groups.forEach((group) => {
        group.fields.forEach(() => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (!preferences.value[section.id][group.id]) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            preferences.value[section.id][group.id] = {};
          }
        });
      });
    }
  });
  oldPreferences.value = structuredClone(preferences.value);
});

</script>

<template>
</template>
