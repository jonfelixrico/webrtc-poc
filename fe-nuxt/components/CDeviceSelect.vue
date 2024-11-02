<script setup lang="ts">
import { computed, type PropType } from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()

const deviceIdModel = computed({
  get: () => props.modelValue ?? undefined, // converted to undefined to appease USelect types
  set: (value) => {
    emit('update:modelValue', value)
  },
})

const enabledModel = computed({
  get: () => !!props.modelValue && props.enabled,
  set: (value) => {
    emit('update:enabled', value)
  },
})

const options = computed(() => {
  const formatted: { value: string | null; label: string }[] =
    props.devices.map(({ deviceId, label }) => ({
      value: deviceId,
      label,
    }))

  formatted.push({
    value: null,
    label: t('call.device.noDevice'),
  })

  return formatted
})
</script>

<template>
  <div class="flex flex-row">
    <USelect v-model="deviceIdModel" :options />
    <UButton
      :disabled="!props.modelValue"
      @click="enabledModel = !enabledModel"
    >
      {{ enabledModel ? 'Enabled' : 'Disabled' }}
    </UButton>
  </div>
</template>
