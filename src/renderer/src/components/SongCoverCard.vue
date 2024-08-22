<script setup lang="ts">
import ImageCardSkeleton from "./ImageCardSkeleton.vue";
import SongCoverCardAsync from "./SongCoverCardAsync.vue";

const props = defineProps<{
  fileLocation: string;
}>();

</script>

<template>
  <Transition mode="out-in">
    <Suspense>
      <SongCoverCardAsync v-bind="props" />
      <template #fallback>
        <ImageCardSkeleton />
      </template>
    </Suspense>
  </Transition>
</template>
