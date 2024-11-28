<script setup lang="ts">
import { useModal } from '#imports'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

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

const { t } = useI18n()
</script>

<template>
  <!-- TODO i18nize -->
  <UModal>
    <UCard>
      <template #header>{{ t('preCall.roomNameEditModal.title') }}</template>
      <template #default>
        <UInput
          v-model="model"
          :placeholder="t('preCall.roomNameEditModal.placeholder')"
        />
      </template>

      <template #footer>
        <div class="flex flex-row justify-end gap-x-1">
          <UButton variant="outline" color="gray" @click="modal.close">{{
            t('common.cancel')
          }}</UButton>
          <UButton @click="emitValue">{{ t('common.submit') }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
