<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoomStore } from '~/store/room.store'
import { computed } from 'vue'

const { t } = useI18n()

const store = useRoomStore()
const count = computed(() => Object.keys(store.users).length)
</script>

<template>
  <UButton color="white" variant="ghost">
    <div class="flex flex-col items-center relative">
      <!-- TODO fix the icon -->
      <UIcon name="i-ri-mic-fill" class="icon-size" />
      {{ t('call.participants') }}

      <div
        class="h-full w-full absolute z-10 flex flex-row justify-end items-start"
      >
        {{ count }}
      </div>
    </div>
  </UButton>
</template>

<style lang="scss" scoped>
.icon-size {
  @apply w-7 h-7;
}
</style>
