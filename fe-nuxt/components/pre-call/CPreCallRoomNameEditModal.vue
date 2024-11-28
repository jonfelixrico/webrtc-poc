<script setup lang="ts">
import { useModal } from '#imports'
import { ref } from 'vue'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const model = ref(props.value)

const modal = useModal()
const emit = defineEmits<{
  (e: 'submit', value: string): void
}>()
function emitValue() {
  emit('submit', model.value)
  modal.close()
}
</script>

<template>
  <!-- TODO i18nize -->
  <UModal>
    <UCard>
      <template #header> Edit Room Name </template>
      <template #default>
        <UInput v-model="model" placeholder="Input room name" />
      </template>

      <template #footer>
        <div class="flex flex-row justify-end gap-x-1">
          <UButton variant="outline" color="gray" @click="modal.close"
            >Cancel</UButton
          >
          <UButton @click="emitValue">Submit</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
