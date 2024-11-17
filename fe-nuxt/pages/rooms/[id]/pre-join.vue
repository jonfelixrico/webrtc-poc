<script setup lang="ts">
import { useResizeObserverValue } from '#imports'
import { useDevicesList } from '@vueuse/core'
import { computed, reactive, ref, useTemplateRef } from 'vue'
import CMediaStreamRendererVideo from '~/components/media-stream/CMediaStreamRendererVideo.vue'
import { useUserMediaStream } from '~/composables/media.composable'

const { audioInputs, videoInputs } = useDevicesList({
  constraints: {
    audio: true,
    video: true,
  },
  requestPermissions: true,
})

const audioId = ref<string>()
const videoId = ref<string>()

const mediaStream = useUserMediaStream(
  reactive({
    audio: audioId,
    video: videoId,
  }),
)

const videoDivRef = useTemplateRef('videoDiv')
const dimensions = useResizeObserverValue(videoDivRef)
const height = computed(() => dimensions.width * (9 / 16))
</script>

<template>
  <main class="h-dvh w-dvw flex flex-col justify-center items-center">
    <UCard class="w-[50dvw]">
      <div class="flex flex-row">
        <div ref="videoDiv" class="grow">
          <div :style="{ height: `${height}px` }">
            <CMediaStreamRendererVideo
              v-if="mediaStream"
              class="h-full w-full"
              :media-stream
            />
          </div>
        </div>

        <div class="flex flex-col justify-between gap-2 w-56">
          <div class="flex flex-col gap-2">
            <div class="flex flex-col">
              <!-- TODO i18nize -->
              <div>Video</div>
              <USelect
                v-model="videoId"
                :options="videoInputs"
                value-attribute="deviceId"
              />
            </div>

            <div class="flex flex-col">
              <!-- TODO i18nize -->
              <div>Audio</div>
              <USelect
                v-model="audioId"
                :options="audioInputs"
                value-attribute="deviceId"
              />
            </div>
          </div>

          <UButton block>Test</UButton>
        </div>
      </div>
    </UCard>
  </main>
</template>
