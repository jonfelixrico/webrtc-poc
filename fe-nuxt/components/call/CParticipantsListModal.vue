<script setup lang="ts">
import { useRoomStore } from '~/store/room.store'
import { computed } from 'vue'
import { useModal } from '#imports'
import { useI18n } from 'vue-i18n'

const store = useRoomStore()
const users = computed(() =>
  Object.values(store.users).sort((a, b) => a.name.localeCompare(b.name)),
)

const modal = useModal()

const { t } = useI18n()
</script>

<template>
  <UModal>
    <UCard>
      <template #header>
        <div>{{ t('call.participants') }}</div>
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
          <UButton color="primary" variant="outline" @click="modal.close">{{
            t('common.dismiss')
          }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
