<script setup lang="ts">
import {
  usePersistedDeviceConfig,
  useUserDevices,
} from '~/composables/media.composable'
import { useI18n } from 'vue-i18n'
import CDeviceSelect from './CDeviceSelect.vue'

const devices = useUserDevices()
const state = usePersistedDeviceConfig(devices)

const { t } = useI18n()
</script>

<template>
  <CDeviceSelect
    v-slot="{ status }"
    v-model="state.video.id"
    v-model:enabled="state.video.enabled"
    :devices="devices.video.value"
  >
    <div class="flex flex-col items-center">
      <template v-if="status === 'enabled'">
        <UIcon name="i-ri-video-on-fill" class="icon-size" />
        {{ t('call.videoControl.stop') }}
      </template>

      <template v-else-if="status === 'disabled'">
        <UIcon name="i-ri-video-off-fill" class="icon-size" />
        {{ t('call.videoControl.start') }}
      </template>

      <template v-else-if="status === 'no_device'">
        <UIcon name="i-ri-video-on-line" class="icon-size" />
        {{ t('call.videoControl.select') }}
      </template>
    </div>
  </CDeviceSelect>
</template>

<style lang="scss" scoped>
.icon-size {
  @apply w-7 h-7;
}
</style>
