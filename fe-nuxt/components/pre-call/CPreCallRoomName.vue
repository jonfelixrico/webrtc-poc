<script setup lang="ts">
import { useModal } from '#imports'
import CPreCallRoomNameEditModal from '~/components/pre-call/CPreCallRoomNameEditModal.vue'

const model = defineModel({
  type: String,
  default: '',
})

const modal = useModal()
function openModal() {
  modal.open(CPreCallRoomNameEditModal, {
    onSubmit: (v) => {
      model.value = v
    },

    value: model.value,
  })
}
</script>

<template>
  <div class="gap-x-1 flex flex-row items-center justify-center">
    <span>{{ model }}</span>
    <UButton
      icon="i-material-symbols-edit-outline"
      variant="ghost"
      :ui="{ rounded: 'rounded-full' }"
      size="xs"
      color="gray"
      @click="openModal"
    />
  </div>
</template>
