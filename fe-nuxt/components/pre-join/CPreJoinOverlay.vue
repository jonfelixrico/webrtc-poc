<script setup lang="ts">
const videoEnabled = defineModel('videoEnabled', {
  type: Boolean,
})

const audioEnabled = defineModel('videoEnabled', {
  type: Boolean,
})
</script>

<template>
  <div class="flex flex-col justify-end">
    <div class="flex flex-row justify-center gap-4">
      <!-- TODO add icon -->
      <UToggle v-model="videoEnabled" />

      <!-- TODO add icon -->
      <UToggle v-model="audioEnabled" />

      <!-- TODO add icon; i18n label -->
      <UButton variant="ghost" label="Devices" />
    </div>
  </div>
</template>
