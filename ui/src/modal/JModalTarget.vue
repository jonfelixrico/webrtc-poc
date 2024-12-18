<script setup lang="ts">
import { useZIndexManager } from '@/utils/useZIndex'

useZIndexManager()
</script>

<template>
  <div data-modal-target class="fixed onset-0 isolate z-[100]" />
  <slot />
</template>
