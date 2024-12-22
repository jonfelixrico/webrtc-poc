<script setup lang="ts">
import JProgModal from '@/modal/JProgModal.vue'
import { useProvideModalManagerState } from '@/modal/useModal'
import { computed } from 'vue'

const state = useProvideModalManagerState()
const asArray = computed(() => {
  const entries = Array.from(state.entries())
  return entries.map(([id, value]) => ({
    id,
    ...value,
  }))
})
</script>

<template>
  <div
    data-modal-target
    class="fixed onset-0 isolate z-[100]"
    v-bind="$attrs"
  />

  <JProgModal
    v-for="{ id, component, toBind, model, delete: deleteFn } in asArray"
    :key="id"
    v-bind="toBind"
    :model-value="model.value"
    :dialog-component="component"
    :delete="deleteFn"
    @update:model-value="
      (value: boolean) => {
        model.value = value
      }
    "
  />
</template>
