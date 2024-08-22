<script setup lang="ts">
import { onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  scrollHostClass?: string;
}>();

const SCROLL_BOX_MIN_HEIGHT = 20;

const observer = ref<MutationObserver | null>(null);
const scrollHost = ref<HTMLDivElement | null>(null);
const hovering = ref(false);
const scrollBoxHeight = ref(SCROLL_BOX_MIN_HEIGHT);
const scrollBoxTop = ref(0);
const scrollThumbPosition = ref(0);
const isDragging = ref(false);

defineExpose({
  scrollHost,
});

function handleMouseOver(_event: MouseEvent) {
  hovering.value = true;
};

function handleMouseOut(_event: MouseEvent) {
  hovering.value = false;
};

function handleMouseUp(event: MouseEvent) {
  if (isDragging.value) {
    event.preventDefault();
    isDragging.value = false;
  }
};

function handleMouseMove(event: MouseEvent) {
  if (isDragging.value && scrollHost.value) {
    event.preventDefault();
    event.stopPropagation();

    const { scrollHeight, offsetHeight } = scrollHost.value;

    const deltaY = event.clientY - scrollThumbPosition.value;
    const percentage = deltaY * (scrollHeight / offsetHeight);

    scrollThumbPosition.value = event.clientY;
    scrollBoxTop.value = Math.min(Math.max(0, scrollBoxTop.value + deltaY), offsetHeight - scrollBoxHeight.value);
    scrollHost.value.scrollTop = Math.min(scrollHost.value.scrollTop + percentage, scrollHeight - offsetHeight);
  }
};

function handleScrollThumbMouseDown(event: MouseEvent) {
  event.preventDefault();
  event.stopPropagation();

  isDragging.value = true;
  scrollThumbPosition.value = event.clientY;
};

function handleScroll(_event: Event) {
  if (scrollHost.value) {
    const { scrollTop, scrollHeight, offsetHeight } = scrollHost.value;

    let newTop = (scrollTop / scrollHeight) * offsetHeight;
    // newTop = newTop + parseInt(scrollTop, 10);
    newTop = Math.min(newTop, offsetHeight - scrollBoxHeight.value);
    scrollBoxTop.value = newTop;
  }
}

function handleSlotChange() {
  if (scrollHost.value) {
    const { clientHeight, scrollHeight } = scrollHost.value;
    const scrollThumbPercentage = clientHeight / scrollHeight;
    const scrollThumbHeight = Math.max(scrollThumbPercentage * clientHeight, SCROLL_BOX_MIN_HEIGHT);
    scrollBoxHeight.value = scrollThumbHeight;
  }
}
onMounted(() => {
  handleSlotChange();
  const observe = new MutationObserver(handleSlotChange);
  observe.observe(scrollHost.value!, { childList: true });
  observer.value = observe;
  scrollHost.value!.addEventListener("scroll", handleScroll, true);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("mouseleave", handleMouseUp);

});

onBeforeUnmount(() => {
  observer.value!.disconnect();
});

onUnmounted(() => {
  scrollHost.value!.removeEventListener("scroll", handleScroll, true);
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseUp);
  document.removeEventListener("mouseleave", handleMouseUp);
});

</script>

<template>
  <div
    class="relative h-full"
    @mouseleave="handleMouseOut"
    @mouseover="handleMouseOver"
  >
    <div
      ref="scrollHost"
      :class="`scrollHost h-full relative ${props.scrollHostClass}`"
    >
      <slot />
    </div>
    <div
      class="absolute top-0 bottom-0 right-0 w-2 h-full transition-opacity duration-300 ease-out bg-black rounded-lg bg-opacity-40 dark:bg-white dark:bg-opacity-20"
      :class="{ 'opacity-100': hovering, 'opacity-0': !hovering }"
    >
      <div
        class="w-1.5 h-5 absolute bg-gray-900 dark:bg-gray-100 rounded-lg ml-[1px]"
        :style="{ height: scrollBoxHeight + 'px', top: scrollBoxTop + 'px' }"
        @mousedown="handleScrollThumbMouseDown"
      />
    </div>
  </div>
</template>

<style>
.scrollHost {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scrollHost::-webkit-scrollbar {
  display: none;
}
</style>
