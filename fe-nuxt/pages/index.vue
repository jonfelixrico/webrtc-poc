<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const roomId = ref<string>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-row gap-4 w-dvw h-dvh">
    <div class="flex-1 flex flex-row items-center justify-center gap-2">
      <UInput v-model="roomId" />
      <NuxtLink :to="`/rooms/${roomId}`">
        <UButton type="submit">{{ t('preCall.joinCall') }}</UButton>
      </NuxtLink>
    </div>

    <div class="flex-1 flex flex-row items-center justify-center">
      <NuxtLink to="/rooms/create">
        <UButton>{{ t('preCall.createRoom') }}</UButton>
      </NuxtLink>
    </div>
  </div>
</template>
