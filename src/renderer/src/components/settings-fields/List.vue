<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue";
import { SettingsListField } from "@/types";
import Tooltip from "@components/Tooltip.vue";

const props = defineProps<{
  field: SettingsListField;
  value?: string[];
}>();

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change: [value: any];
}>();

const items = ref(props.value || []);
const itemToAdd = ref("");
const selected = ref("");
const modal = useTemplateRef<HTMLDialogElement>("modal");
const addItemValidator = computed(() => {
  if (props.field.addItemLabel) {
    const lastSlash = props.field.addItemLabel.lastIndexOf("/");
    return new RegExp(props.field.addItemLabel.slice(1, lastSlash), props.field.addItemLabel.slice(lastSlash + 1));
  }
  return /.+/;
});

const min = computed(() => Math.max(props.field.min ?? 0, 0));
const max = computed(() => Math.max(props.field.max ?? 0, 0));

function saveItem() {
  if (itemToAdd.value) {
    items.value.push(itemToAdd.value);
    emit("change", items.value);
  }
  itemToAdd.value = "";
  modal.value?.close();
}

function removeItem() {
  if (selected.value) {
    const newValue = items.value[items.value.indexOf(selected.value) - 1];
    items.value = items.value.filter((item) => item !== selected.value);
    selected.value = newValue;
    emit("change", items.value);
  }
}

function moveItemUp() {
  if (selected.value && items.value.length > 1) {
    const index = items.value.indexOf(selected.value);
    if (index > 0) {
      const temp = items.value[index - 1];
      items.value[index - 1] = items.value[index];
      items.value[index] = temp;
      emit("change", items.value);
    }
  }
}

function moveItemDown() {
  if (selected.value && items.value.length > 1) {
    const index = items.value.indexOf(selected.value);
    if (index < items.value.length - 1) {
      const temp = items.value[index + 1];
      items.value[index + 1] = items.value[index];
      items.value[index] = temp;
      emit("change", items.value);
    }
  }
}

function cancel() {
  itemToAdd.value = "";
  modal.value?.close();
}

</script>

