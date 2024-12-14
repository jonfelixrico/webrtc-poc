<script setup lang="ts">
import { useBodyScrollActions } from '@/body-scroll/useBodyScroll'
import { onMounted } from 'vue'

const emit = defineEmits<{
  hide: []
}>()

function hide() {
  emit('hide')
}

const bodyScroll = useBodyScrollActions()
onMounted(bodyScroll.hide)
</script>

<template>
  <Teleport to="[data-modal-target]" defer>
    <div
      class="fixed inset-0 w-dvw h-dvh flex flex-row justify-center items-center bg-black/10"
      @click.self="hide"
    >
      <slot />
    </div>
  </Teleport>
</template>
