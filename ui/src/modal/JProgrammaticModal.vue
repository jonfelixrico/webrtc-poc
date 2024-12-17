<script setup lang="ts">
import { useProvideModalControl } from '@/modal/useModalControl'
import { SFComponent } from '@/utils/vue-types'
import { computed, PropType, provide, ref } from 'vue'

defineProps({
  dialogComp: {
    type: Object as PropType<SFComponent>,
    required: true,
  },

  toBind: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits<{
  hide: []
}>()

const state = ref(true)
const model = computed({
  get: () => state.value,

  /*
   * The sole purpose of this setter is to set the state to false to close
   * the modal.
   */
  set: (newValue) => {
    if (!state.value || newValue) {
      return
    }

    state.value = false
    if (!newValue) {
      setTimeout(() => {
        emit('hide')
      }, 100)
    }
  },
})

useProvideModalControl({
  close: () => {
    model.value = false
  },
})
</script>

<template>
  <component :is="dialogComp" v-model="model" v-bind="toBind" />
</template>
