<script setup lang="ts">
import { useProvideLocalModal } from '@/modal/useLocalModal'
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

useProvideLocalModal({
  close: () => {
    model.value = false
  },

  state: model,
})
</script>

<template>
  <component :is="dialogComponent" v-bind="toBind" />
</template>
