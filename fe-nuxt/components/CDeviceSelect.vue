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
  <UButtonGroup v-if="deviceIdModel" orientation="horizontal">
    <!-- Allow toggling of the device between enabled/disabled -->
    <UButton
      color="white"
      variant="ghost"
      @click="enabledModel = !enabledModel"
    >
      <slot :status="enabledModel ? 'enabled' : 'disabled'" />
    </UButton>

    <!-- Facilitates device selection -->
    <UDropdown :items="options">
      <UButton color="white" variant="ghost">
        <UIcon name="i-bitcoin-icons-caret-up-filled" />
      </UButton>
    </UDropdown>
  </UButtonGroup>

  <!--
    This is visually identical to the one above, except that both
    buttons trigger the dropdown.
  -->
  <UDropdown v-else :items="options">
    <UButtonGroup orientation="horizontal">
      <!--
        Two buttons were still made instead of one (contains caret + content)
        to ensure visual parity with the one above.
      -->
      <UButton color="white" variant="ghost">
        <slot status="no_device" />
      </UButton>

      <UButton color="white" variant="ghost">
        <UIcon name="i-bitcoin-icons-caret-up-filled" />
      </UButton>
    </UButtonGroup>
  </UDropdown>
</template>
