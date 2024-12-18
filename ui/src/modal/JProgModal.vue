<script setup lang="ts">
import {
  useProvideInternalLocalModalProps,
  useProvideLocalModalProps,
} from '@/modal/useLocalModal'
import { SFComponent } from '@/utils/vue-types'
import { nextTick, onMounted, PropType } from 'vue'

const props = defineProps({
  dialogComponent: {
    type: Object as PropType<SFComponent>,
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
  delete: props.delete,
})

onMounted(async () => {
  await nextTick()
  model.value = true
})
</script>

<template>
  <component :is="dialogComponent" v-bind="toBind" />
</template>
