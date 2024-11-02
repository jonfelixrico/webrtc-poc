<script setup lang="ts">
import { computed, type PropType } from 'vue'
import CCallLayoutItem from '~/components/CCallLayoutItem.vue'

const props = defineProps({
  ids: {
    type: Array as PropType<string[]>,
    required: true,
  },
})

const gridColsClass = computed(() => {
  const length = props.ids.length

  if (length <= 1) {
    return 'grid-cols-1'
  } else if (length === 2) {
    return 'grid-cols-2'
  } else {
    return 'grid-cols-3'
  }
})
</script>

<template>
  <div class="flex flex-row grid gap-4" :class="gridColsClass">
    <CCallLayoutItem v-for="id in ids" :key="id" v-slot="{ width, height }">
      <slot :width :height />
    </CCallLayoutItem>
  </div>
</template>
