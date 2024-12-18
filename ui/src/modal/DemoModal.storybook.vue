<script setup lang="ts">
import JModal from '@/modal/JModal.vue'
</script>

<template>
  <JModal v-slot="{ hide }">
    <button @click="hide">Close</button>
  </JModal>
</template>
