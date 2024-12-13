<script setup lang="ts">
import { useRoomStore } from '~/store/room.store'
import { computed } from 'vue'
import { useModal } from '#imports'
import { useI18n } from 'vue-i18n'
import { useUserId } from '~/composables/room-composables'

const store = useRoomStore()
const users = computed(() =>
  Object.values(store.users).sort((a, b) => a.name.localeCompare(b.name)),
)
const appUserId = useUserId()

const modal = useModal()

const { t } = useI18n()
</script>

<template>
  <UModal>
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
              />
            </div>

            <UDivider v-if="index < users.length - 1" />
          </template>
        </div>
      </template>

      <template #footer>
        <div class="flex flex-row justify-end gap-x-2">
          <UButton color="primary" variant="outline" @click="modal.close">{{
            t('common.dismiss')
          }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
