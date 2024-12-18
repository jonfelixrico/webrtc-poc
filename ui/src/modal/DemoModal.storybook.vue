<script setup lang="ts">
import JModal from '@/modal/JModal.vue'
import { useProgrammaticModalOpen } from '@/modal/useProgrammaticModal'
import DemoModal from '@/modal/DemoModal.storybook.vue'

const open = useProgrammaticModalOpen()
function recursivelyOpen() {
  open(DemoModal)
}
</script>

<template>
  <JModal v-slot="{ hide }">
    <div class="flex flex-col gap-y-2 p-2 bg-white">
      <button @click="hide">Close</button>
      <button @click="recursivelyOpen">Open</button>
    </div>
  </JModal>
</template>
