<script setup lang="ts">
import {
  useProvideInternalLocalModalProps,
  useProvideLocalModalProps,
} from '@/modal/useLocalModal'
import { Component, nextTick, onMounted, PropType } from 'vue'

const props = defineProps({
  dialogComponent: {
    type: Object as PropType<Component>,
    required: true,
  },

  toBind: {
    type: Object,
    default: () => ({}),
  },

  delete: {
    type: Function as PropType<() => void>,
    required: true,
  },
})

const model = defineModel<boolean>({
  default: false,
})

useProvideLocalModalProps({
  close: () => {
    model.value = false
  },
})

useProvideInternalLocalModalProps({
  model,
  emitDismissDone: props.delete,
})

onMounted(async () => {
  await nextTick()
  model.value = true
})
</script>

<template>
  <component :is="dialogComponent" v-bind="toBind" />
</template>
