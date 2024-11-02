<script setup lang="ts">
import type { PropType } from 'vue'
import CCallLayoutItem from '~/components/CCallLayoutItem.vue'

defineProps({
  ids: {
    type: Array as PropType<string[]>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-row">
    <CCallLayoutItem v-slot="{ width, height }">
      <slot name="self" :width :height />
    </CCallLayoutItem>

    <CCallLayoutItem v-for="id in ids" :key="id" v-slot="{ width, height }">
      <slot name="peer" :width :height />
    </CCallLayoutItem>
  </div>
</template>
