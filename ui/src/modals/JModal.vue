<script lang="ts" setup>
import JModalOverlay from '@/modals/JModalOverlay.vue'

const model = defineModel()
function hide() {
  model.value = false
}
</script>

<template>
  <JModalOverlay v-if="model" @hide="hide">
    <slot :hide />
  </JModalOverlay>
</template>
