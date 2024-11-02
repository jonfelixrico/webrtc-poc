<script setup lang="ts">
import { computed, toValue, type PropType } from 'vue'

const props = defineProps({
  devices: {
    type: Array as PropType<MediaDeviceInfo[]>,
    required: true,
  },

  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },

  enabled: {
    type: Boolean,
    default: undefined,
  },
})
const emit = defineEmits(['update:modelValue', 'update:enabled'])

const deviceIdModel = computed({
  get: () => props.modelValue || undefined, // converted to undefined to appease USelect types
  set: (value) => {
    emit('update:modelValue', value || null)
  },
})

const enabledModel = computed({
  get: () => !!props.modelValue && props.enabled,
  set: (value) => {
    emit('update:enabled', value)
  },
})

const options = computed(() => {
  return props.devices.map(({ deviceId, label }) => {
    const item: { label: string; click: () => void; icon?: string } = {
      label,
      click: () => {
        deviceIdModel.value = deviceId
      },
    }

    if (deviceId === toValue(deviceIdModel)) {
      item.icon = 'i-material-symbols-check-rounded'
    }

    return [item]
  })
})
</script>

<template>
  <div class="flex flex-row">
    <UButtonGroup orientation="horizontal">
      <UButton :disabled="!modelValue" @click="enabledModel = !enabledModel">
        <slot :device-id="modelValue" :enabled />
      </UButton>

      <UDropdown :items="options">
        <UButton>
          <UIcon name="mdi-triangle-small-up" />
        </UButton>
      </UDropdown>
    </UButtonGroup>
  </div>
</template>
