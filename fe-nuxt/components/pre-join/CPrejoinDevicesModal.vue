<script setup lang="ts">
import { useModal } from '#imports'
import { reactive, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import CPrejoinDeviceInput from '~/components/pre-join/CPrejoinDeviceInput.vue'

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

const { t } = useI18n()

const modal = useModal()
const emit = defineEmits<{
  (e: 'submit', value: { videoId: string; audioId: string }): void
}>()
function confirmSelection() {
  emit('submit', model)
  modal.close()
}
</script>

<template>
  <UModal>
    <UCard>
      <div class="flex flex-col gap-4">
        <CPrejoinDeviceInput
          v-model="model.videoId"
          :devices="videoDevices"
          :placeholder="t('preCall.selectCamera')"
          :no-devices-text="t('preCall.noCamera')"
        />

        <CPrejoinDeviceInput
          v-model="model.audioId"
          :devices="audioDevices"
          :placeholder="t('preCall.selectMic')"
          :no-devices-text="t('preCall.noMic')"
        />

        <UButton block @click="confirmSelection">{{
          t('common.submit')
        }}</UButton>
      </div>
    </UCard>
  </UModal>
</template>
