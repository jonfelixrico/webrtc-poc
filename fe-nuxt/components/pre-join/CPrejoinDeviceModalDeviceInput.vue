<script setup lang="ts">
import type { PropType } from 'vue'

const model = defineModel({
  type: String,
  default: null,
})

defineProps({
  devices: {
    type: Array as PropType<MediaDeviceInfo[]>,
    default: () => [],
  },

  noDevicesText: {
    type: String,
    required: true,
  },

  placeholder: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <USelect v-if="!devices.length" disabled :placeholder="noDevicesText" />
  <USelect
    v-else
    v-model="model"
    :options="devices"
    value-attribute="deviceId"
    :placeholder
  />
</template>
