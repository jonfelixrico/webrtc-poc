<script setup lang="ts">
definePageMeta({
  validate: (route) =>
    $fetch(`/be/room/${route.params.id}`)
      .then(() => true)
      .catch(() => false),
})
const route = useRoute()
</script>

<template>
  <div>
    {{ route.params.id }}
  </div>
</template>
