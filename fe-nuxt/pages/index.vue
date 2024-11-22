<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const roomJoinModel = ref()
const router = useRouter()

function goToRoom(roomId: string) {
  router.push({
    path: `/rooms/${roomId}`,
  })
}

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-row gap-4 w-dvw h-dvh">
    <form
      class="flex-1 flex flex-row items-center justify-center gap-2"
      @submit.prevent="goToRoom(roomJoinModel)"
    >
      <UInput v-model="roomJoinModel" />
      <UButton type="submit">{{ t('preCall.joinCall') }}</UButton>
    </form>

    <div class="flex-1 flex flex-row items-center justify-center">
      <NuxtLink to="/rooms/create">
        <UButton>{{ t('preCall.createRoom') }}</UButton>
      </NuxtLink>
    </div>
  </div>
</template>
