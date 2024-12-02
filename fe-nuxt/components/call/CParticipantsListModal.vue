<script setup lang="ts">
import { useRoomStore } from '~/store/room.store'
import { computed } from 'vue'
import { useModal } from '#imports'

const store = useRoomStore()
const users = computed(() =>
  Object.values(store.users).sort((a, b) => a.name.localeCompare(b.name)),
)

const modal = useModal()
</script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <!-- TODO i18nize -->
        <div>Participants</div>
      </template>

      <template #default>
        <!-- TODO properly style this -->
        <div class="flex flex-col gap-y-2">
          <div v-for="user of users" :key="user.id">
            {{ user }}
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex flex-row justify-end gap-x-2">
          <!-- TODO i18nize -->
          <UButton @click="modal.close">Close</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
