<script setup lang="ts">
import { ref } from 'vue'

const callerId = useCallerId()
const targerCallerId = ref()
</script>

<template>
  <q-page>
    {{ callerId }}

    <form @submit.prevent>
      <UInput v-model="targerCallerId" />
      <UButton type="submit">Call</UButton>
    </form>
  </q-page>
</template>
