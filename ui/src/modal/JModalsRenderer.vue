<script setup lang="ts">
import JProgrammaticModalContainer from '@/modal/JProgrammaticModalContainer.vue'
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

  <JProgrammaticModalContainer
    v-for="{
      id,
      component,
      toBind,
      onContainerMount,
      state: localState,
      setState: setLocalState,
    } in asArray"
    :key="id"
    v-bind="toBind"
    :model-value="localState"
    :dialog-component="component"
    @update:model-value="setLocalState"
    @vue:mounted="onContainerMount"
  />
</template>
