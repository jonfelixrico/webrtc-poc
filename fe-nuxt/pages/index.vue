<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="h-dvh w-dvh flex flex-row justify-center items-center">
    <UCard>
      <div class="text-2xl font-medium">
        {{ t('common.helloWorld') }}
      </div>
    </UCard>
  </div>
</template>
