<script setup lang="ts">
import '@webrtcpoc/ui/style.css'
import { JModalAggregator } from '@webrtcpoc/ui/modal'
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <UModals />
  <JModalAggregator />
</template>
