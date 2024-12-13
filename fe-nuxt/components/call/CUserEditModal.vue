<script setup lang="ts">
import { ref, useModal } from '#imports'

const props = defineProps<{
  name: string
}>()

const model = ref(props.name)

const emit = defineEmits<{
  submit: [string]
}>()
function submit() {
  emit('submit', model.value)
}

const modal = useModal()
</script>

<template>
  <UModal>
    <form @submit.prevent="submit">
      <UCard>
        <template #header> Edit User </template>

        <template #default>
          <UInput v-model="model" placeholder="Enter a name..." />
        </template>

        <template #footer>
          <div class="flex flex-row justify-end">
            <UButton @click="modal.close">Cancel</UButton>
            <UButton type="submit" :disabled="model.length === 0">Save</UButton>
          </div>
        </template>
      </UCard>
    </form>
  </UModal>
</template>
