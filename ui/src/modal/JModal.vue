<script setup lang="ts">
import { useBodyScrollActions } from '@/body-scroll/useBodyScroll'
import { useModalZIndex } from '@/modal/useModalZIndex'
import { onUnmounted, watch } from 'vue'

const model = defineModel<boolean>()

const { index: zIndex, ...modalZIndex } = useModalZIndex()
watch(
  model,
  (model) => {
    if (model) {
      modalZIndex.activate()
    } else {
      modalZIndex.deactivate()
    }
  },
  {
    immediate: true,
  },
)
onUnmounted(modalZIndex.deactivate)

const bodyScroll = useBodyScrollActions()
watch(
  model,
  (model) => {
    if (model) {
      bodyScroll.hide()
    } else {
      bodyScroll.show()
    }
  },
  {
    immediate: true,
  },
)
onUnmounted(bodyScroll.show)

function hide() {
  model.value = false
}

function getZIndexStyle(offset: number = 0) {
  const idx = zIndex.value

  if (idx === undefined) {
    return
  }

  return `z-[${idx + offset}]`
}
</script>

<template>
  <Teleport to="[data-modal-target]" defer>
    <Transition name="backdrop">
      <div
        v-if="model"
        class="fixed inset-0 bg-black/10 w-full h-full"
        :style="getZIndexStyle()"
        @click.self="hide"
      />
    </Transition>

    <Transition name="content">
      <div
        v-if="model"
        class="fixed inset-0 w-full h-full flex flex-row justify-center items-center overflow-auto pointer-events-none"
        :class="getZIndexStyle(1)"
      >
        <div class="pointer-events-auto">
          <slot :hide />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.5s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.content-enter-active,
.content-leave-active {
  transition: transform 0.5s ease;
}

.content-enter-from,
.content-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
