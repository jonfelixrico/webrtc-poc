<script setup lang="ts">
import { ref } from '#imports'
import { JModal, useLocalModalActions } from '@webrtcpoc/ui/modal'

const props = defineProps<{
  name: string
}>()

const model = ref(props.name)

const emit = defineEmits<{
  submit: [string]
}>()

const modal = useLocalModalActions()

function submit() {
  emit('submit', model.value)
  modal.close()
}
</script>

<template>
  <JModal v-slot="{ hide }">
    <form @submit.prevent="submit">
      <UCard>
        <template #header> Edit User </template>

        <template #default>
          <UInput v-model="model" placeholder="Enter a name..." />
        </template>

        <template #footer>
          <div class="flex flex-row justify-end">
            <UButton @click="hide">Cancel</UButton>
            <UButton type="submit" :disabled="model.length === 0">Save</UButton>
          </div>
        </template>
      </UCard>
    </form>
  </JModal>
</template>
