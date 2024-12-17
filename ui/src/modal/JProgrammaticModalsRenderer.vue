<script setup lang="ts">
import JProgrammaticModalContainer from '@/modal/JProgrammaticModalContainer.vue'
import { useProgrammaticModalState } from '@/modal/useProgrammaticModal'
import { computed } from 'vue'

const state = useProgrammaticModalState()

const asArray = computed(() => {
  const entries = Array.from(state.entries())
  return entries.map(([id, value]) => ({
    id,
    ...value,
  }))
})
</script>

<template>
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
    @vnode-mounted="onContainerMount"
  />
</template>
