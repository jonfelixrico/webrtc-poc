import type { Meta, StoryObj } from '@storybook/vue3'
import Target from './JModalTarget.vue'
import { useBodyScrollManager } from '@/utils/useBodyScroll'
import { useModalActions, useProvideModalManager } from './useModalManager'
import Renderer from './JProgrammaticModalsRenderer.vue'
import DemoModal from './DemoModal.storybook.vue'
import { useZIndexManager } from '@/utils/useZIndex'

const meta: Meta = {
  decorators: [
    (story) => {
      return {
        components: { story, Target, Renderer },

        setup() {
          useBodyScrollManager()
          useProvideModalManager()
          useZIndexManager()
        },

        template: `
          <Target />
          <story />  
          <Renderer />
        `,
      }
    },
  ],
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj

export const Defualt: Story = {
  args: {
    default: 'Content',
    modelValue: false,
  },

  render: () => ({
    setup() {
      const { open } = useModalActions()
      function openModal() {
        open(DemoModal)
      }

      return {
        openModal,
      }
    },

    template: `
      <button @click="openModal">Open a modal</button>
    `,
  }),
}
