<script setup lang="ts">
const roomJoinModel = ref()
const router = useRouter()

function goToRoom(roomId: string) {
  router.push({
    path: `/rooms/${roomId}`,
  })
}

async function createRoom() {
  // TODO proxy the BE to be under /be
  const { roomId } = await $fetch<{ roomId: string }>('/be/room', {
    method: 'POST',
  })

  goToRoom(roomId)
}
</script>

<template>
  <div class="flex flex-row gap-4 w-dvw h-dvh">
    <form
      @submit.prevent="goToRoom(roomJoinModel)"
      class="flex-1 flex flex-row items-center justify-center gap-2"
    >
      <UInput v-model="roomJoinModel" />
      <UButton type="submit">Call</UButton>
    </form>

    <div class="flex-1 flex flex-row items-center justify-center">
      <UButton @click="createRoom">Create a Room</UButton>
    </div>
  </div>
</template>
