<script setup lang="ts">
import { useProvideModalControl } from '@/modal/useModalControl'
import { SFComponent } from '@/utils/vue-types'
import { computed, onMounted, PropType, ref } from 'vue'

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

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const state = ref(true)

onMounted(async () => {
  await delay(100)
  state.value = true
})

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
      delay(100).then(() => {
        emit('hide')
      })
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
