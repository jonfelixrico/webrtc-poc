<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <UButton color="white" variant="ghost">
    <div class="flex flex-col items-center">
      <!-- TODO fix the icon -->
      <UIcon name="i-ri-mic-fill" class="icon-size" />
      {{ t('call.audioControl.mute') }}
    </div>
  </UButton>
</template>

<style lang="scss" scoped>
.icon-size {
  @apply w-7 h-7;
}
</style>
