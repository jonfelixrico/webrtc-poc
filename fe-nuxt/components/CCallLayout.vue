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
    <CCallLayoutItem
      v-for="id in ids"
      :key="id"
      v-slot="{ width, height }"
      class="relative"
    >
      <!--
        The slot wrapper is made absolute to prevent the layout from being messy
        if ever the slot content did overflow.
      -->
      <div class="absolute h-full w-full overflow-hidden">
        <slot :id :width :height />
      </div>
    </CCallLayoutItem>
  </div>
</template>
