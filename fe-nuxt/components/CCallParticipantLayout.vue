<script setup lang="ts">
defineProps({
  displayName: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col items-center justify-center bg-zinc-800 text-white">
    <div class="text-2xl font-medium">{{ displayName }}</div>
    <slot />
  </div>
</template>
