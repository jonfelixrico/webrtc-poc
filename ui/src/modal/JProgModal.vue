<script setup lang="ts">
import {
  useProvideInternalLocalModalProps,
  useProvideLocalModalProps,
} from '@/modal/useLocalModal'
import { SFComponent } from '@/utils/vue-types'
import { PropType } from 'vue'

defineProps({
  dialogComponent: {
    type: Object as PropType<SFComponent>,
    required: true,
  },

  toBind: {
    type: Object,
    default: () => ({}),
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
  state: model,
})
</script>

<template>
  <component :is="dialogComponent" v-bind="toBind" />
</template>
