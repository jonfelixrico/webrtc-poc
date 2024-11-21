<script setup lang="ts">
import { useModal } from '#imports'
import { reactive, toValue, type PropType } from 'vue'

const props = defineProps({
  videoDevices: {
    type: Array as PropType<MediaDeviceInfo[]>,
    required: true,
  },

  audioDevices: {
    type: Array as PropType<MediaDeviceInfo[]>,
    required: true,
  },

  videoId: {
    type: String,
    default: null,
  },

  audioId: {
    type: String,
    default: null,
  },
})

const model = reactive({
  videoId: props.videoId,
  audioId: props.audioId,
})

const modal = useModal()
const emit = defineEmits<{
  (e: 'submit', value: { videoId: string; audioId: string }): void
}>()
function confirmSelection() {
  emit('submit', toValue(model))
  modal.close()
}
</script>

<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <!-- TODO add labels -->
        <USelect
          v-model="model.videoId"
          :options="videoDevices"
          value-attribute="deviceId"
        />

        <!-- TODO add labels -->
        <USelect
          v-model="model.audioId"
          :options="audioDevices"
          value-attribute="deviceId"
        />

        <!-- TODO i18nize -->
        <UButton block @click="confirmSelection">Submit</UButton>
      </div>
    </UCard>
  </UModal>
</template>
