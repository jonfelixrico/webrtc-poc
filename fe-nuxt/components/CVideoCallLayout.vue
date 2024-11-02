<script setup lang="ts"></script>

<template>
  <div class="h-dvh w-dvw flex flex-col">
    <!-- Video call main area -->
    <div class="grow">
      <slot />
    </div>

    <!-- Bottom toolbar -->
    <div>
      <slot name="bottom" />
    </div>
  </div>
</template>
