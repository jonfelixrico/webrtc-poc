<script setup lang="ts">
import type { PropType } from 'vue'
import CResizeObserverDiv from '~/components/CResizeObserverDiv.vue'

defineProps({
  ids: {
    type: Array as PropType<string[]>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-row">
    <CResizeObserverDiv>
      <slot name="self" />
    </CResizeObserverDiv>

    <CResizeObserverDiv v-for="id in ids" :key="id" v-slot="dimensions">
      <slot name="peer" :dimensions />
    </CResizeObserverDiv>
  </div>
</template>
