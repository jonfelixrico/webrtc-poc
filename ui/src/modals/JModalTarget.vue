<script setup lang="ts">
import { useModalZIndexManager } from '@/modals/useModalZIndex'

useModalZIndexManager()
</script>

<template>
  <div data-modal-target class="fixed onset-0 isolate z-[100]" />
  <slot />
</template>
