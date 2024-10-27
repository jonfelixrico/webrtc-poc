<script setup lang="ts">
const callerId = useCallerId()
const targerCallerId = ref()
</script>

<template>
  <div>
    {{ callerId }}

    <form @submit.prevent>
      <UInput v-model="targerCallerId" />
      <UButton type="submit">Call</UButton>
    </form>
  </div>
</template>
