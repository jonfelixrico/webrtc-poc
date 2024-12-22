<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoomStore } from '~/store/room.store'
import { computed, ref } from 'vue'
import { useUserId } from '~/composables/room-composables'
import { useModal } from '#imports'
import CUserEditModal from '~/components/call/CUserEditModal.vue'
import { JModal } from '@webrtcpoc/ui/modal'

const { t } = useI18n()

const store = useRoomStore()
const users = computed(() =>
  Object.values(store.users).sort((a, b) => a.name.localeCompare(b.name)),
)
const appUserId = useUserId()

const isModalOpen = ref(false)

const modal = useModal()
function openEditModal() {
  if (!appUserId.value) {
    return
  }

  const appUser = store.users[appUserId.value]
  if (!appUser) {
    return
  }

  modal.open(CUserEditModal, {
    name: appUser.name,
  })
}
</script>

<template>
  <UButton color="white" variant="ghost" @click="isModalOpen = true">
    <div class="flex flex-col items-center relative">
      <!-- TODO fix the icon -->
      <UIcon name="i-mdi-account-multiple" class="icon-size" />
      {{ t('call.participants') }}

      <div
        class="h-full w-full absolute z-10 flex flex-row justify-end items-start"
      >
        {{ users.length }}
      </div>
    </div>
  </UButton>

  <JModal v-model="isModalOpen">
    <UCard
      :ui="{
        body: {
          padding: '',
        },
      }"
    >
      <template #header>
        <div>{{ t('call.participants') }}</div>
      </template>

      <template #default>
        <div class="flex flex-col">
          <template v-for="(user, index) of users" :key="user.id">
            <div class="flex flex-row py-4 px-8 items-center">
              <div class="grow">
                {{ user.name }}
              </div>

              <UButton
                v-if="user.id === appUserId"
                variant="ghost"
                icon="i-tabler-dots-vertical"
                class="rounded-full"
                @click="openEditModal"
              />
            </div>

            <UDivider v-if="index < users.length - 1" />
          </template>
        </div>
      </template>

      <template #footer>
        <div class="flex flex-row justify-end gap-x-2">
          <UButton
            color="primary"
            variant="outline"
            @click="isModalOpen = false"
            >{{ t('common.dismiss') }}</UButton
          >
        </div>
      </template>
    </UCard>
  </JModal>
</template>

<style lang="scss" scoped>
.icon-size {
  @apply w-7 h-7;
}
</style>
