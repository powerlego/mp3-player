<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CustomScrollbar from "@components/CustomScrollbar.vue";
import Group from "./fields/Group.vue";
import lodash from "lodash";
import { SettingsSection } from "@/types";

const props = defineProps<{
  activeSection: string;
  sections: SettingsSection[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preferences: { [key: string]: any };
}>();

defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldChange: [groupKey: string, fieldKey: string, value: any];
}>();

const section = computed(() => lodash.find(props.sections, { id: props.activeSection }) ?? props.sections[0]);
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const scrollbarRef = ref<InstanceType<typeof CustomScrollbar> | null>(null);

watch(() => props.activeSection, (newValue, oldValue) => {
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

</script>

<template>
  <CustomScrollbar
    ref="scrollbarRef"
    class="h-full min-h-full w-4/5 min-w-[500px] text-sm cursor-default"
    scroll-host-class="p-3 overflow-x-hidden overflow-y-auto"
  >
    <Group
      v-for="group in section.form.groups"
      :key="section.id + group.id"
      :preferences="props.preferences[section.id]"
      :group="group"
      :label="group.label"
      @field-change="(fieldKey, value) => $emit('fieldChange', group.id, fieldKey, value)"
    />
  </CustomScrollbar>
</template>
