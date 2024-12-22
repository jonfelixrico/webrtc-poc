<script setup lang="ts">
import { useBodyScrollActions } from '@/utils/useBodyScroll'
import { useZIndex } from '@/utils/useZIndex'
import { computed, nextTick, onUnmounted, watch } from 'vue'
import { useInternalLocalModalProps } from '@/modal/useLocalModal'

const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const localModal = useInternalLocalModalProps()

const model = computed({
  /*
   * If injectedState has a value then that means that this is likely a programmatic modal.
   * Programmatic modals use provide/inject as the modelValue.
   */

  get: () => localModal?.model.value ?? props.modelValue,
  set: (value) => {
    if (localModal) {
      localModal.model.value = value
      return
    }

    emit('update:modelValue', value)
  },
})

const { index: zIndex, ...modalZIndex } = useZIndex()
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
</script>

<template>
  <Teleport to="[data-modal-target]" defer>
    <Transition name="backdrop" @after-leave="localModal?.emitDismissDone">
      <!-- 
        NOTE: We didnt't rely on dynamic tailwind classes here (e.g. z-[${zIndex}]) because tailwind
        does not generate the classes for "dynamic" classnames such as the example above.

        We CAN make this work by using safelist in the tailwind config, but tailwind itself
        doesn't recommend this approach.
      -->
      <div
        v-if="model"
        class="fixed inset-0 bg-black/10 w-full h-full ease-in-out transition-opacity duration-200"
        :style="{ zIndex }"
        @click.self="hide"
      />
    </Transition>

    <Transition name="content">
      <div
        v-if="model"
        class="fixed inset-0 w-full h-full flex flex-row justify-center items-center overflow-auto pointer-events-none ease-in transition duration-100"
        :style="{ zIndex: zIndex + 1 }"
      >
        <div class="pointer-events-auto">
          <slot :hide />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.content-enter-from,
.content-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
