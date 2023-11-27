<script setup>
import { XMarkIcon } from "@heroicons/vue/20/solid";
defineProps({
  title: { type: String, default: null },
  show: { type: Boolean, default: false },
});

defineEmits(["close"]);
</script>

<template>
  <div>
    <Transition>
      <div v-if="show" class="modal-wrapper">
        <div class="modal-wrapper-inner">
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <button class="w-9 block">
              <XMarkIcon @click="$emit('close')" />
            </button>
          </div>
          <div class="modal-inner">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active,
.v-enter-active .modal-wrapper-inner,
.v-leave-active .modal-wrapper-inner {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-from .modal-wrapper-inner,
.v-leave-to .modal-wrapper-inner {
  transform: translateY(-50px);
}
</style>
