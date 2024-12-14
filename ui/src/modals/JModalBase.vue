<script setup lang="ts">
const emit = defineEmits<{
  hide: []
}>()

function hide() {
  emit('hide')
}
</script>

<template>
  <div
    class="fixed inset-0 w-dvw h-dvh flex flex-row justify-center items-center bg-black/10"
    @click.self="hide"
  >
    <slot :hide />
  </div>
</template>
