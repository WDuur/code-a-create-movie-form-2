<script setup>
import { XMarkIcon } from "@heroicons/vue/20/solid";
defineProps({
  title: { type: String, default: null },
});

defineEmits(["close"]);
</script>

<template>
  <div>
    <div class="modal-wrapper">
      <div class="modal-wrapper-inner">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button class="w-9 block">
            <XMarkIcon @click="$emit('close')" />
          </button>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
