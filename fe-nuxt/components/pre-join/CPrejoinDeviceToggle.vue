<script setup lang="ts">
const model = defineModel({
  type: Boolean,
})

defineProps({
  iconEnabled: {
    type: String,
    default: '',
  },

  iconDisabled: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="flex flex-row items-center gap-x-1">
    <UIcon v-if="model" class="w-5 h-5" :name="iconEnabled" />
    <UIcon v-else class="w-5 h-5" :name="iconDisabled" />
    <UToggle v-model="model" />
  </div>
</template>
