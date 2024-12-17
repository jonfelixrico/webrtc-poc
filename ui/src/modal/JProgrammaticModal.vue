<script setup lang="ts">
import { SFComponent } from '@/utils/vue-types'
import { computed, PropType, ref } from 'vue'

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
  set: (value) => {
    state.value = value

    if (!value) {
      setTimeout(() => {
        emit('hide')
      }, 100)
    }
  },
})
</script>

<template>
  <component :is="dialogComp" v-model="model" v-bind="toBind" />
</template>
