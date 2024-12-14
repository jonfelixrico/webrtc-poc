<script setup lang="ts">
import { useBodyScrollActions } from '@/body-scroll/useBodyScroll'
import { useModalZIndex } from '@/modals/useModalZIndex'
import { onMounted } from 'vue'

const emit = defineEmits<{
  hide: []
}>()

function hide() {
  emit('hide')
}

const bodyScroll = useBodyScrollActions()
onMounted(bodyScroll.hide)

const zIndex = useModalZIndex()
</script>

<template>
  <Teleport to="[data-modal-target]" defer>
    <div
      class="fixed w-dvw h-dvh isolate"
      :class="`z-[${zIndex}]`"
      @click.self="hide"
    >
      <div class="fixed inset-0 z-10 bg-black/10 w-full h-full" />
      <div
        class="fixed inset-0 z-20 w-full h-full flex flex-row justify-center items-center overflow-auto"
      >
        <slot />
      </div>
    </div>
  </Teleport>
</template>
