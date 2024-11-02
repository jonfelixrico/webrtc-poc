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
    <CCallLayoutItem>
      <slot name="self" />
    </CCallLayoutItem>

    <CCallLayoutItem v-for="id in ids" :key="id" v-slot="dimensions">
      <slot name="peer" :dimensions />
    </CCallLayoutItem>
  </div>
</template>
