<script setup lang="ts">

const props = defineProps<{
  src: string;
  line1: string;
  line2: string;
  loading?: "lazy" | "eager";
  onClickButton?:() => void;
  onClickCard?: () => void;
}>();

</script>

<template>
  <div
    className="bg-gray-250 dark:bg-gray-800 group isolate relative w-full p-4 hover:bg-gray-300 hover:dark:bg-gray-750 transition-[background-color] duration-300 ease-[ease]"
    style="--card-container-border-radius: clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px); border-radius: calc(var(--card-container-border-radius) + 2px);"
  >
    <div class-="h-full select-none">
      <div className="mb-4 relative">
        <div
          class="relative pb-[100%] bg-gray-350 dark:bg-gray-750"
          style="--card-image-border-radius: clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px); border-radius: var(--card-image-border-radius); box-shadow: 0 8px 24px rgb(0 0 0 / 50%);"
        >
          <img
            class="absolute top-0 left-0 object-cover w-full h-full animate-imageFadeInAnimation"
            :loading="props.loading || 'lazy'"
            :src="props.src"
            style="animation-fill-mode: forwards; animation-iteration-count: 1; --card-image-border-radius: clamp(4px,(var(--column-width,0px) - 32px) * 0.025,8px); border-radius: var(--card-image-border-radius); object-position: center center;"
          >
        </div>
        <div v-if="props.onClickButton">
          <div
            class="bottom-2 right-2 rounded-full z-[2] opacity-0 pointer-events-none absolute transition-all duration-300 ease-[ease] translate-y-2 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 outline-nothing"
            style="box-shadow: 0 8px 8px rgb(0 0 0 / 30%);"
          >
            <button
              class="relative z-[1] transition-[background-color, border-color, color, box-shadow, filter, transform] select-none touch-manipulation block duration-[33ms] group/button cursor-default outline-nothing"
              @click="props.onClickButton"
            >
              <slot name="icon" />
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-[62px]">
        <a
          class="relative z-[1] inline-block w-full align-middle select-none touch-manipulation cursor-pointer"
          :title="line1"
        >
          <div
            class="box-border overflow-hidden text-base font-bold text-gray-800 text-ellipsis whitespace-nowrap dark:text-gray-100"
            style="margin-block: 0px; padding-block-end: 4px;"
          >
            {{ props.line1 }}
          </div>
        </a>
        <div
          class="text-[0.8125rem] md:text-sm box-border font-normal text-gray-700 dark:text-gray-300 overflow-hidden mt-1 text-ellipsis whitespace-nowrap"
          style="margin-block: 0px;"
        >
          <span>{{ props.line2 }}</span>
        </div>
      </div>
      <div
        class="absolute top-0 bottom-0 left-0 right-0 z-0 overflow-hidden cursor-pointer"
        @click="props.onClickCard"
      />
    </div>
  </div>
</template>
