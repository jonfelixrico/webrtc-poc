import type { Meta, StoryObj } from '@storybook/vue3'
import Renderer from './JModalAggregator.vue'
import { useBodyScrollManager } from '@/utils/useBodyScroll'
import { useModalActions, useProvideModalManager } from './useModal'
import DemoModal from './DemoModal.storybook.vue'
import { useZIndexManager } from '@/utils/useZIndex'

const meta: Meta = {
  decorators: [
    (story) => {
      return {
        components: { story, Renderer },

        setup() {
          useBodyScrollManager()
          useProvideModalManager()
          useZIndexManager()
        },

        template: `
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

export const Default: Story = {
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
