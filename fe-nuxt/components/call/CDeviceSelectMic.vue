<script setup lang="ts">
import {
  usePersistedDeviceConfig,
  useUserDevices,
} from '~/composables/media.composable'
import { useI18n } from 'vue-i18n'

const devices = useUserDevices()
const state = usePersistedDeviceConfig(devices)

const { t } = useI18n()
</script>

<template>
  <CDeviceSelect
    v-slot="{ status }"
    v-model="state.audio.id"
    v-model:enabled="state.audio.enabled"
    :devices="devices.video"
  >
    <div class="flex flex-col items-center">
      <template v-if="status === 'enabled'">
        <UIcon name="i-ri-mic-fill" class="icon-size" />
        {{ t('call.audioControl.mute') }}
      </template>

      <template v-else-if="status === 'disabled'">
        <UIcon name="i-ri-mic-off-fill" class="icon-size" />
        {{ t('call.audioControl.unmute') }}
      </template>

      <template v-else-if="status === 'no_device'">
        <UIcon name="i-ri-mic-line" class="icon-size" />
        {{ t('call.audioControl.select') }}
      </template>
    </div>
  </CDeviceSelect>
</template>

<style lang="scss" scoped>
.icon-size {
  @apply w-7 h-7;
}
</style>
