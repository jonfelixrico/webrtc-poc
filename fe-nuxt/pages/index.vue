<script setup lang="ts">
import { useCallerId } from 'src/composables/caller-id.composable'
import { ref } from 'vue'

const callerId = useCallerId()
const targerCallerId = ref()
</script>

<template>
  <q-page>
    {{ callerId }}

    <q-form @submit.prevent>
      <q-input v-model="targerCallerId" />
      <q-btn type="submit">Call</q-btn>
    </q-form>
  </q-page>
</template>