<template>
  <div :id="'field-list-' + props.field.key">
    <div
      :aria-label="props.field.label"
      class="mb-3 text-base font-bold text-black dark:text-white"
    >
      {{ props.field.label }}
    </div>
    <Tooltip
      class="w-full"
      :content="props.field.description ?? ''"
    >
      <select
        v-model="selected"
        class="min-w-1/4 text-sm text-black dark:text-white bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 rounded-lg m-0.5 p-0 outline-nothing transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 focus:border-2 dark:focus:border-blue-400 group"
        :size="props.field.size ?? 10"
      >
        <option
          v-for="(item, idx) in items"
          :key="props.field.key + '-' + idx"
          class="px-1 py-0.5 checked:bg-gray-200 dark:checked:bg-gray-700 text-black dark:text-white group-focus:checked:!bg-blue-500 dark:group-focus:checked:!bg-blue-400"
          :aria-label="item"
          :value="item"
        >
          {{ item }}
        </option>
      </select>
      <div class="ml-0.5 mt-0.5">
        <button
          aria-label="Add"
          class="p-1 text-sm transition ease-in-out border-t border-b border-r border-gray-800 border-solid cursor-pointer bg-gray-50 dark:bg-gray-800 dark:border-gray-300 first:border first:rounded-tl-lg first:rounded-bl-lg last:border last:border-l-0 last:rounded-tr-lg last:rounded-br-lg enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:active:text-blue-500 dark:enabled:active:text-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-450 dark:disabled:text-gray-200 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 disabled:cursor-default"
          :disabled="max > 0 && items.length >= max"
          @click="modal?.showModal()"
        >
          <span class="px-2">+</span>
        </button>
        <button
          aria-label="Remove"
          class="p-1 text-sm transition ease-in-out border-t border-b border-r border-gray-800 border-solid cursor-pointer bg-gray-50 dark:bg-gray-800 dark:border-gray-300 first:border first:rounded-tl-lg first:rounded-bl-lg last:border last:border-l-0 last:rounded-tr-lg last:rounded-br-lg enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:active:text-blue-500 dark:enabled:active:text-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-450 dark:disabled:text-gray-200 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 disabled:cursor-default"
          :disabled="min >= items.length"
          @click="removeItem"
        >
          <span class="px-2">-</span>
        </button>
        <template v-if="props.field.orderable">
          <button
            aria-label="Move Up"
            class="p-1 text-sm transition ease-in-out border-t border-b border-r border-gray-800 border-solid cursor-pointer bg-gray-50 dark:bg-gray-800 dark:border-gray-300 first:border first:rounded-tl-lg first:rounded-bl-lg last:border last:border-l-0 last:rounded-tr-lg last:rounded-br-lg enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:active:text-blue-500 dark:enabled:active:text-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-450 dark:disabled:text-gray-200 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 disabled:cursor-default"
            :disabled="items.indexOf(selected) <= 0"
            @click="moveItemUp"
          >
            <span class="px-2">↑</span>
          </button>
          <button
            aria-label="Move Down"
            class="p-1 text-sm transition ease-in-out border-t border-b border-r border-gray-800 border-solid cursor-pointer bg-gray-50 dark:bg-gray-800 dark:border-gray-300 first:border first:rounded-tl-lg first:rounded-bl-lg last:border last:border-l-0 last:rounded-tr-lg last:rounded-br-lg enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:active:text-blue-500 dark:enabled:active:text-blue-400 disabled:bg-gray-100 dark:disabled:bg-gray-850 disabled:text-gray-450 dark:disabled:text-gray-200 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 disabled:cursor-default"
            :disabled="items.indexOf(selected) >= items.length - 1"
            @click="moveItemDown"
          >
            <span class="px-2">↓</span>
          </button>
        </template>
      </div>
    </Tooltip>
    <dialog
      ref="modal"
      class="bg-transparent text-[inherit] duration-200 ease-out modal"
    >
      <div
        class="bg-gray-180 dark:bg-gray-860 rounded-2xl col-start-1 row-start-1 w-11/12 max-w-[91.666667%] scale-90 transform p-6 transition duration-200 ease-out modal-box"
      >
        <label
          :for="'field-list-add-' + props.field.key"
          class="block font-bold text-black dark:text-white"
        >
          {{ props.field.addItemLabel ?? "Add Item" }}
        </label>
        <input
          :id="'field-list-add-' + props.field.key"
          v-model="itemToAdd"
          :name="'field-list-add-' + props.field.key"
          :aria-label="props.field.addItemLabel ?? 'Add Item'"
          :autofocus="true"
          class="block w-full text-sm rounded-lg m-0.5 p-2 bg-gray-100 dark:bg-gray-800 border border-solid border-gray-350 dark:border-gray-700 transition-[border-color] duration-300 ease-out focus:m-0 focus:border-blue-500 dark:focus:border-blue-400 focus:border-2 text-black dark:text-white outline-nothing"
          type="text"
        >
        <div class="justify-end mt-6 space-x-2">
          <form
            method="dialog"
            class="flex flex-row"
          >
            <button
              aria-label="Cancel"
              class="bg-gray-50 dark:bg-gray-800 flex-auto flex-grow-0 rounded-lg p-1.5 m-1 border-2 border-solid border-gray-400 dark:border-gray-600 text-black dark:text-white disabled:border-gray-300 dark:disabled:opacity-70 enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:cursor-default"
              @click="cancel"
            >
              Cancel
            </button>
            <button
              aria-label="Save"
              class="bg-gray-50 dark:bg-gray-800 flex-auto flex-grow-0 rounded-lg p-1.5 m-1 border-2 border-solid border-gray-400 dark:border-gray-600 text-black dark:text-white disabled:border-gray-300 dark:disabled:opacity-70 enabled:active:border-blue-500 dark:enabled:active:border-blue-400 enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-700 transition ease-in-out disabled:cursor-default"
              :disabled="addItemValidator.test(itemToAdd) === false"
              @click="saveItem"
            >
              Save
            </button>
          </form>
        </div>
      </div>
      <form
        method="dialog"
        class="-z-[1] col-start-1 row-start-1 grid self-stretch justify-self-stretch text-transparent"
      >
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<style>
.modal {
  overflow-y: hidden;
  overscroll-behavior: contain;

  &:not(dialog:not(.modal-open)),
  &::backdrop {
    background-color: #0006;
    animation: modal-pop 0.2s ease-out;
  }
}

.modal-box {
  box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.modal-open .modal-box,
.modal-toggle:checked+.modal .modal-box,
.modal:target .modal-box,
.modal[open] .modal-box {
  --tw-translate-y: 0px;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}


@keyframes modal-pop {
  0% {
    opacity: 0;
  }
}
</style>
