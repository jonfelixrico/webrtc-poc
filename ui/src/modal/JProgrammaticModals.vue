<script setup lang="ts">
import JProgrammaticModalContainer from '@/modal/JProgrammaticModalContainer.vue'
import { useProvideModalOpen } from '@/modal/useModalOpen'
import { ExtractPropAndEmitTypes, SFComponent } from '@/utils/vue-types'
import { computed, reactive } from 'vue'

interface ModalEntry<T extends SFComponent = SFComponent> {
  component: T
  toBind: ExtractPropAndEmitTypes<T>
  onHide: () => void
}

const modals: Map<symbol, ModalEntry> = reactive(new Map())
const asArray = computed(() => {
  const entries = Array.from(modals.entries())
  return entries.map(([id, value]) => ({
    id,
    ...value,
  }))
})

useProvideModalOpen({
  open<T extends SFComponent>(
    component: T,
    options: { toBind?: ExtractPropAndEmitTypes<T> },
  ) {
    const id = Symbol()
    modals.set(id, {
      component,
      toBind: options?.toBind ?? {},
      onHide: () => modals.delete(id),
    })
  },
})
</script>

<template>
  <JProgrammaticModalContainer
    v-for="{ id, component, toBind, onHide } in asArray"
    :key="id"
    :dialog-component="component"
    :to-bind
    @hide="onHide"
  />
</template>
