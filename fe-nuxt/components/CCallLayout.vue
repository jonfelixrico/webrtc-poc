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

  if (length <= 2) {
    return 'md:grid-cols-2 sm:grid-cols-1'
  } else {
    return 'lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'
  }
})
</script>

<template>
  <div class="grid gap-2" :class="gridColsClass">
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
