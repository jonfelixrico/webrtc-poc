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
    <!-- TODO add an actual edit icon button -->
    <UButton @click="openModal">Edit</UButton>
  </div>
</template>
