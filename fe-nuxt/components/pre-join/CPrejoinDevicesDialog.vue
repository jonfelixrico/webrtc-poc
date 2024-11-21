<script setup lang="ts">
import { reactive, type PropType } from 'vue'

const props = defineProps({
  videoDevices: {
    type: Array as PropType<MediaDeviceInfo[]>,
    required: true,
  },

  audioDevices: {
    type: Array as PropType<MediaDeviceInfo[]>,
    required: true,
  },

  videoId: String,
  audioId: String,
})

const model = reactive({
  videoId: props.videoId,
  audioId: props.audioId,
})

const emit = defineEmits(['success'])
function confirmSelection() {
  emit('success', model)
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
